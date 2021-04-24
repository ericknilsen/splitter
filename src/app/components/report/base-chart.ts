import { STATUS_APPROVED } from "src/app/common/constants";
import { Util } from "src/app/common/util";
import { Expense } from "src/app/models/expense.model";

export class BaseChart {

  user: any;
  users: string[] = [];
  expenses: Expense[] = [];

  protected applyFilters(searchParams?: any) {
    this.statusFilter();
    if (searchParams) {
      this.monthFilter(searchParams.month);
    }
  }

  protected statusFilter() {
    this.expenses = this.expenses.filter(e => e.status === STATUS_APPROVED);
  }

  protected monthFilter(month: string) {
    if (month) {
      this.expenses = this.expenses.filter(e => {
        const mm = Util.getMonthFromStringDate(e.date);
        return mm === month;
      })
    }
  }

  protected userExpenseMapping(e: Expense, user: string) {
    if (e.chargedUser === user) {
      return { category: e.category, amount: (e.proportion*e.amount)/100 }
    } else if (e.receiverUser === user) {
      return { category: e.category, amount: ((100-e.proportion)*e.amount)/100 }
    } else {
      return { category: e.category, amount: 1*e.amount } 
    }
  }

  protected aggregateExpensesByCategory = (result: any[], current: any) => {
    const found = result.filter(e => e.category === current.category)
    if (found.length === 0) {
      result.push(current);
    } else {
      found[0].amount = parseFloat(found[0].amount) + parseFloat(current.amount);
    }
    return result;
  }

  protected compareExpensesByCategory(e1: Expense, e2: Expense ) {
    if (e1.category < e2.category){
      return -1;
    }
    if (e1.category > e2.category){
      return 1;
    }
    return 0;
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
  