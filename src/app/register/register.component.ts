import { Component, OnInit, Inject } from '@angular/core';
import { MyErrorStateMatcher } from '../login/validation.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { userSourceService } from '../_services/users.service';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { userData } from '../userData';

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
  date = new Date();
  registerConfirmation = true;

  users: userData[];
  public userToAdd: userData = new userData(null, '', '', false);

  usernameFormControl = new FormControl('', [Validators.required]);
  passwordFormControl = new FormControl('', [Validators.required]);
  confirmPasswordFormControl = new FormControl('', [Validators.required]);

  matcher = new MyErrorStateMatcher();

  constructor(
    public dialogRef: MatDialogRef<registerDialog>,
    @Inject(MAT_DIALOG_DATA) public input: userData, public userService: userSourceService, private snackBar: MatSnackBar) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  openSnackBar() {
    this.snackBar.open('Successfully registered', 'Cancel', {
      duration: 700,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: ['blue-snackbar']
    });
  }

  ngOnInit(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  createDate(localeDate: string, localeTime: string): string {
    const localeTimeShort = localeTime.substring(0, 5);
    return localeDate + ' ' + localeTimeShort;
  }

  register(): void {
    const findUser = this.users.find(x => x.username === this.username) ? true : false;
    const comparePasswords = (this.password === this.confirmPassword) ? true : false;
    const minMaxNameLen = (this.username.length >= 3 && this.username.length <= 12) ? true : false;
    const minPasswordLen = (this.password.length > 6) ? true : false;
    const maxUserID = this.users.reduce((a, b) => a.id > b.id ? a : b).id;

    if (!findUser && comparePasswords && minMaxNameLen && minPasswordLen) {
      this.registerConfirmation = true;
    }

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
      this.userToAdd.messagesCount = 0;
      this.userToAdd.registeredDate = this.createDate(this.date.toLocaleDateString(), this.date.toLocaleTimeString());
      this.userService.addUsers(this.userToAdd);
      this.dialogRef.close();
      this.openSnackBar();
    }
  }
}
