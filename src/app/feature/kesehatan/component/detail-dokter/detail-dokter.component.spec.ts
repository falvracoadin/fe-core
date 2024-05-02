import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailDokterComponent } from './detail-dokter.component';

describe('DetailDokterComponent', () => {
  let component: DetailDokterComponent;
  let fixture: ComponentFixture<DetailDokterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailDokterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailDokterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
