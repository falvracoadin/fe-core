import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KelolaBannerComponent } from './kelola-banner.component';

describe('KelolaBannerComponent', () => {
  let component: KelolaBannerComponent;
  let fixture: ComponentFixture<KelolaBannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KelolaBannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KelolaBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
