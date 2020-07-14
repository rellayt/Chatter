import { Component, OnInit } from '@angular/core';
import { userSourceService } from '../_services/users.service';
import { userData } from '../login/validation.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  users: userData[];

  constructor(public userService: userSourceService) { }

  ngOnInit(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
      //console.log(this.users[0].username);
    })
  }

}
