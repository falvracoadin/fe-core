import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSpesialisComponent } from './list-spesialis.component';

describe('ListSpesialisComponent', () => {
  let component: ListSpesialisComponent;
  let fixture: ComponentFixture<ListSpesialisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListSpesialisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSpesialisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
