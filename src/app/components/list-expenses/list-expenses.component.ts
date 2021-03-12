import { Component, OnInit } from '@angular/core';
import { ExpensesService } from 'src/app/services/expenses.service';
import { Expense } from 'src/app/models/expense.model';
import { Util } from 'src/app/utils/util';

@Component({
  selector: 'app-list-expenses',
  templateUrl: './list-expenses.component.html',
  styleUrls: ['./list-expenses.component.css']
})
export class ListExpensesComponent implements OnInit {

  expenses: Expense[] = [];
  constructor(private expensesService: ExpensesService) { }

  ngOnInit(): void {
    const user = Util.getCurrentUser();
    this.expensesService.listExpensesByGroup(user.group).subscribe(result => {
      this.expenses = result;
    })
  }

}
