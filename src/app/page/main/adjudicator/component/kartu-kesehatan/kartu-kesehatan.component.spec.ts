import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KartuKesehatanComponent } from './kartu-kesehatan.component';

describe('KartuKesehatanComponent', () => {
  let component: KartuKesehatanComponent;
  let fixture: ComponentFixture<KartuKesehatanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KartuKesehatanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KartuKesehatanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
