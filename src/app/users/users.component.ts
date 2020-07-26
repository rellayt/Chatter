import { Component, OnInit, OnDestroy } from '@angular/core';
import { userSourceService } from '../_services/users.service';
import { userData } from '../userData';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {

  constructor(public userService: userSourceService) { }

  users: userData[];
  ngOnDestroy() {

  }

  ngOnInit(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
      //console.log(this.users[0].username);
    });
  }

}
