import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailTemplateChatComponent } from './detail-template-chat.component';

describe('DetailTemplateChatComponent', () => {
  let component: DetailTemplateChatComponent;
  let fixture: ComponentFixture<DetailTemplateChatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailTemplateChatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailTemplateChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
