import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddExpenseComponent } from './add-expense/add-expense.component';
import { ListExpensesComponent } from './list-expenses/list-expenses.component';
import { ReportComponent } from './report/report.component';

const routes: Routes = [
  { path: 'add-expenses', component: AddExpenseComponent },
  { path: 'list-expenses', component: ListExpensesComponent },
  { path: 'report-expenses', component: ReportComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
