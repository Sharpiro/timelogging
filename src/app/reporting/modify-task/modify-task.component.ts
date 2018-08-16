import { Component, OnInit, Inject } from '@angular/core';
import { CustomFormControl } from '../../shared/angular-helpers';
import { Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Task } from '../../shared/models/task';

@Component({
  selector: 'app-modify-task',
  templateUrl: './modify-task.component.html',
  styleUrls: ['./modify-task.component.css']
})
export class ModifyTaskComponent implements OnInit {
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
    public dialogRef: MatDialogRef<ModifyTaskComponent>,
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
