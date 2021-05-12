import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ChartType } from 'chart.js';
import { STATUS_APPROVED } from 'src/app/common/constants';
import { Util } from 'src/app/common/util';
import { Expense } from 'src/app/models/expense.model';
import { ExpensesService } from 'src/app/services/expenses.service';
import { BaseChart } from '../base-chart';

@Component({
  selector: 'app-time-chart',
  templateUrl: './time-chart.component.html',
  styleUrls: ['./time-chart.component.css']
})
export class TimeChartComponent extends BaseChart implements OnInit {

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

  totalExpensesByDateIntervalMap: Map<string,string> = new Map<string,string>();

  constructor(private expensesService: ExpensesService,
              private datePipe: DatePipe) {
    super();
  }

  ngOnInit(): void {
    this.user = Util.getCurrentUser();
    this.setChartSearchParams();
  }

  private setChartSearchParams() {
    this.chartSearchParamsMap.set('user', true);
    this.chartSearchParamsMap.set('dateInterval', true);
    this.chartSearchParamsMap.set('compareDateInterval', true);
  }

  search(data: any) {
    this.totalExpensesByDateIntervalMap = new Map<string,string>(); 
    
    let searchParams: any = {};
    searchParams.status = STATUS_APPROVED;
    searchParams.userEmail = this.user.email;
    searchParams.startDate = data.dateInterval.startDate;
    searchParams.endDate = data.dateInterval.endDate;

    const dateInterval = this.transformDate(data.dateInterval.startDate, this.adjustFutureDate(data.dateInterval.endDate));
    const compareDateInterval = this.transformDate(data.compareDateInterval.startDate, this.adjustFutureDate(data.compareDateInterval.endDate));

    this.expensesService.search(searchParams).subscribe(datePeriodExpenses => {
      this.setTotalExpensesByMonth(data.searchParams.user, datePeriodExpenses, dateInterval);
      
      searchParams.startDate = data.compareDateInterval.startDate;
      searchParams.endDate = data.compareDateInterval.endDate;
      this.expensesService.search(searchParams).subscribe(compareDatePeriodExpenses => {
        this.setTotalExpensesByMonth(data.searchParams.user, compareDatePeriodExpenses, compareDateInterval);
        this.buildChart(data.searchParams.user, [datePeriodExpenses, compareDatePeriodExpenses]);
      })
    })
  }

  private transformDate(firstDate: any, lastDate: any) {
    return `${this.datePipe.transform(firstDate, 'shortDate')} to ${this.datePipe.transform(lastDate, 'shortDate')}`;
  }
  
  private adjustFutureDate(futureDate: string) {
    let date = new Date(futureDate);
    date.setDate(date.getDate());
    return date.toDateString();
  }

  private buildChart(user: string, expensesGroup: any[]) {
    let aggregatedExpensesList: any[] = [];
    let categoriesSet: Set<string> = new Set();

    for (let i = 0; i < expensesGroup.length; ++i) {
      let expenses: Expense[] = expensesGroup[i];
      let aggregatedExpenses = expenses
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
        let labels: string[] = Array.from(this.totalExpensesByDateIntervalMap.keys());
        return {data: amounts, label: `${labels[index]} (${this.totalExpensesByDateIntervalMap.get(labels[index])})`};
      });
    } 
  }

  private setTotalExpensesByMonth(user: string, expenses: Expense[], label: any) {
    let total = expenses
      .map(e => this.userExpenseMapping(e, user))
      .map(a => a.amount)
      .reduce((previous, current) => previous+current, 0);
    this.totalExpensesByDateIntervalMap.set(label, `$${total.toFixed(2)}`);  
  }
}
