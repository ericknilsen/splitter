import { Component, OnInit } from '@angular/core';
import { ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import { STATUS_APPROVED } from 'src/app/common/constants';
import { Util } from 'src/app/common/util';
import { Expense } from 'src/app/models/expense.model';
import { ExpensesService } from 'src/app/services/expenses.service';
import { UserGroupService } from 'src/app/services/user-groups.service';


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

  public lineChartType: ChartType = 'line';
  public lineChartDatasets: Array<any> = [
    { data: [], label: '' },
    { data: [], label: '' }
  ];
  public lineChartLabels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

  public lineChartColors: Array<any> = [
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

  constructor(private expensesService: ExpensesService,
              private userGroupService: UserGroupService) { }

  ngOnInit(): void {
    this.user = Util.getCurrentUser();
    this.listUserGroupOfUser();
  }

  private listUserGroupOfUser() {
    this.userGroupService.listUserGroupOfUser(this.user.email).subscribe(userGroup => {
      this.users = userGroup.users;
    })
  }

  searchReport(searchParams: any) {
    this.listExpenses(searchParams)
  }

  private listExpenses(searchParams?: any) {
    if (this.expenses.length === 0) {
      this.expensesService.listExpensesByUser(this.user.email).subscribe(expenses => {
        this.expenses = expenses;
        this.applyFilters(searchParams);
      });
    } else {
      this.applyFilters(searchParams)
    }
  }

  private applyFilters(searchParams: any) {
    this.expenses = this.expenses.filter(e => e.status === STATUS_APPROVED);
    if (searchParams.month) {
      this.expenses = this.monthFilter(searchParams.month);
      this.buildExpensesChart(this.expenseMapping);
      this.buildExpensesCompareUsersChart(this.userExpenseMapping);
    }
    if (searchParams.user) {
      this.buildExpensesChart(this.userExpenseMapping, searchParams.user);
    }
  }

  private monthFilter(month: string) {
    return this.expenses.filter(e => {
      const mm = e.date.split('-')[1];
      return mm === month;
    })
  }

  private buildExpensesCompareUsersChart(mapping: any) {
    
    let aggregatedExpensesList:any = [];

    for (let i = 0; i < this.users.length; ++i) {
      let aggregatedExpenses = this.expenses
        .map(e => mapping(e, this.users[i]))
        .reduce(this.aggregateExpensesByCategory, [])
      aggregatedExpensesList.push(aggregatedExpenses)  
    }
    
    this.updateLineChartInfo(aggregatedExpensesList);
  }

  private buildExpensesChart(mapping: any, user?: string) {
    let aggregatedExpenses = this.expenses
      .map(e => mapping(e, user))
      .reduce(this.aggregateExpensesByCategory, [])

    this.updateDoughnutChartInfo(aggregatedExpenses);
  }

  private userExpenseMapping(e: Expense, user: string) {
    if (e.chargedUser === user) {
      return { category: e.category, amount: (e.proportion*e.amount)/100 }
    } else {
      return { category: e.category, amount: ((100-e.proportion)*e.amount)/100 }
    } 
  }

  private expenseMapping(e: Expense) {
    return { category: e.category, amount: 1*e.amount }   
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
    let aggregatedExpenses: any[] = aggregatedExpensesList[0];
    this.lineChartLabels = aggregatedExpenses.map(e => e.category);
    this.lineChartDatasets = aggregatedExpensesList.map((aggregatedExpense, index) => {
      let amounts = aggregatedExpense.map((a: { amount: any; }) => a.amount.toFixed(2));
      return {data: amounts, label: this.users[index]}
    });
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

}
