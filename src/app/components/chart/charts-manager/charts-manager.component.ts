import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-charts-manager',
  templateUrl: './charts-manager.component.html',
  styleUrls: ['./charts-manager.component.css']
})
export class ChartsManagerComponent implements OnInit, AfterViewInit {

  @ViewChild('categoriesChartLink')
  categoriesChartLink!: ElementRef;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.categoriesChartLink.nativeElement.click();
  }

}
