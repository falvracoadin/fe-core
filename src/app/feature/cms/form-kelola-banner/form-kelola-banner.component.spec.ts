import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormKelolaBannerComponent } from './form-kelola-banner.component';

describe('FormKelolaBannerComponent', () => {
  let component: FormKelolaBannerComponent;
  let fixture: ComponentFixture<FormKelolaBannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormKelolaBannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormKelolaBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
