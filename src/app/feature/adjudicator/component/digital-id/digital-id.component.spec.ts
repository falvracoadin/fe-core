import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalIdComponent } from './digital-id.component';

describe('DigitalIdComponent', () => {
  let component: DigitalIdComponent;
  let fixture: ComponentFixture<DigitalIdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DigitalIdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DigitalIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
