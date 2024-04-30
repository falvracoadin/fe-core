import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-page-title',
  // template: `
  //   <div class="mb-4">
  //     <p style="font-weight: 700; font-size: 32px; color: #231F20">{{ title | titlecase }}</p>

  //     <div *ngIf="breadcrumb.length > 0" style="padding-top: 10px">
  //       <a *ngFor="let item of breadcrumb; let i = index" style="text-decoration: none; font-size: 14px" class="{{ i === breadcrumb.length - 1 ? 'text-active' : 'text-unactive' }}">
  //         <span *ngIf="i > 0" style="padding: 0 5px">/</span>
  //         <span>{{ item | titlecase }}</span>
  //       </a>
  //     </div>
  //   </div>
  // `,
  template: `
  <div class="mb-3">
    <div class="row align-items-center g-0">
      <div class="col-6">
        <p style="font-weight: 700; font-size: 25px; color: #231F20">{{ title }}</p>
      </div>
      <div class="col-6 text-end">
        <div *ngIf="breadcrumb.length > 0">
        <a *ngFor="let item of breadcrumb; let i = index" style="text-decoration: none; font-size: 14px" class="{{ i === breadcrumb.length - 1 ? 'text-active' : 'text-unactive' }}">
          <span *ngIf="i > 0" style="padding: 0 5px">/</span>
          <span>{{ item | titlecase }}</span>
        </a>
        </div>
      </div>
    </div>
  </div>
  `,
  styles: [`
    .text-unactive {
      color: #1E1E1E;
    }

    .text-active {
      color: #21409A;
      cursor: pointer;
    }
  `]
})
export class PageTitleComponent {
  @Input() title: string = '';
  @Input({required: false}) breadcrumb: string[] = [];
}
