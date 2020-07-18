import { Component, OnInit, Input, OnChanges, Inject } from '@angular/core';
import { userData } from '../login/validation.component';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { userSourceService } from '../_services/users.service';

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

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openOptions(): void {
    const dialogRef = this.dialog.open(optionsDialog, {
      width: '500px',
      height: '500px',
      data: {
        username: this.username
      }
    });
  }

}

@Component({
  selector: 'optionsDialog',
  templateUrl: './optionsDialog.html',
  styleUrls: ['./options.component.scss']
})
export class optionsDialog implements OnInit, OnChanges {

  users: userData[];
  currentUser: userData = { id: null, username: '', password: '', logged: false };
  // tslint:disable-next-line: max-line-length
  constructor(public dialogRef: MatDialogRef<optionsDialog>, @Inject(MAT_DIALOG_DATA) public username: string, public userService: userSourceService) { }

  ngOnInit(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
      const a = JSON.stringify(this.username)
      const name = a.substring(13, (a.length - 2));
      this.currentUser = this.users.find(x => x.username === name);
    });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnChanges(): void {

  }
}
