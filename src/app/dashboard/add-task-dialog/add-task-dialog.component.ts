import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { Task } from '../../shared/models/task';

export class CustomFormControl extends FormControl {
  get invalidOrEmpty(): boolean {
    return !this.value || this.invalid
  }
}

@Component({
  selector: 'app-add-task-dialog',
  templateUrl: './add-task-dialog.component.html',
  styleUrls: ['./add-task-dialog.component.css']
})
export class AddTaskDialogComponent implements OnInit {
  nameFormControl = new CustomFormControl('', [
    Validators.required
  ]);
  categoryFormControl = new CustomFormControl('', [
    Validators.required
  ]);
  weeklyMinutesFormControl = new CustomFormControl('', [
    Validators.required
  ]);

  constructor(
    public dialogRef: MatDialogRef<AddTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() { }

  submit() {
    [this.nameFormControl, this.categoryFormControl, this.weeklyMinutesFormControl].forEach(f => { f.markAsDirty() })
    if (this.nameFormControl.invalidOrEmpty || this.categoryFormControl.invalidOrEmpty || this.weeklyMinutesFormControl.invalidOrEmpty)
      return

    const weeklyMinutesGoal = +this.weeklyMinutesFormControl.value
    if (isNaN(weeklyMinutesGoal)) throw new Error("Unable to parse weekly minutes")
    
    const task = new Task(this.categoryFormControl.value, this.nameFormControl.value, weeklyMinutesGoal)
    this.dialogRef.close(task);
  }
}
