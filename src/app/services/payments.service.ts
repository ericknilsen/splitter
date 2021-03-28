import {Injectable} from '@angular/core'
import {HttpClient} from '@angular/common/http';

import { Observable, Subject } from 'rxjs';
import { ENDPOINT } from '../common/constants';
import { Payment } from '../models/payment.model';

@Injectable()
export class PaymentsService {

  private emitChangePayments = new Subject<any>();

  paymentsChangeEmitted$ = this.emitChangePayments.asObservable();

  constructor(private http: HttpClient) {}

  add(payment: Payment): Observable<string> {
    return this.http.post<string>(`${ENDPOINT}/createPayment`, payment);
  }

  listPaymentsByUser(userEmail: any): Observable<Payment[]> {   
    return this.http.get<Payment[]>(`${ENDPOINT}/listUserPayments/${userEmail}`);
  }

  update(payments: Payment[]): Observable<string> {
    return this.http.put<string>(`${ENDPOINT}/updatePayments`, payments);
  }

  emitPaymentsChange() {
    this.emitChangePayments.next();
  }

}