import { Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

import { MenuListService, LeftSidebarMenu } from './menu-list.service';

@Component({
  selector: 'app-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.scss']
})
export class LeftSidebarComponent implements OnInit {
  @Input() leftSidebarGrow: boolean = true;
  @Input() leftSidebarOpen: boolean = false;

  leftSidebarMenuList: LeftSidebarMenu[] = [];

  constructor(
    private menuListService: MenuListService,
    private renderer: Renderer2,
    private elementRef: ElementRef
  ) {

  }

  isSubMenuActive(subMenu: LeftSidebarMenu): boolean {
    return this.menuListService.isSubMenuActive(subMenu);
  }

  checkRoles(menu: LeftSidebarMenu): boolean {
    return this.menuListService.checkRoles(menu);
  }


  ngOnInit(): void {
    this.addIdMenuAndScroll()
  }

  counterMenu: number = 0
  addIdMenu(data: any) {
    data.forEach((index: any) => {
      this.counterMenu++;
      index.menuid = 'sidemenu' + this.counterMenu;
      if (index.hasOwnProperty('subMenu')) {
        index.subMenu = this.addIdMenu(index.subMenu)
      }
    })
    return data
  }

  addIdMenuAndScroll() {
    this.counterMenu = 0;
    var menu: any = this.addIdMenu(this.menuListService.leftSidebarMenuList)

    this.leftSidebarMenuList = menu
    setTimeout(() => {
      const element = this.elementRef.nativeElement.querySelector('#' + localStorage.getItem('menuActive'));
      if (element) {
        element.scrollIntoView(false); //true scroll max top, false scroll max bottom
      }
    }, 20);
  }

  menuClickActive(menuid: any) {
    localStorage.setItem('menuActive', menuid);
  }

}
