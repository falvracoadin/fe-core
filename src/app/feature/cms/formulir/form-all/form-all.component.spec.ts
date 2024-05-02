import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAllComponent } from './form-all.component';

describe('FormAllComponent', () => {
  let component: FormAllComponent;
  let fixture: ComponentFixture<FormAllComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormAllComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
