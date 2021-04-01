import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl
} from '@angular/forms';
import { Util } from 'src/app/common/util';

@Component({
  selector: 'app-search-expenses',
  templateUrl: './search-expenses.component.html',
  styleUrls: ['./search-expenses.component.css']
})
export class SearchExpensesComponent implements OnInit {

  form: FormGroup;
  
  months: Map<string, string> = new Map();
  monthsList: string[] = [];
  status: string[] = [];

  constructor(private fb: FormBuilder) {
    this.form = this.initForm();
  }

  private initForm() {
    return this.fb.group({
      'month': new FormControl(''),
      'status': new FormControl('')
    });
  }

  ngOnInit(): void {
    this.initStatus();
    this.initMonths();
  }

  private initStatus() {
    this.status = Util.getStatusList();
  }

  private initMonths() {
    this.months = Util.getMonths();
    this.monthsList = Array.from(this.months.keys());
    this.form.patchValue({'month': Util.getCurrentMonth()});
  }

  selectMonth(month: string) {
    console.log(month)
  } 

  get f() { return this.form.controls; }

}
