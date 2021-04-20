import { Component, OnInit } from '@angular/core';
import { ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
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
  doughnutChartData: Array<any> = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ];
  doughnutChartType: ChartType = 'doughnut';

  lineChartType: ChartType = 'line';
  lineChartDatasets: Array<any> = [
    { data: [], label: '' },
    { data: [], label: '' }
  ];
  lineChartLabels: Array<any> = [];
  lineChartColors: Array<any> = [
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

  user: any;
  users: string[] = [];
  expenses: Expense[] = [];

  constructor(private expensesService: ExpensesService) { }

  ngOnInit(): void {
    this.user = Util.getCurrentUser();
  }

  searchReport(data: any) {
    this.users = data.users;
    this.listExpenses(data.searchParams)
  }

  private listExpenses(searchParams?: any) {
      this.expensesService.listExpensesByUser(this.user.email).subscribe(expenses => {
        this.expenses = expenses;
        this.applyFilters(searchParams);
      });
  }

  private applyFilters(searchParams: any) {
    this.statusFilter();
    this.monthFilter(searchParams.month);
    
    this.buildExpensesChart(searchParams.user);
    this.buildExpensesCompareUsersChart();
  }

  private statusFilter() {
    this.expenses = this.expenses.filter(e => e.status === STATUS_APPROVED);
  }

  private monthFilter(month: string) {
    if (month) {
      this.expenses = this.expenses.filter(e => {
        const mm = e.date.split('-')[1];
        return mm === month;
      })
    }
  }

  private buildExpensesCompareUsersChart() {
    
    let aggregatedExpensesList:any = [];

    for (let i = 0; i < this.users.length; ++i) {
      let aggregatedExpenses = this.expenses
        .map(e => this.userExpenseMapping(e, this.users[i]))
        .reduce(this.aggregateExpensesByCategory, [])
      aggregatedExpensesList.push(aggregatedExpenses)  
    }

    this.updateLineChartInfo(aggregatedExpensesList);
  }

  private buildExpensesChart(user: string) {
    let aggregatedExpenses = this.expenses
      .map(e => this.userExpenseMapping(e, user))
      .reduce(this.aggregateExpensesByCategory, [])

    this.updateDoughnutChartInfo(aggregatedExpenses);
  }

  private userExpenseMapping(e: Expense, user: string) {
    if (e.chargedUser === user) {
      return { category: e.category, amount: (e.proportion*e.amount)/100 }
    } else if (e.receiverUser === user) {
      return { category: e.category, amount: ((100-e.proportion)*e.amount)/100 }
    } else {
      return  { category: e.category, amount: 1*e.amount } 
    }
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

  private updateDoughnutChartInfo(aggregatedExpenses: any[]) {
    this.doughnutChartLabels = aggregatedExpenses.map(e => e.category);
    this.doughnutChartData = [aggregatedExpenses.map(e => e.amount.toFixed(2))];
  }

  private updateLineChartInfo(aggregatedExpensesList: any[]) {
    if (aggregatedExpensesList.length > 0) {
      let aggregatedExpenses: any[] = aggregatedExpensesList[0];
      this.lineChartLabels = aggregatedExpenses.map(e => e.category);
      this.lineChartDatasets = aggregatedExpensesList.map((aggregatedExpense, index) => {
        let amounts = aggregatedExpense.map((a: { amount: any; }) => a.amount.toFixed(2));
        return {data: amounts, label: this.users[index]}
      });
    } 
  }

  chartOptions: any = {
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

}
