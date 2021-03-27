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
import { STATUS_PENDING } from 'src/app/common/constants';

@Component({
  selector: 'app-expense-detail',
  templateUrl: './expense-detail.component.html',
  styleUrls: ['./expense-detail.component.css']
})
export class ExpenseDetailComponent implements OnInit {

  @Input()
  expense!: Expense;

  form!: FormGroup;
  isSubmited: boolean = false;

  categories = new Map();
  
  user: any;

  constructor(private fb: FormBuilder,
    private userGroupService: UserGroupService,
    private expensesService: ExpensesService) {
  }

  private initForm() {
    return this.fb.group({
      'date': new FormControl(this.expense.date, Validators.required),
      'amount': new FormControl(this.expense.amount, Validators.required),
      'proportion': new FormControl(this.expense.proportion, Validators.required),
      'category': new FormControl(this.expense.category, Validators.required)
    });
  }

  ngOnInit(): void {
    this.form = this.initForm();
    this.initCurrentUser();
    this.initCategories();
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
    this.expensesService.update([this.expense]).subscribe(resp => {
      console.log(resp);
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
    return expense.receiverUser === this.user.email;
  }

}
