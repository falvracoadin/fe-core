import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListFormulirComponent } from './list-formulir.component';

describe('ListFormulirComponent', () => {
  let component: ListFormulirComponent;
  let fixture: ComponentFixture<ListFormulirComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListFormulirComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListFormulirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
