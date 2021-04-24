import { Component, OnInit } from '@angular/core';
import { ChartType } from 'chart.js';
import { Util } from 'src/app/common/util';
import { Expense } from 'src/app/models/expense.model';
import { BaseChart } from '../base-chart';

@Component({
  selector: 'app-compare-expenses-chart',
  templateUrl: './compare-expenses-chart.component.html',
  styleUrls: ['./compare-expenses-chart.component.css']
})
export class CompareExpensesChartComponent extends BaseChart implements OnInit {

  public chartType: ChartType = 'radar';

  public chartDatasets: Array<any> = [
    { data: [], label: '' },
    { data: [], label: '' }
  ];

  public chartLabels: Array<any> = [];

  public chartColors: Array<any> = [
    {
      backgroundColor: 'rgba(105, 0, 132, .2)',
      borderColor: 'rgba(200, 99, 132, .7)',
      borderWidth: 2,
    },
    {
      backgroundColor: 'rgba(0, 250, 220, .2)',
      borderColor: 'rgba(0, 213, 132, .7)',
      borderWidth: 2,
    }
  ];

  months: string[] = []

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.user = Util.getCurrentUser();
  }

  searchReport(data: any, expenses: Expense[]) {
    this.months = [data.searchParams.month, data.searchParams.compareMonth];
    this.expenses = expenses;
    this.applyFilters();
    this.buildChart(data.searchParams.user);
  }

  private buildChart(user: string) {
    let aggregatedExpensesList: any[] = [];
    let categoriesSet: Set<string> = new Set();
    for (let i = 0; i < this.months.length; ++i) {
      let aggregatedExpenses = this.expenses
        .filter(e => Util.getMonthFromStringDate(e.date) === this.months[i])
        .map(e => this.userExpenseMapping(e, user))
        .reduce(this.aggregateExpensesByCategory, []);
      
      categoriesSet = this.buildCategoriesSet(aggregatedExpenses, categoriesSet);
      aggregatedExpensesList.push(aggregatedExpenses);  
    }
   
    aggregatedExpensesList = this.updateAggregatedExpenses(aggregatedExpensesList, categoriesSet);
    this.updateChartInfo(aggregatedExpensesList);
  }

  private buildCategoriesSet(aggregatedExpenses: any[], categoriesSet: Set<string>) {
    let aggregatedCategories = aggregatedExpenses
      .map(e => e.category);
    for (let i = 0; i < aggregatedCategories.length; ++i) {
      categoriesSet.add(aggregatedCategories[i]);
    } 
    return categoriesSet;
  }

  private updateAggregatedExpenses(aggregatedExpensesList: any[], categoriesSet: Set<string>) {
    let categories = Array.from(categoriesSet);
    
    for (let i = 0; i < aggregatedExpensesList.length; ++i) {
      const aggregatedCategories = aggregatedExpensesList[i].map((a: { category: any; }) => a.category);
      const missingCategories = categories.filter(value => !aggregatedCategories.includes(value));
      for (let j = 0; j < missingCategories.length; ++j) {
        aggregatedExpensesList[i].push({category: missingCategories[j], amount: 0})
      }
      aggregatedExpensesList[i].sort(this.compareExpensesByCategory); 
    }
    return aggregatedExpensesList;
  }

  private updateChartInfo(aggregatedExpensesList: any[]) {
    if (aggregatedExpensesList.length > 0) {
      let aggregatedExpenses: any[] = aggregatedExpensesList[0];
      this.chartLabels = aggregatedExpenses.map(e => e.category);
      this.chartDatasets = aggregatedExpensesList.map((aggregatedExpense, index) => {
        let amounts = aggregatedExpense.map((a: { amount: any; }) => a.amount.toFixed(2));
        return {data: amounts, label: this.months[index]}
      });
    } 
  }
}