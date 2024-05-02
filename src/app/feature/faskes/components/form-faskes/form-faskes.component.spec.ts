import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFaskesComponent } from './form-faskes.component';

describe('FormFaskesComponent', () => {
  let component: FormFaskesComponent;
  let fixture: ComponentFixture<FormFaskesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormFaskesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormFaskesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
