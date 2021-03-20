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
import { Util } from 'src/app/utils/util';

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.css']
})
export class AddExpenseComponent implements OnInit {

  form: FormGroup;
  defaultProportion = 0.35;
  halfProportion = 0.50;

  categories = new Map([['Grocery', this.defaultProportion],
  ['Housing', this.defaultProportion],
  ['Internet', this.defaultProportion],
  ['Hydro', this.defaultProportion],
  ['Gas', this.halfProportion],
  ['Car Service', this.halfProportion],
  ['Recreation', this.halfProportion],
  ['Restaurant', this.halfProportion]]);
  
  user: any;
  chargedUser: any;
  groupUsers: any[] = [];

  constructor(private fb: FormBuilder,
    private userGroupService: UserGroupService,
    private expensesService: ExpensesService) {
    this.form = this.fb.group({
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
    this.listUserGroupOfUser();
  }

  private initCurrentUser() {
    this.user = Util.getCurrentUser();
  }

  onSubmit(expense: Expense): void {
    expense.status = 'Pending';
    expense.receiverUser = this.user.email;
    this.expensesService.add(expense).subscribe(resp => {
      console.log(`Expense added with ID: ${resp}`);
    })

    this.expensesService.emitExpensesChange();
  }

  get f() { return this.form.controls; }

  currentDate() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();

    return mm + '/' + dd + '/' + yyyy;
  }

  selectCategory(key: any) {
    this.form.patchValue({ 'proportion': this.categories.get(key)});
  }

  listUserGroupOfUser() {
    this.userGroupService.listUserGroupOfUser(this.user.email).subscribe(userGroup => {
      this.groupUsers = userGroup.users.filter(u => u !== this.user.email);
    })
  }

}
