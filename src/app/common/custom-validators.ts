import { AbstractControl } from "@angular/forms";

export abstract class CustomValidators {

    static proportionRangeValidator(control: AbstractControl): { [key: string]: boolean } | null {
        if (control.value !== undefined && (isNaN(control.value) || control.value === 0 || control.value > 99)) {
            return { 'proportionRange': true };
        }
        return null;
    }

   
 }