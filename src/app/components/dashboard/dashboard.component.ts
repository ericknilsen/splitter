import { Component, OnInit } from '@angular/core';
import { UserGroupService } from 'src/app/services/user-groups.service';
import { Util } from 'src/app/utils/util';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  user: any;
  balance: number = 1745.87;
  chargedUser: any;

  constructor(private userGroupService: UserGroupService) { }

  ngOnInit(): void {
    this.user = Util.getCurrentUser();
    this.getChargedUser();
  }

  private getChargedUser() {
  }

}
