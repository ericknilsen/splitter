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
  page = 1;
  pageSize = 5;
  searchParams: any;
  user: any;
  offset: any;

  constructor(private expensesService: ExpensesService,
              private modalService: NgbModal) { }

  ngOnInit(): void {
    this.initCurrentUser();
    this.setTimezoneOffset();
  }

  private initCurrentUser() {
    this.user = Util.getCurrentUser();
  }

  private initDisplayedList() {
    for (let i = 0; i < this.expenses.length; ++i) {
      this.isDisplayedList[i] = false; 
    }
  }

  displayExpenseDetails(index: number) {
    this.isDisplayedList[index] = !this.isDisplayedList[index]; 
  }

  deleteExpense(expense: Expense) {
    this.modalService.open(DeleteExpenseModalConfirm).closed.subscribe(() => {
      this.expensesService.delete(expense).subscribe(resp => {
        this.searchExpenses();
        this.expensesService.emitExpensesChange();
      })
    });
  }

  isEditable(expense: Expense) {
    return expense.receiverUser === this.user.email;
  }

  searchExpenses(searchParams?: any) {
    if (searchParams) {
      this.searchParams = searchParams;
    }
    this.searchParams.userEmail = this.user.email;
    this.expensesService.search(this.searchParams).subscribe(result => {
      this.expenses = result;
      this.initDisplayedList();
    })
   
  }

  setTimezoneOffset() {
    this.offset = Util.getTimezoneOffset();
  }

}
