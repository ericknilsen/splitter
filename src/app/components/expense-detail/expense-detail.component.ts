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

  private initCurrentUser() {
    this.user = Util.getCurrentUser();
  }

  private initCategories() {
    this.categories = Util.getCategories();
  }

  onSubmit(updatedExpense: Expense): void {
    this.expense = Object.assign(this.expense, updatedExpense);
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
