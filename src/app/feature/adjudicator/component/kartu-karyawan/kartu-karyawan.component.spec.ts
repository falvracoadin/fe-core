import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KartuKaryawanComponent } from './kartu-karyawan.component';

describe('KartuKaryawanComponent', () => {
  let component: KartuKaryawanComponent;
  let fixture: ComponentFixture<KartuKaryawanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KartuKaryawanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KartuKaryawanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
