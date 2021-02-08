import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.css']
})
export class AddExpenseComponent implements OnInit {

  form: FormGroup;
  categories = ['Grocery', 'Restaurant', 'Service', 'Recreation'];

  constructor(private fb: FormBuilder) {
    this.form = fb.group({
      'description': new FormControl('', Validators.required),
      'date': new FormControl('', Validators.required),
      'amount': new FormControl('', Validators.required),
      'category': new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
  }

  onSubmit(value: string): void {
    console.log('you submitted value: ', value);
  }

  get f() { return this.form.controls; }

}
