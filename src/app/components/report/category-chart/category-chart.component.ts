import { Component, OnInit } from '@angular/core';
import { ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import { Util } from 'src/app/common/util';
import { Expense } from 'src/app/models/expense.model';
import { BaseChart } from '../base-chart';

@Component({
  selector: 'app-category-chart',
  templateUrl: './category-chart.component.html',
  styleUrls: ['./category-chart.component.css']
})
export class CategoryChartComponent extends BaseChart implements OnInit {

  chartType: ChartType = 'doughnut';
  chartLabels: Label[] = [];
  chartData: Array<any> = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
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
    this.buildChart(data.searchParams.user);
  }    

  private buildChart(user: string) {
    const aggregatedExpenses = this.expenses
      .map(e => this.userExpenseMapping(e, user))
      .reduce(this.aggregateExpensesByCategory, [])

    this.updateChartInfo(aggregatedExpenses);
  }

  private updateChartInfo(aggregatedExpenses: any[]) {
    this.chartLabels = aggregatedExpenses.map(e => e.category);
    this.chartData = [aggregatedExpenses.map(e => e.amount.toFixed(2))];
  }
}