import { Component, Output, EventEmitter } from '@angular/core';
import { CustomFormControl } from '../../shared/angular-helpers';
import { Validators } from '@angular/forms';
import { Category } from '../../shared/models/category';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent {
  nameFormControl = new CustomFormControl('', [Validators.required]);

  @Output() submitted = new EventEmitter<Category>();

  submit() {
    [this.nameFormControl].forEach(f => { f.markAsDirty() })
    if (this.nameFormControl.invalidOrEmpty) return

    const category = new Category(this.nameFormControl.value)
    this.submitted.emit(category);
  }
}
