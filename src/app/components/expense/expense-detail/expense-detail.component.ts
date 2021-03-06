import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
import { ExpensesService } from 'src/app/services/expenses.service';
import { Expense } from 'src/app/models/expense.model';
import { Util } from 'src/app/common/util';
import { UserGroupService } from 'src/app/services/user-groups.service';
import { STATUS_APPROVED, STATUS_PENDING, STATUS_REJECTED } from 'src/app/common/constants';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-expense-detail',
  templateUrl: './expense-detail.component.html',
  styleUrls: ['./expense-detail.component.css']
})
export class ExpenseDetailComponent implements OnInit {

  @Input()
  expense!: Expense;
  offset: any;
  form!: FormGroup;
  isSubmited: boolean = false;

  categories = new Map();
  
  user: any;

  constructor(private fb: FormBuilder,
    private userGroupService: UserGroupService,
    private datePipe: DatePipe,
    private expensesService: ExpensesService) {
  }

  private initForm() {
    return this.fb.group({
      'date': new FormControl(this.initDate(), Validators.required),
      'amount': new FormControl(this.expense.amount, Validators.required),
      'proportion': new FormControl(this.expense.proportion, Validators.required),
      'category': new FormControl(this.expense.category, Validators.required)
    });
  }

  ngOnInit(): void {
    this.setTimezoneOffset();
    this.form = this.initForm();
    this.initCurrentUser();
    this.initCategories();
  }

  private initDate() {
    return Util.stringDateToNgbDate(this.expense.date, this.datePipe);
  }

  private initCategories() {
    this.userGroupService.listUserGroupOfUser(this.user.email).subscribe(userGroup => {
      this.categories = Util.getCategories(userGroup, this.expense.chargedUser);
    })
  }

  private initCurrentUser() {
    this.user = Util.getCurrentUser();
  }

  onSubmit(updatedExpense: Expense): void {
    this.expense = Object.assign(this.expense, updatedExpense);
    this.expense.status = STATUS_PENDING;
    this.expense.date = Util.formatDate(this.form.value.date);
    this.expensesService.update([this.expense]).subscribe(resp => {
      this.isSubmited = true;
    })

    this.expensesService.emitExpensesChange();
    this.form = this.initForm();
  }

  get f() { return this.form.controls; }

  selectCategory(key: any) {
    this.form.patchValue({'proportion': this.categories.get(key)});
  }

  isEditable(expense: Expense) {
    return expense.receiverUser === this.user.email && expense.status === STATUS_PENDING;
  }

  setTimezoneOffset() {
    this.offset = Util.getTimezoneOffset();
  }

  getUsernameFromEmail(email: string) {
    return Util.getUsernameFromEmail(email);
  }

  getStatusClass(status: string) {
    return status === STATUS_APPROVED? 'text-success':
           status === STATUS_PENDING? 'text-warning':
           status === STATUS_REJECTED? 'text-danger':'';
  }
}
