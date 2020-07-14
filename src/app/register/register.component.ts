import { Component, OnInit, Inject } from '@angular/core';
import { userData, MyErrorStateMatcher } from '../login/validation.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { userSourceService } from '../_services/users.service';
import { FormControl, Validators } from '@angular/forms';
import { find, map } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(registerDialog, {
      width: '370px'
    });
  }
}

@Component({
  selector: 'registerDialog',
  templateUrl: './registerDialog.html',
  styleUrls: ['./register.component.scss']
})

export class registerDialog implements OnInit {

  hide = true;

  username = '';
  password = '';
  confirmPassword = '';

  registerConfirmation = true;

  users: userData[];
  public userToAdd: userData = new userData(null, '', '', false);

  usernameFormControl = new FormControl('', [Validators.required]);
  passwordFormControl = new FormControl('', [Validators.required]);
  confirmPasswordFormControl = new FormControl('', [Validators.required]);

  matcher = new MyErrorStateMatcher();

  constructor(
    public dialogRef: MatDialogRef<registerDialog>,
    @Inject(MAT_DIALOG_DATA) public input: userData, public userService: userSourceService) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  register(): void {
    const findUser = this.users.find(x => x.username === this.username) ? true : false;
    const comparePasswords = (this.password === this.confirmPassword) ? true : false;
    const minMaxNameLen = (this.username.length >= 3 && this.username.length <= 12) ? true : false;
    const minPasswordLen = (this.password.length >= 6) ? true : false;
    const maxUserID = this.users.reduce((a, b) => a.id > b.id ? a : b).id;

    console.log('Max: ' + maxUserID);
    if (findUser) {
      this.usernameFormControl.setErrors({ 'sameUsername': true });
      this.registerConfirmation = false;
    }
    if (!comparePasswords) {
      this.passwordFormControl.setErrors({ 'notconfirmed': true });
      this.confirmPasswordFormControl.setErrors({ 'notconfirmed': true });
      this.registerConfirmation = false;
    }
    if (!minMaxNameLen) {
      this.usernameFormControl.setErrors({ 'minMaxNameLen': true });
      this.registerConfirmation = false;
    }
    if (!minPasswordLen) {
      this.confirmPasswordFormControl.setErrors({ 'minPassLen': true });
      this.passwordFormControl.setErrors({ 'minPassLen': true });
      this.registerConfirmation = false;
    }
    if (this.registerConfirmation) {
      this.userToAdd.id = maxUserID + 1;
      this.userToAdd.username = this.username;
      this.userToAdd.password = this.password;
      console.log(this.userToAdd);
      this.userService.addUsers(this.userToAdd);
      this.dialogRef.close();
    }
  }
}
