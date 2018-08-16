import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { CustomFormControl } from '../../shared/angular-helpers';
import { Validators } from '@angular/forms';
import { Category } from '../../shared/category';

@Component({
  selector: 'app-add-category-dialog',
  templateUrl: './add-category-dialog.component.html',
  styleUrls: ['./add-category-dialog.component.css']
})
export class AddCategoryDialogComponent implements OnInit {
  nameFormControl = new CustomFormControl('', [Validators.required]);

  constructor(private dialogRef: MatDialogRef<AddCategoryDialogComponent>) { }

  ngOnInit() { }

  submit() {
    [this.nameFormControl].forEach(f => { f.markAsDirty() })
    if (this.nameFormControl.invalidOrEmpty) return

    const category = new Category(this.nameFormControl.value)
    this.dialogRef.close(category);
  }
}
