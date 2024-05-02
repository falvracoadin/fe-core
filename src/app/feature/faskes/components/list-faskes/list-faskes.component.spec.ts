import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListFaskesComponent } from './list-faskes.component';

describe('ListFaskesComponent', () => {
  let component: ListFaskesComponent;
  let fixture: ComponentFixture<ListFaskesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListFaskesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListFaskesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
