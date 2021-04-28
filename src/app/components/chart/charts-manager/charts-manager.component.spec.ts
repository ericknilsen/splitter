import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartsManagerComponent } from './charts-manager.component';

describe('ChartsManagerComponent', () => {
  let component: ChartsManagerComponent;
  let fixture: ComponentFixture<ChartsManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartsManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartsManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
