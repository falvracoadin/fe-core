import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailFaskesComponent } from './detail-faskes.component';

describe('DetailFaskesComponent', () => {
  let component: DetailFaskesComponent;
  let fixture: ComponentFixture<DetailFaskesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailFaskesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailFaskesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
