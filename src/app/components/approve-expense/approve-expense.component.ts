import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Expense } from 'src/app/models/expense.model';
import { ExpensesService } from 'src/app/services/expenses.service';
import { Util } from 'src/app/common/util';

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

  actionStatusMap: Map<string, string> = new Map();

  constructor(private fb: FormBuilder,
    private expensesService: ExpensesService) { 
    this.form = this.initForm();
  }

  ngOnInit(): void {
    this.initActionsList();
    this.initPendingExpenseFormArray();
  }

  onSubmit(): void {
    const actions = this.pendingExpensesFormArray.value;
    for(let i = 0; i < actions.length; ++i) {
      this.pendingExpenses[i].status = actions[i].action;
    }
    this.expensesService.update(this.pendingExpenses).subscribe(resp => {
      console.log(resp);
    })
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
    this.actionStatusMap = Util.getActionStatusMap();
    this.actionsList = Array.from(this.actionStatusMap.keys());
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
    
  }

}
