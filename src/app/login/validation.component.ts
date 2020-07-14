import { ErrorStateMatcher } from '@angular/material/core';
import { FormGroupDirective, FormControl, NgForm, ValidationErrors, FormGroup, ValidatorFn } from '@angular/forms';


export class userData {
  constructor(public id: number, public username: string, public password: string, public logged = false, public idSource?: string) {
  }
}
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

export const userMatchValidator = (username: string, password: string, users: userData[]): ValidatorFn => {
  return (formGroup: FormGroup): ValidationErrors | null => {
    console.log('USRNM', username, 'PASSWD', password);
    console.log('USRNM2', users[0].username, 'PASSWD2', users[0].password);
    if (checkUsername(username, users) && checkPassword(password, users)) {
      return { userMismatch: false };
    }
    else {
      return { userMismatch: true };
    }
  };
};
export const checkUsername = (username: string, users: userData[]): any => {
  if (users.find(user => user.username === username)) {
    return true;
  } else {
    return false;
  }
}
export const checkPassword = (password: string, users: userData[]): boolean => {
  if (users.find(user => user.password === password)) {
    return true;
  } else {
    return false;
  }
}
