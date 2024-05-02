import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListLogUserActivityComponent } from './list-log-user-activity.component';

describe('ListLogUserActivityComponent', () => {
  let component: ListLogUserActivityComponent;
  let fixture: ComponentFixture<ListLogUserActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListLogUserActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListLogUserActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
