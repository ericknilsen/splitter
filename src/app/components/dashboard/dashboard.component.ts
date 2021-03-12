import { Component, OnInit } from '@angular/core';
import { Util } from 'src/app/utils/util';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  user: any;
  balance: number = 1745.87;
  group: any[] = [];

  constructor() { }

  ngOnInit(): void {
    this.user = Util.getCurrentUser();
  }

  private getUserGroup() {
    
  }

}
