import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  user:string = 'Erick';
  balance:number = 1745.87;

  constructor() { }

  ngOnInit(): void {
  }

}
