import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartTrendComponent } from './chart-trend.component';

describe('ChartTrendComponent', () => {
  let component: ChartTrendComponent;
  let fixture: ComponentFixture<ChartTrendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartTrendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartTrendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
