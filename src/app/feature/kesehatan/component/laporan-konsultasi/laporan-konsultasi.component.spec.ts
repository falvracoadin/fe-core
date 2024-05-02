import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaporanKonsultasiComponent } from './laporan-konsultasi.component';

describe('LaporanKonsultasiComponent', () => {
  let component: LaporanKonsultasiComponent;
  let fixture: ComponentFixture<LaporanKonsultasiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaporanKonsultasiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaporanKonsultasiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
