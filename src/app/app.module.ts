import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxMaskModule } from 'ngx-mask'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddExpenseComponent } from './components/expense/add-expense/add-expense.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ListExpensesComponent } from './components/expense/list-expenses/list-expenses.component';
import { ApproveExpenseComponent } from './components/expense/approve-expense/approve-expense.component';
import { ReportComponent } from './components/report/report.component';
import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { NgbDateParserFormatter, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ExpensesService } from './services/expenses.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './security/jwt.interceptor';
import { JwtService } from './services/jwt.service';
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import { GoogleLoginProvider} from 'angularx-social-login';
import { LoginComponent } from './security/login/login.component';
import { LoginSocialUserComponent } from './security/login-social-user/login-social-user.component';
import { ErrorInterceptor } from './security/error.interceptor';
import { GOOGLE_OAUTH_CLIENT_ID } from './common/constants';
import { PaymentComponent } from './components/payment/add-payment/add-payment.component';
import { ExpenseDetailComponent } from './components/expense/expense-detail/expense-detail.component';
import { PaymentsService } from './services/payments.service';
import { ApprovePaymentComponent } from './components/payment/approve-payment/approve-payment.component';
import { DatePipe } from '@angular/common';
import { SearchExpensesComponent } from './components/expense/search-expenses/search-expenses.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CustomDateParserFormatter } from './common/custom-date.formatter';
import { PaymentsManagerComponent } from './components/payment/payments-manager/payments-manager.component';
import { ListPaymentsComponent } from './components/payment/list-payments/list-payments.component';

@NgModule({
  declarations: [
    AppComponent,
    AddExpenseComponent,
    DashboardComponent,
    ListExpensesComponent,
    ApproveExpenseComponent,
    ReportComponent,
    LoginComponent,
    LoginSocialUserComponent,
    PaymentComponent,
    ExpenseDetailComponent,
    ApprovePaymentComponent,
    SearchExpensesComponent,
    PaymentsManagerComponent,
    ListPaymentsComponent  
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SocialLoginModule,
    NgbModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
    NgxMaskModule.forRoot()
  ],
  providers: [
    ExpensesService,
    PaymentsService,
    DatePipe,
    JwtService,
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              GOOGLE_OAUTH_CLIENT_ID
            )
          }
        ]
      } as SocialAuthServiceConfig,
    },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
