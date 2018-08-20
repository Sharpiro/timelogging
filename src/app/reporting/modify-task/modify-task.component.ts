import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatSnackBar } from '@angular/material';
import { Validators } from '@angular/forms';
import { Task, TaskStatus } from '../../shared/models/task';
import { CustomFormControl } from '../../shared/angular-helpers';
import { TaskDialogModel } from '../../shared/models/task-dialog-model';

@Component({
  selector: 'app-modify-task',
  templateUrl: './modify-task.component.html',
  styleUrls: ['./modify-task.component.css']
})
export class ModifyTaskComponent implements OnInit {
  private _statuses: any[]

  nameFormControl: CustomFormControl
  categoryFormControl: CustomFormControl
  weeklyMinutesFormControl: CustomFormControl
  statusFormControl: CustomFormControl

  @Output() submitted = new EventEmitter<Task>();

  get statuses() {
    if (this._statuses) return this._statuses
    const list = []
    let keys = Object.keys(TaskStatus).filter(k => typeof TaskStatus[k as any] === "number")
    for (const key of keys) {
      list.push({ name: key, num: TaskStatus[key] })
    }
    this._statuses = list
    return this._statuses
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public viewModel: TaskDialogModel,
    public snackBar: MatSnackBar) {
    this.nameFormControl = new CustomFormControl({ value: viewModel.currentTask.name, disabled: true }, [Validators.required]);
    this.categoryFormControl = new CustomFormControl({ value: viewModel.currentTask.category, disabled: true }, [Validators.required]);
    this.weeklyMinutesFormControl = new CustomFormControl(viewModel.currentTask.weeklyGoalMinutes, [Validators.required]);
    this.statusFormControl = new CustomFormControl(viewModel.currentTask.status, [Validators.required]);
  }

  ngOnInit() { }

  submit() {
    if (this.weeklyMinutesFormControl.invalidOrEmpty || this.statusFormControl.invalidOrEmpty) return

    if (!this.weeklyMinutesFormControl.dirty && !this.statusFormControl.dirty) {
      this.snackBar.open("task is unmodified", "OK", { duration: 5000 })
      return
    }
    this.viewModel.currentTask.weeklyGoalMinutes = this.weeklyMinutesFormControl.value
    this.viewModel.currentTask.status = this.statusFormControl.value

    this.submitted.emit(this.viewModel.currentTask)
  }
}
