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

  search(searchParams: any): Observable<Payment[]> {
    return this.http.post<Payment[]>(`${ENDPOINT}/searchPayments`, searchParams);
  }

  searchSize(searchParams: any): Observable<number> {
    return this.http.post<number>(`${ENDPOINT}/searchPaymentsSize`, searchParams);
  }

  delete(payment: Payment): Observable<string> {
    return this.http.delete<string>(`${ENDPOINT}/deletePayment/${payment._id}`);
  }

  update(payments: Payment[]): Observable<string> {
    return this.http.put<string>(`${ENDPOINT}/updatePayments`, payments);
  }

  emitPaymentsChange() {
    this.emitChangePayments.next();
  }

}