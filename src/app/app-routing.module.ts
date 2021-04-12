import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddExpenseComponent } from './components/expense/add-expense/add-expense.component';
import { ApproveExpenseComponent } from './components/expense/approve-expense/approve-expense.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ListExpensesComponent } from './components/expense/list-expenses/list-expenses.component';
import { PaymentComponent } from './components/payment/add-payment/add-payment.component';
import { ReportComponent } from './components/report/report.component';
import { AuthGuard } from './security/auth.guard';
import { LoginComponent } from './security/login/login.component';
import { PaymentsManagerComponent } from './components/payment/payments-manager/payments-manager.component';
import { ListPaymentsComponent } from './components/payment/list-payments/list-payments.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard],
    children: [
      { path: 'add-expenses', component: AddExpenseComponent },
      { path: 'payment', component: PaymentComponent },
      {
        path: 'payments-manager', component: PaymentsManagerComponent,
        children: [{ path: 'payment', component: PaymentComponent },
                   { path: 'list-payments', component: ListPaymentsComponent }],
      },
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
