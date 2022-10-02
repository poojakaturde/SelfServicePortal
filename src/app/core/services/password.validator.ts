import { FormControl } from '@angular/forms';

export interface ValidationResult {
    status?: boolean;
    msg?: string;
}

export class PasswordValidator {

    public static strong(control: FormControl): ValidationResult {
        let msg= 'A password should contain';
        let isValid: boolean = true;
        // if(!(/\d/.test(control.value))) {
        //     msg = msg + ' atleast a digit';
        //     isValid = false;
        // }
        if(!(/[A-Z]/.test(control.value))) {
            msg = msg + ' an uppercase';
            isValid = false;
        }
        if(!(/[a-z]/.test(control.value))) {
            msg = msg + ' and lowercase characters.';
            isValid = false;
        }
        if(/[&+,:;=\\?\\[\\\]\\{\\}_`~|/'<>.*()%-]/.test(control.value)) {
            msg = msg + ' the special characters from the list @ # ! $ ^';
            isValid = false;
        }
        // if(!(/[@#!$^]/.test(control.value))) {
        //     msg = msg + ' atleast @ # ! $ ^';
        //     isValid = false;
        // }
        if(control.value && (control.value.length < 8 || control.value.length > 12)) {
            msg = `${isValid ? 'A password should be minimum 8 characters long.' : msg + ' and in between 8 to 12'}`;
            isValid = false;
        } 
        msg = msg + ' ';
        if (!isValid && control.dirty) {
            return { msg: msg };
        }
        return null as any;
    }
}