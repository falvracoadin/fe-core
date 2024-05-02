import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListReservasiComponent } from './list-reservasi.component';

describe('ListReservasiComponent', () => {
  let component: ListReservasiComponent;
  let fixture: ComponentFixture<ListReservasiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListReservasiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListReservasiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
