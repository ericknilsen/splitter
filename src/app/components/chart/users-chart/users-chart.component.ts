import { Component, OnInit } from '@angular/core';
import { ChartType } from 'chart.js';
import { Util } from 'src/app/common/util';
import { Expense } from 'src/app/models/expense.model';
import { ExpensesService } from 'src/app/services/expenses.service';
import { BaseChart } from '../base-chart';

@Component({
  selector: 'app-users-chart',
  templateUrl: './users-chart.component.html',
  styleUrls: ['./users-chart.component.css']
})
export class UsersChartComponent extends BaseChart implements OnInit {

  chartType: ChartType = 'line';
  chartDatasets: Array<any> = [
    { data: [], label: '' },
    { data: [], label: '' }
  ];
  chartLabels: Array<any> = [];
  chartColors: Array<any> = [
    {
      backgroundColor: 'rgba(105, 0, 132, .2)',
      borderColor: 'rgba(200, 99, 132, .7)',
      borderWidth: 2,
    },
    {
      backgroundColor: 'rgba(0, 137, 132, .2)',
      borderColor: 'rgba(0, 10, 130, .7)',
      borderWidth: 2,
    }
  ];

  totalExpensesByUserMap: Map<string,string> = new Map<string,string>();

  constructor(private expensesService: ExpensesService) {
    super();
  }

  ngOnInit(): void {
    this.user = Util.getCurrentUser();
    this.subscribeToListExpenses();
    this.setChartSearchParams();
  }

  private subscribeToListExpenses() {
    this.expensesService.listExpensesEmitted$.subscribe(expenses => {
      this.expenses = expenses;
      this.allExpenses = expenses;
    })
  }

  private setChartSearchParams() {
    this.chartSearchParamsMap.set('month', true);
  }

  search(data: any) {
    this.users = data.users;
    this.applyFilters(data.searchParams);
    this.setTotalExpensesByUser();
    this.buildChart();
    this.expenses = this.allExpenses;
  }

  private buildChart() {
    let aggregatedExpensesList:any = [];

    for (let i = 0; i < this.users.length; ++i) {
      let aggregatedExpenses = this.expenses
        .map(e => this.userExpenseMapping(e, this.users[i]))
        .reduce(this.aggregateExpensesByCategory, []);
      aggregatedExpensesList.push(aggregatedExpenses);  
    }

    this.updateChartInfo(aggregatedExpensesList);
  }

  private updateChartInfo(aggregatedExpensesList: any[]) {
    if (aggregatedExpensesList.length > 0) {
      let aggregatedExpenses: any[] = aggregatedExpensesList[0];
      this.chartLabels = aggregatedExpenses.map(e => e.category);
      this.chartDatasets = aggregatedExpensesList.map((aggregatedExpense, index) => {
        let amounts = aggregatedExpense.map((a: { amount: any; }) => a.amount.toFixed(2));
        return {data: amounts, label: `${Util.getUsernameFromEmail(this.users[index])} (${this.totalExpensesByUserMap.get(this.users[index])})`};
      });
    } 
  }

  private setTotalExpensesByUser() {
    for (let i = 0; i < this.users.length; ++i) {
      let total = this.expenses
        .map(e => this.userExpenseMapping(e, this.users[i]))
        .map(a => a.amount)
        .reduce((previous, current) => previous+current, 0);
      this.totalExpensesByUserMap.set(this.users[i], `$${total.toFixed(2)}`);  
    }
  }

}
