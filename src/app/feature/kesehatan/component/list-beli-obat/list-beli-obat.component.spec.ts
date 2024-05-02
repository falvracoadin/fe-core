import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBeliObatComponent } from './list-beli-obat.component';

describe('ListBeliObatComponent', () => {
  let component: ListBeliObatComponent;
  let fixture: ComponentFixture<ListBeliObatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListBeliObatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListBeliObatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
