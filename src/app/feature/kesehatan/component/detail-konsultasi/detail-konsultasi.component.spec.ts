import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailKonsultasiComponent } from './detail-konsultasi.component';

describe('DetailKonsultasiComponent', () => {
  let component: DetailKonsultasiComponent;
  let fixture: ComponentFixture<DetailKonsultasiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailKonsultasiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailKonsultasiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
