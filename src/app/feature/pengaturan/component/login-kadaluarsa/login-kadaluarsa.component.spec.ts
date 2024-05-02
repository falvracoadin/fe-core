import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginKadaluarsaComponent } from './login-kadaluarsa.component';

describe('PembaruanAplikasiComponent', () => {
  let component: LoginKadaluarsaComponent;
  let fixture: ComponentFixture<LoginKadaluarsaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginKadaluarsaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginKadaluarsaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
