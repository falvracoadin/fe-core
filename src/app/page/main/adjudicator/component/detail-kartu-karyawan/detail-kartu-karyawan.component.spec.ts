import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailKartuKaryawanComponent } from './detail-kartu-karyawan.component';

describe('DetailKartuKaryawanComponent', () => {
  let component: DetailKartuKaryawanComponent;
  let fixture: ComponentFixture<DetailKartuKaryawanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailKartuKaryawanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailKartuKaryawanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
