import { Component, OnInit, ViewChild } from '@angular/core';
import { Util } from 'src/app/common/util';
import { Expense } from 'src/app/models/expense.model';
import { ExpensesService } from 'src/app/services/expenses.service';
import { CategoryChartComponent } from './category-chart/category-chart.component';
import { CompareExpensesChartComponent } from './compare-expenses-chart/compare-expenses-chart.component';
import { CompareUserExpensesChartComponent } from './compare-user-expenses-chart/compare-user-expenses-chart.component';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  @ViewChild('categoryChart')
  categoryChart!: CategoryChartComponent;

  @ViewChild('compareUserExpensesChart')
  compareUserExpensesChart!: CompareUserExpensesChartComponent;
  
  @ViewChild('compareExpensesChart')
  compareExpensesChart!: CompareExpensesChartComponent;

  selectedChart: any;
  
  user: any;
  expenses: Expense[] = [];
  compareMonth!: string;

  constructor(private expensesService: ExpensesService) { }

  ngOnInit(): void {
    this.user = Util.getCurrentUser();
  }

  searchReport(data: any) {
    this.compareMonth = data.searchParams.compareMonth;
    this.listExpenses(data);
  }

  private listExpenses(data: any) {
    this.expensesService.listExpensesByUser(this.user.email).subscribe(expenses => {
      this.expenses = expenses;
      this.selectedChart = this.compareMonth? this.compareExpensesChart: this.categoryChart;
      this.selectedChart.searchReport(data, expenses);
      this.compareUserExpensesChart.searchReport(data, expenses);
    });
  }
}
