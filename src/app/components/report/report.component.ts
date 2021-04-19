import { Component, OnInit } from '@angular/core';
import { ChartType } from 'chart.js';
import { MultiDataSet, Label } from 'ng2-charts';
import { STATUS_APPROVED } from 'src/app/common/constants';
import { Util } from 'src/app/common/util';
import { Expense } from 'src/app/models/expense.model';
import { ExpensesService } from 'src/app/services/expenses.service';


@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  doughnutChartLabels: Label[] = [];
  doughnutChartData: MultiDataSet = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ];
  doughnutChartType: ChartType = 'doughnut';

  user: any;
  expenses: Expense[] = [];

  constructor(private expensesService: ExpensesService) { }

  ngOnInit(): void {
    this.user = Util.getCurrentUser();
  }

  private listExpenses(searchParams?: any) {
    this.expensesService.listExpensesByUser(this.user.email).subscribe(expenses => {
      this.expenses = expenses.filter(e => e.status === STATUS_APPROVED)
      if (searchParams && searchParams.month) {
        this.expenses = this.expenses.filter(e => {
          const month = e.date.split('-')[1];
          return month === searchParams.month;
        })
      }
      if (searchParams && searchParams.user) {
        this.buildUserExpensesByCategoryChart(searchParams.user)
      } else {
        this.buildTotalExpensesByCategoryChart();
      }
    });
  }

  private aggregateExpensesByCategory = (result: any[], current: any) => {
    const found = result.filter(e => e.category === current.category)
    if (found.length === 0) {
      result.push(current);
    } else {
      found[0].amount = parseFloat(found[0].amount) + parseFloat(current.amount);
    }
    return result;
  }

  private updateDoughnutChartInfo(aggregatedExpensesByCategory: any[]) {
    this.doughnutChartLabels = aggregatedExpensesByCategory.map(a => a.category);
    this.doughnutChartData = [aggregatedExpensesByCategory.map(a => a.amount.toFixed(2))];
  }

  buildUserExpensesByCategoryChart(user: string) {
    let aggregatedExpensesByCategory = this.expenses
      .map(e => {
        if (e.chargedUser === user) {
          return { category: e.category, amount: (e.proportion*e.amount)/100 }
        } else {
          return { category: e.category, amount: ((100-e.proportion)*e.amount)/100 }
        } 
      })
      .reduce(this.aggregateExpensesByCategory, [])

    this.updateDoughnutChartInfo(aggregatedExpensesByCategory);
  }

  buildTotalExpensesByCategoryChart() {
    let aggregatedExpensesByCategory = this.expenses
      .map(e => {
        return { category: e.category, amount: 1*e.amount }
      })
      .reduce(this.aggregateExpensesByCategory, [])

    this.updateDoughnutChartInfo(aggregatedExpensesByCategory);
  }

  public chartOptions: any = {
    responsive: true,
    tooltips: {
      enabled: true,
      callbacks: {
        label: function (tooltipItem:any, data:any) {
          let label = data.labels[tooltipItem.index];
          let count: any = data
            .datasets[tooltipItem.datasetIndex]
            .data[tooltipItem.index];
          return label + ": $" + count;
        },
      },
    }
  };

  searchReport(searchParams: any) {
    this.listExpenses(searchParams)
    console.log(searchParams)
  }

}
