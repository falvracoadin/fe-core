import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListKonsultasiComponent } from './list-konsultasi.component';

describe('ListKonsultasiComponent', () => {
  let component: ListKonsultasiComponent;
  let fixture: ComponentFixture<ListKonsultasiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListKonsultasiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListKonsultasiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
