import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KelolaDokumenComponent } from './kelola-dokumen.component';

describe('KelolaDokumenComponent', () => {
  let component: KelolaDokumenComponent;
  let fixture: ComponentFixture<KelolaDokumenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KelolaDokumenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KelolaDokumenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
