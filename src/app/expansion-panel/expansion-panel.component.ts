import { Component, OnInit, Input, OnChanges, Inject } from '@angular/core';
import { MyErrorStateMatcher } from '../login/validation.component';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { userSourceService } from '../_services/users.service';
import { fileService } from '../_services/file.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { userData } from '../userData';

export interface DialogData {
  username: string;
  logged: boolean;
}

@Component({
  selector: 'app-expansion-panel',
  templateUrl: './expansion-panel.component.html',
  styleUrls: ['./expansion-panel.component.scss']
})
export class ExpansionPanelComponent implements OnInit {

  @Input()
  isLogged: boolean;
  @Input()
  username: string;

  users: userData[];
  currentUser: userData = { id: null, username: '', password: '', logged: false };

  constructor(private snackBar: MatSnackBar, public dialog: MatDialog, public userService: userSourceService) { }

  ngOnInit(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
      this.currentUser = this.users.find(x => x.username === this.username);
    });
  }

  openOptions(): void {
    const dialogRef = this.dialog.open(optionsDialog, {
      width: '500px',
      height: 'auto',
      data: {
        username: this.username,
        logged: this.isLogged
      }
    });
  }

  logout() {
    this.currentUser.logged = false;
    this.userService.changeUserStatus(this.currentUser);
    this.isLogged = false;
    this.openSnackBar();
  }
  openSnackBar() {
    this.snackBar.open('Logged out', 'Cancel', {
      duration: 700,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: ['blue-snackbar']
    });
  }
}

@Component({
  selector: 'optionsDialog',
  templateUrl: './optionsDialog.html',
  styleUrls: ['./options.component.scss']
})
export class optionsDialog implements OnInit {

  users: userData[];
  currentUser: userData = { id: null, username: '', password: '', logged: false };
  currentAvatar = '';
  isLogged = false;

  oldPasswordFormControl = new FormControl('', [Validators.required]);
  newPasswordFormControl = new FormControl('', [Validators.required]);
  confirmNewPasswordFormControl = new FormControl('', [Validators.required]);

  matcher = new MyErrorStateMatcher();

  oldPassword = '';
  newPassword = '';
  confirmNewPassword = '';

  hide = true;
  changePasswordConfirmation = true;

  checked = false;
  color: ThemePalette = 'primary';

  loading = false;
  avatarTaken = true;
  newAvatar = false;

  mode: ProgressSpinnerMode = 'indeterminate';


  // tslint:disable-next-line: max-line-length
  constructor(private snackBar: MatSnackBar, public dialogRef: MatDialogRef<optionsDialog>, @Inject(MAT_DIALOG_DATA) public dialogData: DialogData, public userService: userSourceService, public avatars: fileService) { }

  ngOnInit(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
      // const a = JSON.stringify(this.dialogData.username);
      // const name = a.substring(13, (a.length - 2));
      this.currentUser = this.users.find(x => x.username === this.dialogData.username);
    });
    this.avatars.currentAvatar.subscribe(avatar => {
      while (this.avatarTaken === false) {
        this.avatars.getAvatar(this.currentUser);
        if (this.currentUser.avatar) {
          if (avatar !== this.currentUser.avatar) {
            this.currentUser.avatar = avatar;
            this.userService.changeUserStatus(this.currentUser);
            this.loading = false;
            this.avatarTaken = true;
            this.openSnackBarRefresh();
          }
        }
      }
      while (this.newAvatar === true) {
        this.avatars.getAvatar(this.currentUser);
        if (avatar) {
          this.currentUser.avatar = avatar;
          this.userService.changeUserStatus(this.currentUser);
          this.loading = false;
          this.newAvatar = false;
        }
      }
    });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  openSnackBarSUC() {
    this.snackBar.open('Avatar has been changed', 'Cancel', {
      duration: 700,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: ['blue-snackbar']
    });
  }

  openSnackBarFAIL() {
    this.snackBar.open('Upload failed', 'Cancel', {
      duration: 1000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: ['red-snackbar']
    });
  }

  openSnackBarPassword() {
    this.snackBar.open('Password has been changed', 'Cancel', {
      duration: 700,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: ['blue-snackbar']
    });
  }

  openSnackBarRefresh() {
    this.snackBar.open("If avatar haven't changed, refresh page and re-login", 'Cancel', {
      duration: 3400,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['blue-snackbar']
    });
  }
  selectedAvatar(event: any) {
    const file: File = event.target.files[0];
    if (file.type === 'image/jpeg' || file.type === 'image/png') {
      this.avatars.putAvatar(file, this.currentUser);
      this.loading = true;
      if (this.currentUser.avatar) {
        this.avatarTaken = false;
        this.avatars.getAvatar(this.currentUser);
      } else {
        this.newAvatar = true;
        this.avatars.getAvatar(this.currentUser);
      }
      this.openSnackBarSUC();
    }
    else {
      this.openSnackBarFAIL();
    }
  }
  changePassword() {
    []
    const compareOldPasswords = (this.oldPassword === this.currentUser.password) ? true : false;
    const compareNewPasswords = (this.newPassword === this.confirmNewPassword) ? true : false;
    const minPasswordLen = (this.newPassword.length > 6) ? true : false;

    if (compareOldPasswords && compareNewPasswords && minPasswordLen) {
      this.changePasswordConfirmation = true;
    }
    if (!compareOldPasswords) {
      this.oldPasswordFormControl.setErrors({ 'samePasswords': true });
      this.changePasswordConfirmation = false;
    }
    if (!compareNewPasswords) {
      this.newPasswordFormControl.setErrors({ 'sameNewPasswords': true });
      this.confirmNewPasswordFormControl.setErrors({ 'sameNewPasswords': true });
      this.changePasswordConfirmation = false;
    }
    if (!minPasswordLen) {
      this.newPasswordFormControl.setErrors({ 'minPassLen': true });
      this.confirmNewPasswordFormControl.setErrors({ 'minPassLen': true });
      this.changePasswordConfirmation = false;
    }
    if (this.changePasswordConfirmation) {
      this.currentUser.password = this.newPassword;
      this.userService.changeUserStatus(this.currentUser);
      this.dialogRef.close();
      this.openSnackBarPassword();
    }
  }
  slideToggle() {
    this.checked = !this.checked;
  }
}
