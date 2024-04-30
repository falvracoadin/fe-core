import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailKartuIdentitasAnakComponent } from './detail-kartu-identitas-anak.component';

describe('DetailKartuIdentitasAnakComponent', () => {
  let component: DetailKartuIdentitasAnakComponent;
  let fixture: ComponentFixture<DetailKartuIdentitasAnakComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailKartuIdentitasAnakComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailKartuIdentitasAnakComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
