import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareUserExpensesChartComponent } from './compare-user-expenses-chart.component';

describe('CompareUserExpensesChartComponent', () => {
  let component: CompareUserExpensesChartComponent;
  let fixture: ComponentFixture<CompareUserExpensesChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompareUserExpensesChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompareUserExpensesChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
