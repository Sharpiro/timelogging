import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { Validators } from '@angular/forms';
import { Task, getStatuses } from '../../shared/models/task';
import { CustomFormControl } from '../../shared/angular-helpers';

@Component({
  selector: 'app-modify-task',
  templateUrl: './modify-task.component.html',
  styleUrls: ['./modify-task.component.css']
})
export class ModifyTaskComponent implements OnInit {
  private _statuses: any[]
  categories: string[]

  nameFormControl: CustomFormControl
  categoryFormControl: CustomFormControl
  weeklyMinutesFormControl: CustomFormControl
  statusFormControl: CustomFormControl

  @Output() submitted = new EventEmitter<Task>();

  get statuses() {
    if (this._statuses) return this._statuses
    this._statuses = getStatuses()
    return this._statuses
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public currentTask: Task,
    public snackBar: MatSnackBar) {
    this.nameFormControl = new CustomFormControl({ value: currentTask.name, disabled: true }, [Validators.required]);
    this.categoryFormControl = new CustomFormControl({ value: currentTask.category, disabled: true }, [Validators.required]);
    this.weeklyMinutesFormControl = new CustomFormControl(currentTask.weeklyGoalMinutes, [Validators.required]);
    this.statusFormControl = new CustomFormControl(currentTask.status, [Validators.required]);
    this.categories = [this.currentTask.category]
  }

  ngOnInit() { }

  submit() {
    if (this.weeklyMinutesFormControl.invalidOrEmpty || this.statusFormControl.invalidOrEmpty) return

    if (!this.weeklyMinutesFormControl.dirty && !this.statusFormControl.dirty) {
      this.snackBar.open("task is unmodified", "OK", { duration: 5000 })
      return
    }
    this.currentTask.weeklyGoalMinutes = this.weeklyMinutesFormControl.value
    this.currentTask.status = this.statusFormControl.value

    this.submitted.emit(this.currentTask)
  }
}
