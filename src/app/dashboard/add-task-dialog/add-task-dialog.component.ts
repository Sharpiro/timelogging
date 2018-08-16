import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatSnackBar } from '@angular/material';
import { Validators } from '@angular/forms';
import { Task, TaskStatus } from '../../shared/models/task';
import { CustomFormControl } from '../../shared/angular-helpers';
import { AddCategoryDialogComponent } from '../add-category-dialog/add-category-dialog.component';
import { TimeloggingService } from '../../shared/timelogging.service';
import { Category } from '../../shared/category';

@Component({
  selector: 'app-add-task-dialog',
  templateUrl: './add-task-dialog.component.html',
  styleUrls: ['./add-task-dialog.component.css']
})
export class AddTaskDialogComponent implements OnInit {
  nameFormControl: CustomFormControl
  categoryFormControl: CustomFormControl
  weeklyMinutesFormControl: CustomFormControl
  statusFormControl: CustomFormControl

  _statuses: any[]

  get statuses() {
    if (this._statuses) return this._statuses
    const list = []
    let keys = Object.keys(TaskStatus).filter(k => typeof TaskStatus[k as any] === "number")
    if (this.viewModel.mode == "New") {
      keys = keys.slice(0, 2)
    }
    for (const key of keys) {
      list.push({ name: key, num: TaskStatus[key] })
    }
    this._statuses = list
    return this._statuses
  }

  constructor(
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<AddTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public viewModel: TaskDialogModel,
    public snackBar: MatSnackBar,
    private timeloggingService: TimeloggingService) {
    if (!viewModel.currentTask) {
      this.nameFormControl = new CustomFormControl('', [Validators.required]);
      this.categoryFormControl = new CustomFormControl('', [Validators.required]);
      this.weeklyMinutesFormControl = new CustomFormControl('', [Validators.required]);
      this.statusFormControl = new CustomFormControl(0, [Validators.required]);
      return
    }
    this.nameFormControl = new CustomFormControl({ value: viewModel.currentTask.name, disabled: true }, [Validators.required]);
    this.categoryFormControl = new CustomFormControl({ value: viewModel.currentTask.category, disabled: true }, [Validators.required]);
    this.weeklyMinutesFormControl = new CustomFormControl(viewModel.currentTask.weeklyGoalMinutes, [Validators.required]);
    this.statusFormControl = new CustomFormControl(viewModel.currentTask.status, [Validators.required]);
  }

  ngOnInit() {
    this.categoryFormControl.valueChanges.subscribe(this.categoryChange)
  }

  categoryChange = (categoryName) => {
    if (categoryName != "addNew") return

    const dialogRef = this.dialog.open(AddCategoryDialogComponent, {
      width: "400px"
    })
    dialogRef.afterClosed().subscribe(async (category: Category) => {
      if (!category) {
        this.categoryFormControl.reset()
        return
      }
      try {
        await this.timeloggingService.insertCategory(category)
        this.snackBar.open(`category '${category.name}' added`, "OK", { duration: 5000 })
        this.viewModel.categories.push(category.name)
        this.categoryFormControl.setValue(category.name)
      }
      catch (ex) {
        this.snackBar.open(`error: ${ex.message}`, "OK", { duration: 5000 })
        this.categoryFormControl.reset()
      }
    });
  }

  submit() {
    if (this.nameFormControl.invalidOrEmpty || this.categoryFormControl.invalidOrEmpty
      || this.weeklyMinutesFormControl.invalidOrEmpty || this.statusFormControl.invalidOrEmpty) {
      [this.nameFormControl, this.categoryFormControl, this.weeklyMinutesFormControl, this.statusFormControl]
        .forEach(f => { f.markAsDirty() })
      return
    }

    const weeklyMinutesGoal = +this.weeklyMinutesFormControl.value
    if (isNaN(weeklyMinutesGoal)) throw new Error("Unable to parse weekly minutes")

    let task: Task;
    if (this.viewModel.mode == "New") {
      task = new Task(this.categoryFormControl.value, this.nameFormControl.value, weeklyMinutesGoal, this.statusFormControl.value)
    } else {
      if (!this.weeklyMinutesFormControl.dirty && !this.statusFormControl.dirty) {
        this.snackBar.open("task is unmodified", "OK", { duration: 5000 })
        return
      }
      task = this.viewModel.currentTask
      task.weeklyGoalMinutes = weeklyMinutesGoal
      task.status = this.statusFormControl.value
    }

    this.dialogRef.close(task);
  }
}

export interface TaskDialogModel {
  mode: "New" | "Edit"
  categories: string[]
  currentTask?: Task
}
