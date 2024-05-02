import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailSpesialisComponent } from './detail-spesialis.component';

describe('DetailSpesialisComponent', () => {
  let component: DetailSpesialisComponent;
  let fixture: ComponentFixture<DetailSpesialisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailSpesialisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailSpesialisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
