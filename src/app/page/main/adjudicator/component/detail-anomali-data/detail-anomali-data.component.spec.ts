import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailAnomaliDataComponent } from './detail-anomali-data.component';

describe('DetailAnomaliDataComponent', () => {
  let component: DetailAnomaliDataComponent;
  let fixture: ComponentFixture<DetailAnomaliDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailAnomaliDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailAnomaliDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
