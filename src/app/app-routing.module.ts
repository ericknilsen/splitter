import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddExpenseComponent } from './components/expense/add-expense/add-expense.component';
import { ApproveExpenseComponent } from './components/expense/approve-expense/approve-expense.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ListExpensesComponent } from './components/expense/list-expenses/list-expenses.component';
import { AddPaymentComponent } from './components/payment/add-payment/add-payment.component';
import { AuthGuard } from './security/auth.guard';
import { LoginComponent } from './security/login/login.component';
import { PaymentsManagerComponent } from './components/payment/payments-manager/payments-manager.component';
import { ListPaymentsComponent } from './components/payment/list-payments/list-payments.component';
import { ExpensesManagerComponent } from './components/expense/expenses-manager/expenses-manager.component';
import { ChartsManagerComponent } from './components/chart/charts-manager/charts-manager.component';
import { CategoryChartComponent } from './components/chart/category-chart/category-chart.component';
import { UsersChartComponent } from './components/chart/users-chart/users-chart.component';
import { TimeChartComponent } from './components/chart/time-chart/time-chart.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard],
    children: [
      { path: 'expenses-manager', pathMatch: 'full', redirectTo: 'expenses-manager/add-expense' },
      {
        path: 'expenses-manager', component: ExpensesManagerComponent,
        children: [{ path: 'add-expense', component: AddExpenseComponent },
                   { path: 'list-expenses', component: ListExpensesComponent }]
      },
      {
        path: 'payments-manager', component: PaymentsManagerComponent,
        children: [{ path: 'add-payment', component: AddPaymentComponent },
                   { path: 'list-payments', component: ListPaymentsComponent }]
      },
      {
        path: 'charts-manager', component: ChartsManagerComponent,
        children: [{ path: 'category-chart', component: CategoryChartComponent },
                   { path: 'users-chart', component: UsersChartComponent },
                   { path: 'time-chart', component: TimeChartComponent }]
      },
      { path: 'approve-expenses', component: ApproveExpenseComponent }
    ]
  },
  { path: 'login', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
