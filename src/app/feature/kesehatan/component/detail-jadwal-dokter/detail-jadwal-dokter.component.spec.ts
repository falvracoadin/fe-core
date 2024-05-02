import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailJadwalDokterComponent } from './detail-jadwal-dokter.component';

describe('DetailJadwalDokterComponent', () => {
  let component: DetailJadwalDokterComponent;
  let fixture: ComponentFixture<DetailJadwalDokterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailJadwalDokterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailJadwalDokterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
