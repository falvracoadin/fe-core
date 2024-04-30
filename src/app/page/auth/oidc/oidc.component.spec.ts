import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OidcComponent } from './oidc.component';

describe('OidcComponent', () => {
  let component: OidcComponent;
  let fixture: ComponentFixture<OidcComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OidcComponent]
    });
    fixture = TestBed.createComponent(OidcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
