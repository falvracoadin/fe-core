import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateChatComponent } from './template-chat.component';

describe('TemplateChatComponent', () => {
  let component: TemplateChatComponent;
  let fixture: ComponentFixture<TemplateChatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateChatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
