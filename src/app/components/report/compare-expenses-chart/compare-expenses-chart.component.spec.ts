import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareExpensesChartComponent } from './compare-expenses-chart.component';

describe('CompareExpensesChartComponent', () => {
  let component: CompareExpensesChartComponent;
  let fixture: ComponentFixture<CompareExpensesChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompareExpensesChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompareExpensesChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
