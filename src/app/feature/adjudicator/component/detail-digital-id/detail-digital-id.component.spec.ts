import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailDigitalIdComponent } from './detail-digital-id.component';

describe('DetailDigitalIdComponent', () => {
  let component: DetailDigitalIdComponent;
  let fixture: ComponentFixture<DetailDigitalIdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailDigitalIdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailDigitalIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
