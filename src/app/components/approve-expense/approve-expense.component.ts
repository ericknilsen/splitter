import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Expense } from 'src/app/models/expense.model';
import { Util } from 'src/app/utils/util';

@Component({
  selector: 'app-approve-expense',
  templateUrl: './approve-expense.component.html',
  styleUrls: ['./approve-expense.component.css']
})
export class ApproveExpenseComponent implements OnInit {

  @Input()
  pendingExpenses!: Expense[];  

  form: FormGroup;
  pendingExpensesFormArray!: FormArray;
  
  actionsList: string[] = [];
  

  constructor(private fb: FormBuilder) { 
    this.form = this.initForm();
  }

  ngOnInit(): void {
    this.initActionsList();
    this.initPendingExpenseFormArray();
  }

  onSubmit(action: any): void {
    console.log(action)
  }  

  private initForm() {
    return this.fb.group({
      pendingExpensesFormArray: this.fb.array([])
    });
  }

  private createPendingExpenses(): FormGroup {
    return this.fb.group({
      action: ['', Validators.required]
    });
  }

  private initActionsList() {
    this.actionsList = Util.getActionsList();
  }

  private addNewPendingExpenseToFormArray() {
    this.pendingExpensesFormArray.push(this.createPendingExpenses());
  }

  private initPendingExpenseFormArray() {
    this.pendingExpensesFormArray = this.form.get('pendingExpensesFormArray') as FormArray;
    for(let i = 0; i < this.pendingExpenses.length; ++i) {
      this.addNewPendingExpenseToFormArray();
    }
  }

  selectAction(expense: Expense, index: any) {
    const action = this.pendingExpensesFormArray.value[index].action;
    console.log(expense, action)
  }

}
