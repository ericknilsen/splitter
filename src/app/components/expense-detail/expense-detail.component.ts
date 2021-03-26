import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
import { ExpensesService } from 'src/app/services/expenses.service';
import { Expense } from 'src/app/models/expense.model';
import { UserGroupService } from 'src/app/services/user-groups.service';
import { Util } from 'src/app/utils/util';

@Component({
  selector: 'app-expense-detail',
  templateUrl: './expense-detail.component.html',
  styleUrls: ['./expense-detail.component.css']
})
export class ExpenseDetailComponent implements OnInit {

  @Input()
  expense!: Expense;

  form!: FormGroup;
  defaultProportion = 0.35;
  halfProportion = 0.50;

  isSubmited: boolean = false;

  categories = new Map([['Grocery', this.defaultProportion],
  ['Housing', this.defaultProportion],
  ['Car', this.halfProportion],
  ['Recreation', this.halfProportion],
  ['Restaurant', this.halfProportion]]);
  
  user: any;
  chargedUser: any;
  groupUsers: any[] = [];
  pendingExpenses: Expense[] = [];

  constructor(private fb: FormBuilder,
    private userGroupService: UserGroupService,
    private expensesService: ExpensesService) {
    
  }

  private initForm() {
    return this.fb.group({
      'date': new FormControl(this.expense.date, Validators.required),
      'amount': new FormControl(this.expense.amount, Validators.required),
      'proportion': new FormControl(this.expense.proportion, Validators.required),
      'category': new FormControl(this.expense.category, Validators.required),
      'chargedUser': new FormControl(this.expense.chargedUser, Validators.required)
    });
  }

  ngOnInit(): void {
    this.form = this.initForm();
    this.initCurrentUser();
    this.listUserGroupOfUser();
    this.listPendingExpenses();
  }

  private initCurrentUser() {
    this.user = Util.getCurrentUser();
  }

  onSubmit(expense: Expense): void {
    expense.status = 'Pending';
    expense.receiverUser = this.user.email;
    this.expensesService.add(expense).subscribe(resp => {
      console.log(`Expense added with ID: ${resp}`);
      this.isSubmited = true;
    })

    this.expensesService.emitExpensesChange();
    this.form = this.initForm();
    this.setChargedUser();
  }

  get f() { return this.form.controls; }

  private currentDate() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();

    return mm + '/' + dd + '/' + yyyy;
  }

  selectCategory(key: any) {
    this.form.patchValue({'proportion': this.categories.get(key)});
  }

  private listUserGroupOfUser() {
    this.userGroupService.listUserGroupOfUser(this.user.email).subscribe(userGroup => {
      this.groupUsers = userGroup.users.filter(u => u !== this.user.email);
      this.setChargedUser();
    })
  }

  private setChargedUser() {
    if (this.groupUsers.length === 1) {
      this.chargedUser = this.groupUsers[0];
      this.form.patchValue({'chargedUser': this.chargedUser});
    }
  }

  private listPendingExpenses() {
    this.expensesService.listExpensesByUser(this.user.email).subscribe(expenses => {
      this.pendingExpenses = expenses.filter(e => e.status === 'Pending' && e.chargedUser === this.user.email)
    })
  }

}
