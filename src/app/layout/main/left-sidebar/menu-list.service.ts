import { Injectable } from '@angular/core';

import { AuthService } from '../../../core/service/auth.service';
import { PermissionsService } from '../../../core/service/permissions.service';
import * as PermissionData from '../../../core/data/permission.json';

export interface LeftSidebarMenu {
  name: string;
  link: string;
  icon?: string;
  roles?: string[];
  subMenuActive?: boolean;
  subMenu?: LeftSidebarMenu[];
  menuid?: boolean;
  key?: string;
}

@Injectable({
  providedIn: 'root',
})
export class MenuListService {
  permissions: string[] = this.authService.GetTokenPayload().Permission;
  permissionData = PermissionData;
  leftSidebarMenuList: LeftSidebarMenu[] = [
    {
      name: 'Dashboard',
      icon: 'dashboard',
      link: '/dashboard',
    },
    {
      name: 'Penghimpunan',
      icon: 'collection',
      link: '/collection',
      subMenuActive: false,
      key: this.permissionData.Penghimpunan._key,
      subMenu: [
        // {
        //   name: 'Data Himpunan',
        //   link: '/data',
        //   subMenuActive: false,
        //   key: this.permissionData.Penghimpunan._key,
        //   subMenu: [

        //   ]
        // },
        {
          name: 'Data Himpun',
          link: '/penghimpun',
          key: this.permissionData.Penghimpunan.Penghimpun._key
        },
        {
          name: 'Zakat',
          link: '/zakat',
          key: this.permissionData.Penghimpunan.Zakat._key
        },
        {
          name: 'Infak/Sedekah',
          link: '/infaq',
          key: this.permissionData.Penghimpunan.Infaq._key
        },
        // {
        //   name: 'Koin NU',
        //   link: '/koinnu',
        //   key: this.permissionData.Penghimpunan['Koin NU']._key
        // },
        // {
        //   name: 'Sedekah',
        //   link: '/sodaqah',
        //   key: this.permissionData.Penghimpunan.Sodaqoh._key
        // },
        // {
        //   name: 'Waqaf',
        //   link: '/wakaf',
        //   key: this.permissionData.Penghimpunan.Waqaf._key
        // },
        {
          name: 'Kurban',
          link: '/qurban',
          key: this.permissionData.Penghimpunan.Qurban._key
        },
        {
          name: 'Fidyah/Kafarat',
          link: '/fidyah',
          key: this.permissionData.Penghimpunan.Fidyah._key
        }
        // {
        //   name: 'Data Donatur',
        //   link: '/donor',
        //   key: this.permissionData.Penghimpunan['Data Donatur']._key
        // }
      ],
    },
    {
      name: 'Manajemen Konten',
      icon: 'content-management',
      link: '/content-management',
      subMenuActive: false,
      key: this.permissionData['Manajemen Konten']._key,
      subMenu: [
        {
          name: 'Layanan LAZISNU',
          icon: 'content-management',
          link: '/content-layanan',
          subMenuActive: false,
          key: this.permissionData['Manajemen Layanan']._key,
          subMenu: [
            {
              name: 'Zakat Fitrah',
              link: '/zakatfitrah',
              key: this.permissionData['Manajemen Layanan'].Layanan['Zakat Fitrah']._key
            },
            {
              name: 'Zakat Maal',
              link: '/zakatmaal',
              key: this.permissionData['Manajemen Layanan'].Layanan['Zakat Maal']._key
            },
            {
              name: 'Infak/Sedekah',
              link: '/infaq',
              key: this.permissionData['Manajemen Layanan'].Layanan.Infaq._key
            },
            // {
              //   name: 'Sedekah',
              //   link: '/sodaqah',
            //   key: this.permissionData['Manajemen Layanan'].Layanan.Sodaqoh._key
            // },
            // {
            //   name: 'Waqaf',
            //   link: '/wakaf',
            //   key: this.permissionData['Manajemen Layanan'].Layanan.Waqaf._key
            // },
            {
              name: 'Campaign',
              link: '/campaign',
              key: this.permissionData['Manajemen Layanan'].Layanan.Campaign._key
            },
            {
              name: 'Kurban',
              link: '/qurban',
              key: this.permissionData['Manajemen Layanan'].Layanan.Qurban._key
            },
            {
              name: 'Fidyah/Kafarat',
              link: '/fidyah',
              key: this.permissionData['Manajemen Layanan'].Layanan.Fidyah._key
            },
            {
              name: 'Koin NU',
              link: '/koinnu',
              key: this.permissionData['Manajemen Layanan'].Layanan['Koin NU']._key
            },
            // {
            //   name: 'Kalkulator & Konversi',
            //   link: '/calculators-conversions',
            //   subMenuActive: false,
            //   key: this.permissionData['Manajemen Layanan']['Kalkulator & Konversi']._key,
            //   subMenu: [
            //     
            //     {
            //       name: 'Konversi Natura',
            //       link: '/natura-conversion',
            //       key: this.permissionData['Manajemen Layanan']['Kalkulator & Konversi']['Konversi Natura']._key
            //     }
            //   ]
            // }
            {
              name: 'Kalkulator',
              link: '/calculator',
              key: this.permissionData['Manajemen Layanan'].Kalkulator._key
            },
          ]
        },
        {
          name: 'Layanan Lainnya',
          link: '/other',
          subMenuActive: false,
          key: this.permissionData["Manajemen Konten"]._key,
          subMenu: [
            {
              name: 'Banner',
              link: '/banner-management',
              key: this.permissionData['Manajemen Konten']['Banner']._key,
            },
            {
              name: 'Lokasi Cabang',
              link: '/branch',
              key: this.permissionData['Manajemen Konten']['Lokasi Cabang']._key,
            },
            {
              name: 'Profil NU CARE',
              link: '/nu-care',
              key: this.permissionData['Manajemen Konten']['NU Care']._key,
            },
            {
              name: 'Edukasi',
              link: '/education',
              key: this.permissionData['Manajemen Konten'].Edukasi._key,
            },
            {
              name: 'Berita',
              link: '/news',
              key: this.permissionData['Manajemen Konten'].Berita._key,
            },
            {
              name: 'Fiqih',
              link: '/fiqih',
              key: this.permissionData['Manajemen Konten'].Fiqih._key,
            },
            {
              name: 'Kemaslahatan',
              link: '/kemaslahatan',
              key: this.permissionData['Manajemen Konten'].Kemaslahatan._key,
            },
            {
              name: 'Youtube',
              link: '/youtube',
              key: this.permissionData['Manajemen Konten'].Youtube._key,
            },
            {
              name: 'Wirid',
              link: '/wirid',
              key: this.permissionData['Manajemen Konten'].Wirid._key,
            },
            {
              name: 'Tahlil',
              link: '/tahlil',
              key: this.permissionData['Manajemen Konten'].Tahlil._key,
            },
          ]
        },
        {
          name: 'Konten HTML',
          link: '/content-kontak',
          subMenuActive: false,
          key: this.permissionData["Manajemen Kontak"]._key,
          subMenu: [
            {
              name: 'Kontak Kami',
              link: '/contact',
              key: this.permissionData['Manajemen Kontak']['Kontak Kami']._key,
            },
            {
              name: 'Informasi',
              link: '/content-html',
              key: this.permissionData['Manajemen Kontak']['Konten HTML']._key,
            },
            {
              name: 'Virtual Account',
              link: '/virtual-account',
              // key: this.permissionData['Manajemen Kontak']['Virtual Account']._key,
            },
          ]
        }
      ],
    },
    {
      name: 'Manajemen User',
      icon: 'user-management',
      link: '/user-management',
      subMenuActive: false,
      key: this.permissionData['Manajemen User']._key,
      subMenu: [
        {
          name: 'Data Publik User',
          link: '/public',
          key: this.permissionData['Manajemen User']['Data Publik User']._key,
        },
        {
          name: 'Data Petugas Amil',
          link: '/amil-officer',
          key: this.permissionData['Manajemen User']['Data Petugas Amil']._key,
        },
        {
          name: 'Data Admin',
          link: '/admin',
          key: this.permissionData['Manajemen User']['Data Admin']._key,
        },
        {
          name: 'Log Aktivitas',
          link: '/activity-log',
          key: this.permissionData['Manajemen User']['Log Aktivitas']._key,
        },
      ],
    },
    {
      name: 'Manajemen Role',
      icon: 'role-management',
      link: '/role-management',
      key: this.permissionData['Manajemen Role']._key,
    },
    // {
    //   name: 'Broadcast',
    //   icon: 'broadcast',
    //   link: '/broadcast',
    //   subMenuActive: false,
    //   key: this.permissionData['Broadcast']._key,
    //   subMenu: [
    //     {
    //       name: 'Push Notifikasi',
    //       link: '/push-notification',
    //       key: this.permissionData['Broadcast']['Push Notification']._key
    //     }
    //   ]
    // },
    {
      name: 'Laporan Adjudikator',
      icon: 'dashboard',
      link: '/adjudicator-report',
      subMenuActive: false,
      key: this.permissionData['Laporan Adjudikator']._key,
      subMenu: [
        {
          name: 'ID Digital',
          link: '/digital-id',
          subMenuActive: false,
          key: this.permissionData['Laporan Adjudikator']['ID Digital']._key,
          subMenu: [
            {
              name: 'KTP',
              link: '/identity-card',
              key: this.permissionData['Laporan Adjudikator']['ID Digital'].KTP
                ._key,
            },
            {
              name: 'ID Lazisnu',
              link: '/lazisnu-id',
              key: this.permissionData['Laporan Adjudikator']['ID Digital'][
                'ID Lazisnu'
              ]._key,
            },
          ],
        },
        {
          name: 'Data Anomali',
          link: '/anomaly',
          key: this.permissionData['Laporan Adjudikator']['Data Anomali']._key,
        },
      ],
    },
    {
      name: 'Merchant',
      icon: 'merchant',
      link: '/merchant',
      key: this.permissionData['Merchant']._key,
    },
    {
      // key pada permissionData perlu diubah sesuai dengan key yang ada di json permission
      // diubah ketika sudah selesai slicing dan integrasi
      name: 'Pengaturan',
      icon: 'cog',
      link: '/setting',
      subMenuActive: false,
      key: this.permissionData['Pengaturan']._key,
      subMenu: [
        {
          name: 'Pembaruan Aplikasi',
          link: '/application-update',
          key: this.permissionData['Pengaturan']['Pembaharuan Aplikasi']._key,
        },
        {
          name: 'Via Collect',
          link: '/via-collect',
          key: this.permissionData['Pengaturan']['Via Collect']._key,
        },
        {
          name: 'Metode Pembayaran',
          link: '/payment-method',
          key: this.permissionData['Pengaturan']['Metode Pembayaran']._key,
        },
        {
          name: 'Pembayaran Akun',
          link: '/payment-account',
          key: this.permissionData['Pengaturan']['Pembayaran Akun']._key,
        },
        {
          name: 'Poin',
          link: '/poin-config',
          key: this.permissionData['Pengaturan']['Poin']._key,
        },
        {
          name: 'Push Notifikasi',
          link: '/push-notification',
          key: this.permissionData['Broadcast']['Push Notification']._key
        }
      ],
    },
  ];

  constructor(
    private authService: AuthService,
    private permissionsService: PermissionsService
  ) {
    const currentPath = window.location.pathname;

    this.leftSidebarMenuList.forEach((lvl1) => {
      if (lvl1.subMenu) {
        lvl1.subMenu.forEach((lvl2) => {
          if (currentPath.includes(lvl1.link + lvl2.link)) {
            lvl1.subMenuActive = true;

            if (lvl2.subMenu) {
              lvl2.subMenu.forEach((lvl3) => {
                if (currentPath.includes(lvl1.link + lvl2.link + lvl3.link)) {
                  lvl2.subMenuActive = true;

                  if (lvl3.subMenu) {
                    lvl3.subMenu.forEach((lvl4) => {
                      if (
                        currentPath.includes(
                          lvl1.link + lvl2.link + lvl3.link + lvl4.link
                        )
                      ) {
                        lvl3.subMenuActive = true;
                      }
                    });
                  }
                }
              });
            }
          }
        });
      }
    });
  }

  isSubMenuActive(menu: LeftSidebarMenu) {
    return !!menu.subMenuActive;
  }

  checkRoles(menu: LeftSidebarMenu) {
    if (menu.key) {
      return this.permissionsService.hasPermission(menu.key);
    } else {
      return true;
    }
  }
}
