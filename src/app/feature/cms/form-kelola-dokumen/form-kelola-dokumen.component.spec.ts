import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormKelolaDokumenComponent } from './form-kelola-dokumen.component';

describe('FormKelolaDokumenComponent', () => {
  let component: FormKelolaDokumenComponent;
  let fixture: ComponentFixture<FormKelolaDokumenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormKelolaDokumenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormKelolaDokumenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
