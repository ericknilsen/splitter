import { Component, OnInit } from '@angular/core';
import { Expense } from 'src/app/models/expense.model';
import { ExpensesService } from 'src/app/services/expenses.service';
import { UserGroupService } from 'src/app/services/user-groups.service';
import { Util } from 'src/app/utils/util';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  expenses: Expense[] = [];
  user: any;
  balance: number = 0;
  chargedUser: any;

  constructor(private userGroupService: UserGroupService,
              private expensesService: ExpensesService) { }

  ngOnInit(): void {
    this.user = Util.getCurrentUser();
    this.subscribeToExpensesChangeEmittedEvent();
    this.setChargedUser();
    this.setBalance();
  }

  private subscribeToExpensesChangeEmittedEvent() {
    this.expensesService.expensesChangeEmitted$.subscribe(() => {
      this.setBalance()
    });
  }

  private setChargedUser() {
    this.userGroupService.listUserGroupOfUser(this.user.email).subscribe(g => {
      this.chargedUser = g.users.filter(u => u !== this.user.email).shift();
    })
  }

  private setBalance() {
    this.expensesService.listExpensesByUser(this.user.email).subscribe(result => {
      this.expenses = result;
      
      this.balance = this.expenses.map(e => {
        if (e.receiverUser === this.user.email) {
          return e.amount * e.proportion;
        } else {
          return -e.amount * e.proportion;
        }
      }).reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    })
  }


}
