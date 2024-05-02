import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDokterComponent } from './form-dokter.component';

describe('FormDokterComponent', () => {
  let component: FormDokterComponent;
  let fixture: ComponentFixture<FormDokterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormDokterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDokterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
