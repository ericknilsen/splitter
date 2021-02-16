import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
import { ExpensesService } from 'src/app/services/expenses.service';
import { Expense } from 'src/app/models/expense.model';

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.css']
})
export class AddExpenseComponent implements OnInit {

  form: FormGroup;
  defaultProportion = 37;
  halfProportion = 50;

  categories = new Map([['Grocery', this.defaultProportion],
  ['Housing', this.defaultProportion],
  ['Internet', this.defaultProportion],
  ['Hydro', this.defaultProportion],
  ['Gas', this.halfProportion],
  ['Car Service', this.halfProportion],
  ['Recreation', this.halfProportion],
  ['Restaurant', this.halfProportion]]);

  constructor(private fb: FormBuilder,
    private expensesService: ExpensesService) {
    this.form = fb.group({
      'description': new FormControl('', Validators.required),
      'date': new FormControl(this.currentDate(), Validators.required),
      'amount': new FormControl('', Validators.required),
      'proportion': new FormControl('', Validators.required),
      'category': new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
  }

  onSubmit(expense: Expense): void {
    expense.status = 'Pending';
    this.expensesService.add(expense).subscribe(resp => {
      console.log(`Expense added with ID: ${resp}`);
    })
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
    this.form.patchValue({ 'proportion': this.categories.get(key) + '%' });
  }

}
