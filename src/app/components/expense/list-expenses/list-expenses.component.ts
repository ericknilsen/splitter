import { Component, OnInit } from '@angular/core';
import { ExpensesService } from 'src/app/services/expenses.service';
import { Expense } from 'src/app/models/expense.model';
import { Util } from 'src/app/common/util';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteModalConfirm } from 'src/app/common/delete.modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { PAGE_SIZE } from 'src/app/common/constants';
import { animate, state, style, transition, trigger } from '@angular/animations';


@Component({
  selector: 'app-list-expenses',
  templateUrl: './list-expenses.component.html',
  styleUrls: ['./list-expenses.component.css'],
  animations : [
    trigger('animationShowHide', [
      state('close', style({ height: '0px', overflow: 'hidden' })),
      state('open', style({ height: '*',overflow: 'hidden'})),
      transition('open <=> close', animate('900ms ease-in-out')),
    ]),
    trigger('animationRotate', [
      state('close', style({ transform: 'rotate(0)' })),
      state('open', style({ transform: 'rotate(90deg)' })),
      transition('open <=> close', animate('900ms ease-in-out')),
    ]),
  ]
})
export class ListExpensesComponent implements OnInit {
  expenses: Expense[] = [];
  expensesSize: number = 0;
  isDisplayedList: boolean[] = [];
  statesList: string[] = [];
  page = 1;
  pageSize = PAGE_SIZE;
  searchParams: any;
  user: any;
  offset: any;
  sStatus = 'close';

  constructor(private expensesService: ExpensesService,
              private spinnerService: NgxSpinnerService,
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
      this.statesList[i] = 'close';
    }
  }

  displayExpenseDetails(index: number) {
    this.statesList[index] = this.statesList[index] === 'close' ? 'open' : 'close';
    this.isDisplayedList[index] = !this.isDisplayedList[index]; 
  }

  deleteExpense(expense: Expense) {
    const modalRef = this.modalService.open(DeleteModalConfirm);
    modalRef.componentInstance.modalTitle = 'Delete Expense';
    modalRef.componentInstance.modalBody = 'Expense '+expense.description;
    modalRef.closed.subscribe(() => {
      this.spinnerService.show();
      this.expensesService.delete(expense).subscribe(() => {
        this.searchExpenses();
        this.expensesService.emitExpensesChange();
        this.spinnerService.hide();
      })
    });
  }

  isEditable(expense: Expense) {
    return expense.receiverUser === this.user.email;
  }

  searchExpenses(searchParams?: any) {
    this.spinnerService.show();
    if (searchParams) {
      this.searchParams = searchParams;
    }
    this.searchParams.userEmail = this.user.email;

    this.expensesService.searchSize(this.searchParams).subscribe(size => {
      this.expensesSize = size;
      this.loadPage(1);
    })   
  }

  private search(page: number) {
    this.searchParams.page = page;
    this.searchParams.limit = PAGE_SIZE;
    this.expensesService.search(this.searchParams).subscribe(result => {
      this.expenses = result;
      this.initDisplayedList();
      this.spinnerService.hide();
    })
  }

  setTimezoneOffset() {
    this.offset = Util.getTimezoneOffset();
  }

  loadPage(page: number) {
    this.search(page);
    this.page = page;
  }

}
