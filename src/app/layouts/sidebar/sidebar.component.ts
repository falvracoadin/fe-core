import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, Input, OnChanges } from '@angular/core';
// import MetisMenu from 'metismenujs/dist/metismenujs';
import { EventService } from '../../core/services/event.service';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from 'src/app/feature/auth/services/auth.service';

import { MENU } from './menu';
import { MenuItem } from './menu.model';

interface Role {
  supervisor: boolean;
  operator: boolean;
  superadmin: boolean;
  rekonsile: boolean;
  jasmed: boolean;
};

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})

/**
 * Sidebar component
 */
export class SidebarComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() isCondensed = false;

  menu: any;

  menuItems : any = [];
  configData : any;
  role : Role =  {
    supervisor: false,
    operator: false,
    superadmin: false,
    rekonsile: false,
    jasmed: false,
  };

  @ViewChild('sideMenu') sideMenu!: ElementRef;

  constructor(
    private eventService: EventService,
    private router: Router,
    private authService: AuthService
  ) {
    router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        this._activateMenuDropdown();
      }
    }).then();
  }

  ngOnInit() {
    this.initialize();

    document.body.setAttribute('data-sidebar', 'light');

    this.configData = {
      suppressScrollX: true,
      wheelSpeed: 0.3
    };

    this.role = this.authService.getUserRole();
  }
  /**
   * Change the layout onclick
   * @param layout Change the layout
   */
  changeLayout(layout: string) {
    this.eventService.broadcast('changeLayout', layout);
  }

  ngAfterViewInit() {
    // this.menu = new MetisMenu(this.sideMenu.nativeElement);

    this._activateMenuDropdown();
  }

  ngOnChanges() {
    if (!this.isCondensed && this.sideMenu || this.isCondensed) {
      setTimeout(() => {
        // this.menu = new MetisMenu(this.sideMenu.nativeElement);
      });
    } else if (this.menu) {
      this.menu.dispose();
    }
  }

  /**
   * remove active and mm-active class
   */
  _removeAllClass(className : any) {
    const els = document.getElementsByClassName(className);
    while (els[0]) {
      els[0].classList.remove(className);
    }
  }

  /**
   * Activate the parent dropdown
   */
  _activateMenuDropdown() {
    this._removeAllClass('mm-active');
    this._removeAllClass('active');
    this._removeAllClass('mm-show');
    const links : any = document.getElementsByClassName('side-nav-link-ref');
    let menuItemEl = null;
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < links.length; i++) {
      // tslint:disable-next-line: no-string-literal
      if (window.location.pathname.includes(links[i]['pathname'])) {
        menuItemEl = links[i];
        break;
      }
    }

    if (menuItemEl) {
      menuItemEl.classList.add('active');
      menuItemEl.classList.add('submenu-active');
      const parentEl = menuItemEl.parentElement;


      if (parentEl) {
        parentEl.classList.add('mm-active');
        const parent2El = parentEl.parentElement.closest('ul');

        if (parent2El && parent2El.id !== 'side-menu') {
          parent2El.classList.add('mm-show');
          const parent3El = parent2El.parentElement;

          if (parent3El) {
            parent3El.classList.add('mm-active');
            const childAnchor = parent3El.querySelector('.has-arrow');
            const childDropdown = parent3El.querySelector('.has-dropdown');
            if (childAnchor) {
              childAnchor.classList.add('mm-active');
              childAnchor.classList.add('active');
            }
            const parent4El = parent3El.parentElement;

            if (parent4El) {
              parent4El.classList.add('mm-show');
              const parent5El = parent4El.parentElement;

              if (parent5El) {
                if (parent5El.id !== 'sidebar-menu') {
                  const childAnchor2 = parent5El.querySelector('.has-arrow');
                  if (childAnchor2) {
                    childAnchor2.classList.add('mm-active');
                    childAnchor2.classList.add('active');
                  }
                }
                parent5El.classList.add('mm-active');
              }
            }
          }
        }
      }
    }
  }

  initialize(): void {
    this.menuItems= MENU;
  }

  /**
   * Returns true or false if given menu item has child or not
   * @param item menuItem
   */
  hasItems(item: MenuItem) {
    return item.subItems !== undefined ? item.subItems.length > 0 : false;
  }

  checkItemRole(item: any) {
    if (item.role) {
      if (item.role.includes('superadmin') && this.role.superadmin) {
        return true;
      } else if (item.role.includes('supervisor') && this.role.supervisor) {
        return true;
      } else if (item.role.includes('operator') && this.role.operator) {
        return true;
      } else if (item.role.includes('rekonsile') && this.role.rekonsile) {
        return true;
      } else if (item.role.includes('jasmed') && this.role.jasmed) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  checkSubSubItemActive(item: any) {
    let active = false;
    const nowRoute = window.location.pathname;
    if (item.subItems) {
      item.subItems.forEach((element : any) => {
        if (nowRoute.includes(element.link)) {
          active = true;
        } else if (element.subItems) {
          element.subItems.forEach((element2 : any )=> {
            if (nowRoute.includes(element2.link)) {
              active = true;
            }
          });
        }
      });
    }
    return active;
  }
}
