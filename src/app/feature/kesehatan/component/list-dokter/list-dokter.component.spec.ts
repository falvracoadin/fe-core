import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDokterComponent } from './list-dokter.component';

describe('ListDokterComponent', () => {
  let component: ListDokterComponent;
  let fixture: ComponentFixture<ListDokterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListDokterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDokterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
