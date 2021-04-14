import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpensesManagerComponent } from './expenses-manager.component';

describe('ExpensesManagerComponent', () => {
  let component: ExpensesManagerComponent;
  let fixture: ComponentFixture<ExpensesManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpensesManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpensesManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
