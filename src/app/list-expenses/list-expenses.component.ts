import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-expenses',
  templateUrl: './list-expenses.component.html',
  styleUrls: ['./list-expenses.component.css']
})
export class ListExpensesComponent implements OnInit {

  expenses: any[] = [{'description':'White Spot dinner', 'amount':'67.44', 'category': 'Restaurant', 'date':'Jan 23', 'status': 'Pending'},
                     {'description':'Superstore', 'amount':'171.98', 'category': 'Grocery', 'date':'Jan 12', 'status': 'Pending'},
                     {'description':'Walmart', 'amount':'87.26', 'category': 'Grocery', 'date':'Jan 14', 'status': 'Approved'},
                     {'description':'Renting', 'amount':'1,700.00', 'category': 'Housing', 'date':'Jan 01', 'status': 'Approved'},
                     {'description':'Massage', 'amount':'90.00', 'category': 'Service', 'date':'Jan 20', 'status': 'Pending'}];

  constructor() { }

  ngOnInit(): void {
  }

}
