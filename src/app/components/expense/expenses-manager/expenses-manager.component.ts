import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-expenses-manager',
  templateUrl: './expenses-manager.component.html',
  styleUrls: ['./expenses-manager.component.css']
})
export class ExpensesManagerComponent implements OnInit, AfterViewInit {

  @ViewChild('addExpenseLink')
  addExpenseLink!: ElementRef;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.addExpenseLink.nativeElement.click();
  }

}
