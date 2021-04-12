import { AfterContentChecked, AfterContentInit, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-payments-manager',
  templateUrl: './payments-manager.component.html',
  styleUrls: ['./payments-manager.component.css']
})
export class PaymentsManagerComponent implements OnInit, AfterViewInit {

  @ViewChild('addPaymentLink')
  addPaymentLink!: ElementRef;

  constructor() { }
 
  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.addPaymentLink.nativeElement.click();
  }

}
