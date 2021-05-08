import { Component, OnInit } from '@angular/core';
import { ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import { STATUS_APPROVED } from 'src/app/common/constants';
import { Util } from 'src/app/common/util';
import { ExpensesService } from 'src/app/services/expenses.service';
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

  percentageExpensesByCategoryMap: Map<string,string> = new Map<string,string>();
  totalAmount: string = '';

  constructor(private expensesService: ExpensesService) {
    super();
  }

  ngOnInit(): void {
    this.user = Util.getCurrentUser();
    this.setChartSearchParams();
  }

  private setChartSearchParams() {
    this.chartSearchParamsMap.set('user', true);
    this.chartSearchParamsMap.set('month', true);
  }

  search(data: any) {
    let searchParams: any = {};
    searchParams.status = STATUS_APPROVED;
    searchParams.userEmail = this.user.email;
    searchParams.startDate = data.dateInterval.startDate;
    searchParams.endDate = data.dateInterval.endDate;
    this.expensesService.search(searchParams).subscribe(result => {
      this.expenses = result;
      this.buildChart(data.searchParams.user);
    })
  }

  private buildChart(user: string) {
    const aggregatedExpenses = this.expenses
      .map(e => this.userExpenseMapping(e, user))
      .reduce(this.aggregateExpensesByCategory, [])

    this.setPercentageExpensesByCategory(aggregatedExpenses)
    this.updateChartInfo(aggregatedExpenses);
  }

  private updateChartInfo(aggregatedExpenses: any[]) {
    this.chartLabels = aggregatedExpenses.map(e => `${e.category} (${this.percentageExpensesByCategoryMap.get(e.category)})`);
    this.chartData = [aggregatedExpenses.map(e => e.amount.toFixed(2))];
  }

  private setPercentageExpensesByCategory(aggregatedExpenses: any[]) {
    const total = aggregatedExpenses
                    .map(a => a.amount)
                    .reduce((previous, current) => previous+current, 0);
    
    for (let i = 0; i < aggregatedExpenses.length; ++i) {
      const categoryAmount = aggregatedExpenses[i].amount;
      const categoryPercentage = categoryAmount*100/total;
      this.percentageExpensesByCategoryMap.set(aggregatedExpenses[i].category, `${categoryPercentage.toFixed(2)}%`)
    }

    this.totalAmount = total;
  }
}
