import {Injectable} from '@angular/core'
import {HttpClient} from '@angular/common/http';

import { Observable } from 'rxjs';
import { Expense } from '../models/expense.model';
import { ENDPOINT } from '../utils/constants';

@Injectable()
export class ExpensesService {

  constructor(private http: HttpClient) {}

  add(expense: Expense): Observable<string> {
    return this.http.post<string>(`${ENDPOINT}/createExpense`, expense);
  }

  list(): Observable<Expense[]> {   
    return this.http.get<Expense[]>(`${ENDPOINT}/listExpenses`);
  }

}