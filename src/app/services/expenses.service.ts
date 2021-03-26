import {Injectable} from '@angular/core'
import {HttpClient} from '@angular/common/http';

import { Observable, Subject } from 'rxjs';
import { Expense } from '../models/expense.model';
import { ENDPOINT } from '../common/constants';

@Injectable()
export class ExpensesService {

  private emitChangeExpenses = new Subject<any>();

  expensesChangeEmitted$ = this.emitChangeExpenses.asObservable();

  constructor(private http: HttpClient) {}

  add(expense: Expense): Observable<string> {
    return this.http.post<string>(`${ENDPOINT}/createExpense`, expense);
  }

  update(expenses: Expense[]): Observable<string> {
    return this.http.put<string>(`${ENDPOINT}/updateExpenses`, expenses);
  }

  listExpensesByUser(userEmail: any): Observable<Expense[]> {   
    return this.http.get<Expense[]>(`${ENDPOINT}/listUserExpenses/${userEmail}`);
  }

  delete(expense: Expense): Observable<string> {
    return this.http.delete<string>(`${ENDPOINT}/deleteExpense/${expense._id}`);
  }

  emitExpensesChange() {
    this.emitChangeExpenses.next();
  }

}