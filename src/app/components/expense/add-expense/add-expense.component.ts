import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { ExpensesService } from 'src/app/services/expenses.service';
import { Expense } from 'src/app/models/expense.model';
import { UserGroupService } from 'src/app/services/user-groups.service';
import { Util } from 'src/app/common/util';
import { UserGroup } from 'src/app/models/user-group.model';
import { Payment } from 'src/app/models/payment.model';
import { PaymentsService } from 'src/app/services/payments.service';
import { NgbCalendar, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.css'],
})
export class AddExpenseComponent implements OnInit {

  form: FormGroup;
  isSubmited: boolean = false;

  categories = new Map();
  
  user: any;
  chargedUser: any;
  groupUsers: any[] = [];
  pendingExpenses!: Expense[];
  pendingPayments!: Payment[];

  constructor(private fb: FormBuilder,
    private ngbCalendar: NgbCalendar,
    private userGroupService: UserGroupService,
    private paymentsService: PaymentsService,
    private expensesService: ExpensesService) {
    this.form = this.initForm();
  }

  private initForm() {
    return this.fb.group({
      'description': new FormControl('', Validators.required),
      'date': new FormControl(this.ngbCalendar.getToday(), Validators.required),
      'amount': new FormControl('', Validators.required),
      'proportion': new FormControl('', Validators.required),
      'category': new FormControl('', Validators.required),
      'chargedUser': new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
    this.initCurrentUser();
    this.listUserGroupOfUser();
    this.listPendingExpenses();
    this.listPendingPayments();
  }

  private initCurrentUser() {
    this.user = Util.getCurrentUser();
  }

  private initCategories(userGroup: UserGroup) {
    this.categories = Util.getCategories(userGroup, this.chargedUser);
  }

  onSubmit(expense: Expense): void {
    expense.status = 'Pending';
    expense.receiverUser = this.user.email;
    expense.date = Util.formatDate(this.form.value.date);
    
    this.expensesService.add(expense).subscribe(resp => {
      console.log(`Expense added with ID: ${resp}`);
      this.isSubmited = true;
    })
    
    this.form = this.initForm();
    this.setChargedUser();
  }

  get f() { return this.form.controls; }

  selectCategory(key: any) {
    this.form.patchValue({'proportion': this.categories.get(key)});
  }

  private listUserGroupOfUser() {
    this.userGroupService.listUserGroupOfUser(this.user.email).subscribe(userGroup => {
      this.groupUsers = userGroup.users.filter(u => u !== this.user.email);
      this.setChargedUser();
      this.initCategories(userGroup);
    })
  }

  private setChargedUser() {
    if (this.groupUsers.length === 1) {
      this.chargedUser = this.groupUsers[0];
      this.form.patchValue({'chargedUser': this.chargedUser});
    }
  }

  listPendingExpenses() {
    this.expensesService.listExpensesByUser(this.user.email).subscribe(expenses => {
      this.pendingExpenses = expenses.filter(e => e.status === 'Pending' && e.chargedUser === this.user.email);
    })
  }

  listPendingPayments() {
    this.paymentsService.listPaymentsByUser(this.user.email).subscribe(payments => {
      this.pendingPayments = payments.filter(p => p.status === 'Pending' && p.paidUser === this.user.email);
    })
  }

  hideAddExpenseForm() { 
    return ((this.pendingExpenses && this.pendingExpenses.length > 0) ||
            (this.pendingPayments && this.pendingPayments.length > 0));
  }

  displayPendingExpensesForm() {
    return this.pendingExpenses && this.pendingExpenses.length > 0;
  }

  displayPendingPaymentsForm() {
    return this.pendingPayments && this.pendingPayments.length > 0;
  }

}
