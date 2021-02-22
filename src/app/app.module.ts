import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddExpenseComponent } from './components/add-expense/add-expense.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ListExpensesComponent } from './components/list-expenses/list-expenses.component';
import { ApproveExpenseComponent } from './components/approve-expense/approve-expense.component';
import { ReportComponent } from './components/report/report.component';
import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { ExpensesService } from './services/expenses.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './auth/token.interceptor';
import { JwtService } from './services/jwt.service';

@NgModule({
  declarations: [
    AppComponent,
    AddExpenseComponent,
    DashboardComponent,
    ListExpensesComponent,
    ApproveExpenseComponent,
    ReportComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    ExpensesService,
    JwtService,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
