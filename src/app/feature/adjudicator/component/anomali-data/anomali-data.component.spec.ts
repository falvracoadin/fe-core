import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnomaliDataComponent } from './anomali-data.component';

describe('AnomaliDataComponent', () => {
  let component: AnomaliDataComponent;
  let fixture: ComponentFixture<AnomaliDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnomaliDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnomaliDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
