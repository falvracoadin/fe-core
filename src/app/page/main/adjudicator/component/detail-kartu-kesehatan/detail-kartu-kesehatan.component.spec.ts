import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailKartuKesehatanComponent } from './detail-kartu-kesehatan.component';

describe('DetailKartuKesehatanComponent', () => {
  let component: DetailKartuKesehatanComponent;
  let fixture: ComponentFixture<DetailKartuKesehatanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailKartuKesehatanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailKartuKesehatanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
