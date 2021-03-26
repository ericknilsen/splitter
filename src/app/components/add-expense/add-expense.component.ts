import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
import { ExpensesService } from 'src/app/services/expenses.service';
import { Expense } from 'src/app/models/expense.model';
import { UserGroupService } from 'src/app/services/user-groups.service';
import { Util } from 'src/app/common/util';

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.css']
})
export class AddExpenseComponent implements OnInit {

  form: FormGroup;
  isSubmited: boolean = false;

  categories = new Map();
  
  user: any;
  chargedUser: any;
  groupUsers: any[] = [];
  pendingExpenses: Expense[] = [];

  constructor(private fb: FormBuilder,
    private userGroupService: UserGroupService,
    private expensesService: ExpensesService) {
    this.form = this.initForm();
  }

  private initForm() {
    return this.fb.group({
      'description': new FormControl('', Validators.required),
      'date': new FormControl(this.currentDate(), Validators.required),
      'amount': new FormControl('', Validators.required),
      'proportion': new FormControl('', Validators.required),
      'category': new FormControl('', Validators.required),
      'chargedUser': new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
    this.initCurrentUser();
    this.initCategories();
    this.listUserGroupOfUser();
    this.listPendingExpenses();
  }

  private initCurrentUser() {
    this.user = Util.getCurrentUser();
  }

  private initCategories() {
    this.categories = Util.getCategories();
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
