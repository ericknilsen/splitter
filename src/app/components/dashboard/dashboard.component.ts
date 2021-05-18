import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Expense } from 'src/app/models/expense.model';
import { ExpensesService } from 'src/app/services/expenses.service';
import { UserGroupService } from 'src/app/services/user-groups.service';
import { Util } from 'src/app/common/util';
import { STATUS_APPROVED } from 'src/app/common/constants';
import { PaymentsService } from 'src/app/services/payments.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {

  @ViewChild('expensesTab')
  expensesTab!: ElementRef;

  expenses: Expense[] = [];
  user: any;
  chargedUser: any;

  balance: number = 0;
  totalExpenses: number = 0;
  totalPayments: number = 0;

  cardClassList = ['card card-none','card','card'];

  constructor(private userGroupService: UserGroupService,
              private paymentsService: PaymentsService,
              private spinnerService: NgxSpinnerService,
              private expensesService: ExpensesService) { }

  ngOnInit(): void {
    this.user = Util.getCurrentUser();
    this.subscribeToExpensesChangeEmittedEvent();
    this.subscribeToPaymentsChangeEmittedEvent();
    this.setChargedUser();
    this.setBalance();
  }

  ngAfterViewInit(): void {
    this.expensesTab.nativeElement.click();
  }

  private subscribeToExpensesChangeEmittedEvent() {
    this.expensesService.expensesChangeEmitted$.subscribe(() => {
      this.setBalance();
    });
  }

  private subscribeToPaymentsChangeEmittedEvent() {
    this.paymentsService.paymentsChangeEmitted$.subscribe(() => {
      this.setBalance();
    });
  }

  private setChargedUser() {
    this.userGroupService.listUserGroupOfUser(this.user.email).subscribe(g => {
      this.chargedUser = g.users.filter(u => u !== this.user.email).shift();
    })
  }

  private setBalance() {
    this.calcTotalExpenses();
  }

  private calcTotalExpenses() {
    this.spinnerService.show();
    this.expensesService.listExpensesByUser(this.user.email).subscribe(expenses => {
      this.expenses = expenses;
      
      this.totalExpenses = this.expenses
        .filter(e => e.status === STATUS_APPROVED)
        .map(e => {
          const total = (e.amount * e.proportion)/100;
          if (e.receiverUser === this.user.email) {
            return total;
          } else {
            return -total;
          }
        }).reduce((accumulator, currentValue) => accumulator + currentValue, 0);      

        this.calcTotalPayments();
        this.spinnerService.hide();
    });
  }

  private calcTotalPayments() {
    this.paymentsService.listPaymentsByUser(this.user.email).subscribe(payments => {
      this.totalPayments = payments
        .filter(p => p.status === STATUS_APPROVED)
        .map(p => {
          if (p.paidUser === this.user.email) {
            return p.amount * 1;
          } else {
            return -p.amount * 1;
          }
        }).reduce((accumulator, currentValue) => accumulator + currentValue, 0);

        this.balance = this.totalExpenses - this.totalPayments; 
    })
  }

  getUsernameFromEmail(email: string) {
    return Util.getUsernameFromEmail(email);
  }

  setCardClass(index: number) {
    this.cardClassList[index] = 'card card-none';
    for(let i = 0; i < this.cardClassList.length; ++i) {
      if (i !== index) {
        this.cardClassList[i] = 'card';
      }
    }
  }

}
