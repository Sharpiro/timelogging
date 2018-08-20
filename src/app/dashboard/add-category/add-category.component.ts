import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { CustomFormControl } from '../../shared/angular-helpers';
import { Validators } from '@angular/forms';
import { Category } from '../../shared/category';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent implements OnInit {
  nameFormControl = new CustomFormControl('', [Validators.required]);

  @Output() submitted = new EventEmitter<Category>();

  constructor(private dialogRef: MatDialogRef<AddCategoryComponent>) { }

  ngOnInit() { }

  submit() {
    [this.nameFormControl].forEach(f => { f.markAsDirty() })
    if (this.nameFormControl.invalidOrEmpty) return

    const category = new Category(this.nameFormControl.value)
    this.submitted.emit(category);
  }
}
