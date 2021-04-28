import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartsSearchComponent } from './charts-search.component';

describe('ChartsSearchComponent', () => {
  let component: ChartsSearchComponent;
  let fixture: ComponentFixture<ChartsSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartsSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartsSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
