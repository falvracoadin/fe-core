import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KartuIdentitasAnakComponent } from './kartu-identitas-anak.component';

describe('KartuIdentitasAnakComponent', () => {
  let component: KartuIdentitasAnakComponent;
  let fixture: ComponentFixture<KartuIdentitasAnakComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KartuIdentitasAnakComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KartuIdentitasAnakComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
