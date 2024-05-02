import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartPendapatanComponent } from './chart-pendapatan.component';

describe('ChartPendapatanComponent', () => {
  let component: ChartPendapatanComponent;
  let fixture: ComponentFixture<ChartPendapatanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartPendapatanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartPendapatanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
