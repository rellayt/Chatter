import { Component, OnInit, Input } from '@angular/core';
import { userData } from '../userData';
import { userSourceService } from '../_services/users.service';

@Component({
  selector: 'app-chatter',
  templateUrl: './chatter.component.html',
  styleUrls: ['./chatter.component.scss']
})
export class ChatterComponent implements OnInit {
  currentUser: userData = { id: null, username: '', password: '', logged: false };
  pickedChannel = 1;


  @Input()
  username: string;

  @Input()
  userLogged: boolean;

  users: userData[];

  constructor(public userService: userSourceService) { }

  checkIfLogged(): boolean {
    if (this.currentUser) {
      if (this.currentUser.logged) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  ngOnInit(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
      this.currentUser = this.users.find(x => x.username === this.username);
    });

  }
  changeChannel(channelId: number) {
    this.pickedChannel = channelId;
  }
}
