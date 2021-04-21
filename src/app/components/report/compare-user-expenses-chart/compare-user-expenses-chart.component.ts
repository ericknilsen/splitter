import { Component, OnInit } from '@angular/core';
import { ChartType } from 'chart.js';
import { Util } from 'src/app/common/util';
import { Expense } from 'src/app/models/expense.model';
import { BaseChart } from '../base-chart';

@Component({
  selector: 'app-compare-user-expenses-chart',
  templateUrl: './compare-user-expenses-chart.component.html',
  styleUrls: ['./compare-user-expenses-chart.component.css']
})
export class CompareUserExpensesChartComponent extends BaseChart implements OnInit {

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

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.user = Util.getCurrentUser();
  }

  searchReport(data: any, expenses: Expense[]) {
    this.users = data.users;
    this.expenses = expenses;
    this.applyFilters(data.searchParams);
    this.buildChart();
  }    

  private buildChart() {
    let aggregatedExpensesList:any = [];

    for (let i = 0; i < this.users.length; ++i) {
      let aggregatedExpenses = this.expenses
        .map(e => this.userExpenseMapping(e, this.users[i]))
        .reduce(this.aggregateExpensesByCategory, [])
      aggregatedExpensesList.push(aggregatedExpenses)  
    }

    this.updateChartInfo(aggregatedExpensesList);
  }

  private updateChartInfo(aggregatedExpensesList: any[]) {
    if (aggregatedExpensesList.length > 0) {
      let aggregatedExpenses: any[] = aggregatedExpensesList[0];
      this.chartLabels = aggregatedExpenses.map(e => e.category);
      this.chartDatasets = aggregatedExpensesList.map((aggregatedExpense, index) => {
        let amounts = aggregatedExpense.map((a: { amount: any; }) => a.amount.toFixed(2));
        return {data: amounts, label: this.users[index]}
      });
    } 
  }

}
