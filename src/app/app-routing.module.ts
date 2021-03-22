import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddExpenseComponent } from './components/add-expense/add-expense.component';
import { ApproveExpenseComponent } from './components/approve-expense/approve-expense.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ListExpensesComponent } from './components/list-expenses/list-expenses.component';
import { PaymentComponent } from './components/payment/payment.component';
import { ReportComponent } from './components/report/report.component';
import { AuthGuard } from './security/auth.guard';
import { LoginComponent } from './security/login/login.component';

const routes: Routes = [
  { path:  '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard],
   children: [ 
    { path: 'add-expenses', component: AddExpenseComponent },
    { path: 'payment', component: PaymentComponent },
    { path: 'approve-expenses', component: ApproveExpenseComponent },
    { path: 'list-expenses', component: ListExpensesComponent },
    { path: 'report-expenses', component: ReportComponent }
   ]
  },
  { path: 'login', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
