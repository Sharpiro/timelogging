import { FormControl } from "@angular/forms";

export class CustomFormControl extends FormControl {
  get invalidOrEmpty(): boolean {
    return this.value === undefined || this.invalid
  }
}
