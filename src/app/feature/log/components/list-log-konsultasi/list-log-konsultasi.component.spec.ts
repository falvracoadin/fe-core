import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListLogKonsultasiComponent } from './list-log-konsultasi.component';

describe('ListLogKonsultasiComponent', () => {
  let component: ListLogKonsultasiComponent;
  let fixture: ComponentFixture<ListLogKonsultasiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListLogKonsultasiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListLogKonsultasiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
