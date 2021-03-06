import { Component, OnInit, Inject, Output, DoCheck, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { userMatchValidator, MyErrorStateMatcher } from './validation.component';
import { EventEmitter } from '@angular/core';
import { userService } from '../_services/user.service';
import { userSourceService } from '../_services/users.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { userData } from '../userData';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})


export class LoginComponent implements OnInit, DoCheck {

  public username: string;
  password: string;
  public userLogged = false;

  singleUserData: userData;

  constructor(public dialog: MatDialog, private userSource: userService) {
  }

  ngOnInit(): void {
  }
  ngDoCheck(): void {
  }

  openDialog() {
    const dialogRef = this.dialog.open(loginDialog, {
      width: '300px',
      data: { username: this.username, password: this.password }
    });
    const sub = dialogRef.componentInstance.eventTask.subscribe((userSource) => {
      this.singleUserData = userSource;
      this.userLogged = this.singleUserData.logged;
      this.userSource.changeUserProperties(this.singleUserData);
    });
    dialogRef.afterClosed().subscribe(() => {
      sub.unsubscribe();
    });
  }
}




@Component({
  selector: 'loginDialog',
  templateUrl: './loginDialog.html',
  styleUrls: ['./login.component.scss']
})
export class loginDialog implements OnInit, OnDestroy {
  hide = true;

  loginFormControl = new FormControl('', [Validators.required]);
  passwordFormControl = new FormControl('', [Validators.required]);

  public validUser: boolean;
  public closeDialog = false;
  matcher = new MyErrorStateMatcher();

  userDataTemp: userData = { id: null, username: '', password: '', logged: false };
  userLogged = false;
  users: userData[];

  @Output()
  eventTask = new EventEmitter<userData>();

  isLogged() {
    this.eventTask.emit(this.userDataTemp);
  }

  password: any;
  formGroup: FormGroup;

  ngOnInit(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
  }
  ngOnDestroy(): void {

  }

  constructor(
    public dialogRef: MatDialogRef<loginDialog>, @Inject(MAT_DIALOG_DATA) public input: userData,
    public userService: userSourceService, private formBuilder: FormBuilder, private snackBar: MatSnackBar) {
  }

  openSnackBar() {
    this.snackBar.open('Successfully logged', 'Cancel', {
      duration: 700,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: ['blue-snackbar']
    });
  }

  formGroupFunction = (username: string, password: string) => {
    this.userDataTemp.username = username;

    this.formGroup = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, userMatchValidator(username, password, this.users)]]
    });
    this.validateUser();
  }

  validateUser = () => {
    if (this.formGroup.controls.password.hasError('userMismatch')) {
      this.closeDialog = false;
      this.validUser = false;
      this.passwordFormControl.setErrors({ 'userMismatch': true });
      this.loginFormControl.setErrors({ 'userMismatch': true });
    }
    else {
      this.validUser = true;
      this.closeDialog = true;
      this.passwordFormControl.setErrors({ 'userMismatch': false });
      this.loginFormControl.setErrors({ 'userMismatch': false });
    }
    if (this.closeDialog === true) {
      this.dialogRef.close();
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  authentication(username: string, password: string) {
    // tslint:disable-next-line: forin
    for (let it in this.users) {
      if (this.users[it].username === username && this.users[it].password === password) {
        this.userLogged = true;
        this.users[it].logged = true;
        this.userDataTemp.logged = true;
        this.userService.changeUserStatus(this.users[it]);
        this.openSnackBar();
      }
    }
    this.formGroupFunction(username, password);
  }
}
