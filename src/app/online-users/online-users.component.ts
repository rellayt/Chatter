import { Component, OnInit } from '@angular/core';
import { userSourceService } from '../_services/users.service';
import { userData } from '../userData';

@Component({
  selector: 'app-online-users',
  templateUrl: './online-users.component.html',
  styleUrls: ['./online-users.component.scss']
})
export class OnlineUsersComponent implements OnInit {

  users: userData[];
  onlineUsers: userData[] = [];


  constructor(public userService: userSourceService) { }

  ngOnInit(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
      this.onlineUsers = this.users.filter(user => user.logged);
    });
  }

}
