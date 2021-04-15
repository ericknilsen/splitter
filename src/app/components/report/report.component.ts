import { Component, OnInit } from '@angular/core';
import { ChartType } from 'chart.js';
import { MultiDataSet, Label } from 'ng2-charts';
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
    
    this.listExpenses();
  }

  private listExpenses() {
    this.expensesService.listExpensesByUser(this.user.email).subscribe(expenses => {
      this.expenses = expenses;
      this.buildTotalExpensesByCategoryChart();
    });
  }

  buildTotalExpensesByCategoryChart() {
    let aggregatedExpensesByCategory = this.expenses
      .map(e => {
        return { category: e.category, amount: e.amount }
      })
      .reduce((result: any[], current: any) => {
        const found = result.filter(e => e.category === current.category)
        if (found.length === 0) {
          result.push(current);
        } else {
          found[0].amount = parseFloat(found[0].amount) + parseFloat(current.amount);
        }
        return result;
      }, [])

    this.doughnutChartLabels = aggregatedExpensesByCategory.map(a => a.category);
    this.doughnutChartData = [aggregatedExpensesByCategory.map(a => a.amount.toFixed(2))];
  }


}
