import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-chatter',
  templateUrl: './chatter.component.html',
  styleUrls: ['./chatter.component.scss']
})
export class ChatterComponent implements OnInit {

  @Input()
  username: string;

  @Input()
  userLogged: boolean;
  constructor() { }

  ngOnInit(): void {
  }

}
