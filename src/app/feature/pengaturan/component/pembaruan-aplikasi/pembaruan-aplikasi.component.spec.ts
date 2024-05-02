import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PembaruanAplikasiComponent } from './pembaruan-aplikasi.component';

describe('PembaruanAplikasiComponent', () => {
  let component: PembaruanAplikasiComponent;
  let fixture: ComponentFixture<PembaruanAplikasiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PembaruanAplikasiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PembaruanAplikasiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
