import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatSnackBar } from '@angular/material';
import { Validators } from '@angular/forms';
import { Task, getStatuses } from '../../shared/models/task';
import { CustomFormControl } from '../../shared/angular-helpers';
import { TimeloggingService } from '../../shared/timelogging.service';
import { Category } from '../../shared/models/category';
import { AddCategoryComponent } from '../add-category/add-category.component';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent implements OnInit {
  private _statuses: any[]

  nameFormControl = new CustomFormControl('', [Validators.required]);
  categoryFormControl = new CustomFormControl('', [Validators.required]);
  weeklyMinutesFormControl = new CustomFormControl('', [Validators.required]);
  statusFormControl = new CustomFormControl(0, [Validators.required]);

  @Output() submitted = new EventEmitter<Task>();

  get statuses() {
    if (this._statuses) return this._statuses
    this._statuses = getStatuses().slice(0, 2)
    return this._statuses
  }

  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public categories: string[],
    public snackBar: MatSnackBar,
    private timeloggingService: TimeloggingService) {

  }

  ngOnInit() {
    this.categoryFormControl.valueChanges.subscribe(this.categoryChange)
  }

  categoryChange = (categoryName) => {
    if (categoryName !== "addNew") return

    const dialogRef = this.dialog.open(AddCategoryComponent, {
      width: "400px"
    })
    dialogRef.componentInstance.submitted.subscribe(async (category: Category) => {
      dialogRef.close()
      try {
        await this.timeloggingService.insertCategory(category)
        this.snackBar.open(`category '${category.name}' added`, "OK", { duration: 5000 })
        this.categories.push(category.name)
        this.categoryFormControl.setValue(category.name)
      } catch (ex) {
        this.snackBar.open(`error: ${ex.message}`, "OK", { duration: 5000 })
        this.categoryFormControl.reset()
      }
    });
    dialogRef.backdropClick().subscribe(() => {
      this.categoryFormControl.reset()
    })
  }

  submit() {
    if (this.nameFormControl.invalidOrEmpty || this.categoryFormControl.invalidOrEmpty
      || this.weeklyMinutesFormControl.invalidOrEmpty || this.statusFormControl.invalidOrEmpty) {
      [this.nameFormControl, this.categoryFormControl, this.weeklyMinutesFormControl, this.statusFormControl]
        .forEach(f => { f.markAsDirty() })
      return
    }

    const task = new Task(this.categoryFormControl.value, this.nameFormControl.value,
      this.weeklyMinutesFormControl.value, this.statusFormControl.value)

    this.submitted.emit(task)
  }
}
