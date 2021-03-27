import { Component, OnInit } from '@angular/core';
import { ExpensesService } from 'src/app/services/expenses.service';
import { Expense } from 'src/app/models/expense.model';
import { Util } from 'src/app/common/util';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteExpenseModalConfirm } from 'src/app/common/delete-expense.modal';

@Component({
  selector: 'app-list-expenses',
  templateUrl: './list-expenses.component.html',
  styleUrls: ['./list-expenses.component.css']
})
export class ListExpensesComponent implements OnInit {
  expenses: Expense[] = [];
  isDisplayedList: boolean[] = [];

  user: any;

  constructor(private expensesService: ExpensesService,
              private modalService: NgbModal) { }

  ngOnInit(): void {
    this.initCurrentUser();
    this.initExpenses();
  }

  private initCurrentUser() {
    this.user = Util.getCurrentUser();
  }

  private initExpenses() {
    this.expensesService.listExpensesByUser(this.user.email).subscribe(result => {
      this.expenses = result;
      for (let i = 0; i < this.expenses.length; ++i) {
        this.isDisplayedList[i] = false; 
      }
    })
  }

  displayExpenseDetails(index: number) {
    this.isDisplayedList[index] = !this.isDisplayedList[index]; 
  }

  deleteExpense(expense: Expense) {
    this.modalService.open(DeleteExpenseModalConfirm).closed.subscribe(() => {
      this.expensesService.delete(expense).subscribe(resp => {
        console.log(resp)
        this.initExpenses();
      })
    });
  }

  isEditable(expense: Expense) {
    return expense.receiverUser === this.user.email;
  }

}
