import { Component, OnInit, ViewChild } from '@angular/core';

// import * as pluginLabels from 'chartjs-plugin-labels';
// import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
// import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
// import { Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip, SingleDataSet } from 'ng2-charts';
import { DataTableDirective } from 'angular-datatables';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../auth/services/auth.service';
import { StatsCardModel } from '../../component/stats-card/stats-card.component';

import { DashboardService } from './service/dashboard.service';
import { PendapatanTransaksiRequest } from 'src/app/component/chart-pendapatan/chart-pendapatan.component';
import { TrendTransaksiRequest } from 'src/app/component/chart-trend/chart-trend.component';
import { PermissionsService } from 'src/app/core/services/permissions.service';
import { PieChartCardModel } from 'src/app/component/pie-chart-card/pie-chart-card.component';

export interface Doctor {
  id: number;
  name: string;
  imageUrl : string;
  specialist: string;
  status: 'Available' | 'Unavailable';
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})


export class DashboardComponent implements OnInit {
  statsCard: StatsCardModel[] = [
    {
      title: 'Registered Users',
      stats: 0,
      icon: 'user',
      description: 'Total user dihitung berdasarkan jumlah nomor handphone yang telah terverifikasi',
      role: "web:dashboard:registereduser:read"
    },
    {
      title: 'Verified Emails',
      stats: 0,
      icon: 'email',
      description: 'Total email terverifikasi dihitung berdasarkan jumlah email dan nomor handphone yang telah terverifikasi',
      role: "web:dashboard:verifiedemail:read"
    },
    {
      title: 'Verified NIK',
      stats: 0,
      icon: 'nik',
      description: 'Total NIK terverifikasi dihitung berdasarkan jumlah NIK dan nomor handphone yang telah terverifikasi',
      role: "web:dashboard:verifiednik:read"
    }
  ];
  statsService: StatsCardModel[] = [
    {
      title: 'Total Pendapatan',
      stats: 0,
      icon: 'pendapatan',
      description: 'Total pendapatan yang diperoleh dari seluruh transaksi yang terjadi',
      role: "web:dashboard:totalpendapatan:read"
    },
    {
      title: 'Total Transaksi',
      stats: 0,
      icon: 'transaksi',
      description: 'Total transaksi yang terjadi pada seluruh layanan yang tersedia',
      role: "web:dashboard:totaltransaksi:read"
    },
  ];
  statsPatient: StatsCardModel[] = [
    {
      title: 'Jumlah Pasien',
      stats: 0,
      icon: 'gender',
      description: 'Total jumlah pasien yang telah terdaftar pada aplikasi',
      role: "web:dashboard:pasien:read"
    },
  ];
  statsGender: StatsCardModel[] = [
    {
      title: 'Laki - Laki',
      stats: 0,
      icon: 'male',
      description: 'Total laki - laki yang telah terdaftar pada aplikasi',
      role: "web:dashboard:pasien:read"
    },
    {
      title: 'Perempuan',
      stats: 0,
      icon: 'female',
      description: 'Total perempuan yang telah terdaftar pada aplikasi',
      role: "web:dashboard:pasien:read"
    },
  ];
  statsTotalKonsultasi: StatsCardModel[] = [
    {
      title: 'Jumlah Konsultasi',
      stats: 0,
      icon: 'transaksi',
      description: 'Total konsultasi yang telah terjadi pada aplikasi',
      role: "web:dashboard:konsultasi:read"
    },
  ];
  requestPendapatan: PendapatanTransaksiRequest = {
    startDate: '',
    endDate: '',
    mode: 'monthly',
  };

  requestTrend: TrendTransaksiRequest = {
    startDate: '',
    endDate: '',
    mode: 'monthly',
  };
  
  public TransactionByTypeLabels: any = [];
  public TransactionByTypeData: any = [];

  public TransactionKTPLabels: any = [];
  public TransactionKTPData: any = [];

  public DigitizedCardsLabels: any = [];
  public DigitizedCardsData: any = [];

  // barChartOptions: ChartOptions = {
  //   responsive: true,
  //   scales: {
  //     xAxes: [{
  //       ticks: { fontColor: 'black', fontSize: 13, stepSize: 200 },
  //     }],
  //     yAxes: [{
  //       ticks: { fontColor: 'black', fontSize: 13 },
  //       gridLines: { display: false, },
  //     }],
  //   },
  //   layout: {
  //     padding: {
  //       top: 0,
  //       bottom: 30
  //     }
  //   },
  //   legend: {
  //     display: false,
  //   },

  // };
  // barChartLabels: Label[] = [
  //   'Gas',
  //   'HP Pascabayar',
  //   'ISAT',
  //   'PBB',
  //   'PDAM Jawa Barat',
  //   'PDAM Jawa Timur',
  //   'PLN', 'PLNPASCA',
  //   'Telkom',
  //   'Telkomsel'
  // ];
  // barChartType: ChartType = 'horizontalBar';
  barChartLegend = true;
  barChartPlugins = [];
  // barChartData: ChartDataSets[] = [
  //   { data: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1], label: 'Jumlah Transaksi', barThickness: 20, radius: 5, maxBarThickness: 20 }
  // ];
  barChartColors: Array<any> = [
    {
      backgroundColor: '#A6B3D7',
    }
  ];

  @ViewChild(DataTableDirective)
  dtElement!: DataTableDirective;
  dtInstance!: Promise<DataTables.Api>;
  dtOptions: any;

  docId: any;
  docType: any;
  docTypeName: any;
  listDocType: any;
  filterParam: any;
  filter: any;
  listConsultDoctor: any;
  listConsultSpesialist: any;
  limit: any;
  inputLimit: any;
  totalRecord: any;
  titleModal!: string;
  dataForm: any = {};

  user: any;
  currentTab = 'User';
  listDoctors: Doctor[] = [
    {
      id: 1,
      name: 'Dr. John Doe',
      imageUrl: 'assets/images/users/avatar-1.jpg',
      specialist: 'Cardiologist',
      status: 'Available'
    },
    {
      id: 2,
      name: 'Dr. Jane Smith',
      imageUrl: 'assets/images/users/avatar-1.jpg',
      specialist: 'Dermatologist',
      status: 'Unavailable'
    },
    {
      id: 3,
      name: 'Dr. David Lee',
      imageUrl: 'assets/images/users/avatar-1.jpg',
      specialist: 'Pediatrician',
      status: 'Available'
    },
    {
      id: 4,
      name: 'Dr. Maria Garcia',
      imageUrl: 'assets/images/users/avatar-1.jpg',
      specialist: 'Gynecologist',
      status: 'Unavailable'
    },
    {
      id: 5,
      name: 'Dr. Michael Brown',
      imageUrl: 'assets/images/users/avatar-1.jpg',
      specialist: 'Neurologist',
      status: 'Available'
    },
    {
      id: 6,
      name: 'Dr. Sarah Wilson',
      imageUrl: 'assets/images/users/avatar-1.jpg',
      specialist: 'Ophthalmologist',
      status: 'Available'
    }
  ];

  /* role configuration */
  activeRole!: string;

  constructor(
    private authService: AuthService,
    private dashboardService: DashboardService,
    private route: ActivatedRoute,
    private permissionsService: PermissionsService,
    private router: Router,
  ) {
    // monkeyPatchChartJsTooltip();
    // monkeyPatchChartJsLegend();
    this.authService.getProfile().subscribe((user: any) => {
      this.user = user;
    });
  }

  ngOnInit(): void {
    /* check role permission */
    this.activeRole = this.authService.getActiveRole();
    if (!this.checkRoles('web:dashboard:read')) {
      const loc = this.permissionsService.getDefaultLocation(this.activeRole);
      this.router.navigate([loc]);
    }

    this.filterParam = [
      { param: 'noDokumen', title: 'No. Dokumen' },
      { param: 'nama', title: 'Nama' },
      { param: 'tipeDokumen', title: 'Tipe Dok.' },
      { param: 'tglDiterima', title: 'Tgl. Diterima' },
    ];
    this.limit = 5;
    this.reset();
    this.getConsultationDoctor();
    this.getDashboard();
  }

  getDashboard() {
    this.dashboardService.getDocumentDashboard().subscribe( async (data: any) => {
      this.statsCard[0].stats = data.data.RegisteredUsers;
      this.statsCard[1].stats = data.data.VerifiedEmails;
      this.statsCard[2].stats = data.data.VerifiedNIK;

      if(data.data.PaymentPPOB) {
        this.TransactionByTypeData.push(data.data.PaymentPPOB)
        this.TransactionByTypeLabels.push(['Payment PPOB'])
      }
      if(data.data.VoucherPurchase) {
        this.TransactionByTypeData.push(data.data.VoucherPurchase)
        this.TransactionByTypeLabels.push(['Voucher Purchase'])
      }
      if(data.data.TransferBank){
        this.TransactionByTypeData.push(data.data.TransferBank)
        this.TransactionByTypeLabels.push(['Transfer Out to Bank Account'])
      }

      if(data.data.KTPAccepted){
        this.TransactionKTPData.push(data.data.KTPAccepted)
        this.DigitizedCardsData.push(data.data.KTPAccepted)
        this.TransactionKTPLabels.push(['Accepted'])
        this.DigitizedCardsLabels.push(['KTP'])
      }

      if(data.data.KTPRejected){
        this.TransactionKTPData.push(data.data.KTPRejected)
        this.TransactionKTPLabels.push(['Rejected'])
      }

      if(data.data.SIMAccepted){
        this.DigitizedCardsData.push(data.data.SIMAccepted)
        this.DigitizedCardsLabels.push(['SIM'])
      }

      if(data.data.PassportAccepted){
        this.DigitizedCardsData.push(data.data.PassportAccepted)
        this.DigitizedCardsLabels.push(['Pasport'])
      }

      // this.pieChartData3 = [data.data.KTPAccepted, data.data.SIMAccepted, data.data.PassportAccepted];

      // this.barChartData[0].data = data.data.TopProducts.map((product) => product.TransactionCount);
      // this.barChartLabels = data.data.TopProducts.map((product) => product.TrxProductName);
    })
  }

  getConsultationDoctor() {
    //remove if testing was done
    const dummyData = {
      status_code: 200,
      message: 'Success',
      data: {
        list: [
          {
            namePatient: 'Pasien 1',
            emailPatient: 'patient1@mail.com',
            nameDoctor: 'Dokter 1',
            emailDoctor: 'dokter1@mail.com',
            totalConsultation: 10,
            id: 1,
          },
          {
            namePatient: 'Pasien 2',
            emailPatient: 'patient2@mail.com',
            nameDoctor: 'Dokter 2',
            emailDoctor: 'dokter2@mail.com',
            totalConsultation: 5,
            id: 2,
          },
          {
            namePatient: 'Pasien 3',
            emailPatient: 'patient3@mail.com',
            nameDoctor: 'Dokter 3',
            emailDoctor: 'doctor3@mail.com',
            totalConsultation: 2,
            id: 3,
          },
          {
            namePatient: 'Pasien 4',
            emailPatient: 'patient4@mail.com',
            nameDoctor: 'Dokter 4',
            emailDoctor: 'doctor4@mail.com',
            totalConsultation: 1,
            id: 4,
          },
          {
            namePatient: 'Pasien 5',
            emailPatient: 'patient5@mail.com',
            nameDoctor: 'Dokter 5',
            emailDoctor: 'doctor5@mail.com',
            totalConsultation: 12,
            id: 5,
          },
          {
            namePatient: 'Pasien 6',
            emailPatient: 'patient6@mail.com',
            nameDoctor: 'Dokter 6',
            emailDoctor: 'doctor6@mail.com',
            totalConsultation: 18,
            id: 6,
          },
        ],
        total_items: 6,
      },
    }

    this.dtOptions = {
      serverSide: true,
      processing: true,
      ordering: false,
      pageLength: this.limit,
      language: {
        paginate: {
          previous: '<i class="fa fa-chevron-left"></i>',
          next: '<i class="fa fa-chevron-right"></i>',
        },
        aria: {
          paginate: {
            previous: 'Previous',
            next: 'Next',
          },
        },
        info: '',
      },
      ajax: (dtParams: any, callback :any) => {
        const params : any = {
          limit: this.limit,
          offset: dtParams.start,
          DocCardType: this.docId,
        };
        params[this.filter.param] = this.filter.value;
        // this.dokumenService.getDocument(this.role, params).subscribe((res: any) => {
        //     this.listConsultDoctor = res.data.list;
        //     this.totalRecord = res.data.total_items;
        //     callback({
        //       recordsTotal: this.totalRecord,
        //       recordsFiltered: this.totalRecord,
        //       data: [],
        //     });
        //   });
        this.listConsultDoctor = dummyData.data.list;
        this.totalRecord = dummyData.data.total_items;
        callback({
          recordsTotal: this.totalRecord,
          recordsFiltered: this.totalRecord,
          data: [],
        });
      },
    };
  }

  getSpecialistDoctor() {
    //remove if testing was done
    const dummyData = {
      status_code: 200,
      message: 'Success',
      data: {
        list: [
          {
            namePatient: 'Pasien 1',
            emailPatient: 'patient1@mail.com',
            nameDoctor: 'Dokter 1',
            emailDoctor: 'dokter1@mail.com',
            totalConsultation: 10,
            id: 1,
          },
          {
            namePatient: 'Pasien 2',
            emailPatient: 'patient2@mail.com',
            nameDoctor: 'Dokter 2',
            emailDoctor: 'dokter2@mail.com',
            totalConsultation: 5,
            id: 2,
          },
          {
            namePatient: 'Pasien 3',
            emailPatient: 'patient3@mail.com',
            nameDoctor: 'Dokter 3',
            emailDoctor: 'doctor3@mail.com',
            totalConsultation: 2,
            id: 3,
          },
          {
            namePatient: 'Pasien 4',
            emailPatient: 'patient4@mail.com',
            nameDoctor: 'Dokter 4',
            emailDoctor: 'doctor4@mail.com',
            totalConsultation: 1,
            id: 4,
          },
          {
            namePatient: 'Pasien 5',
            emailPatient: 'patient5@mail.com',
            nameDoctor: 'Dokter 5',
            emailDoctor: 'doctor5@mail.com',
            totalConsultation: 12,
            id: 5,
          },
          {
            namePatient: 'Pasien 6',
            emailPatient: 'patient6@mail.com',
            nameDoctor: 'Dokter 6',
            emailDoctor: 'doctor6@mail.com',
            totalConsultation: 18,
            id: 6,
          },
        ],
        total_items: 6,
      },
    }

    this.dtOptions = {
      serverSide: true,
      processing: true,
      ordering: false,
      pageLength: this.limit,
      language: {
        paginate: {
          previous: '<i class="fa fa-chevron-left"></i>',
          next: '<i class="fa fa-chevron-right"></i>',
        },
        aria: {
          paginate: {
            previous: 'Previous',
            next: 'Next',
          },
        },
        info: '',
      },
      ajax: (dtParams: any, callback :any) => {
        const params : any = {
          limit: this.limit,
          offset: dtParams.start,
          DocCardType: this.docId,
        };
        params[this.filter.param] = this.filter.value;
        // this.dokumenService.getDocument(this.role, params).subscribe((res: any) => {
        //     this.listConsultDoctor = res.data.list;
        //     this.totalRecord = res.data.total_items;
        //     callback({
        //       recordsTotal: this.totalRecord,
        //       recordsFiltered: this.totalRecord,
        //       data: [],
        //     });
        //   });
        this.listConsultDoctor = dummyData.data.list;
        this.totalRecord = dummyData.data.total_items;
        callback({
          recordsTotal: this.totalRecord,
          recordsFiltered: this.totalRecord,
          data: [],
        });
      },
    };
  }

  openTab(tabName: any) {
    this.currentTab = tabName;
  }

  reset(): void {
    this.filter = {
      param: 'noDokumen',
      value: '',
    };
    this.listConsultDoctor = [];
    this.listConsultSpesialist = [];
    this.listDocType = [
      { type: 'ktp', id: 2, name: 'KTP' },
      { type: 'passport', id: 6, name: 'Passport' },
    ];
    const docType = this.route.snapshot.paramMap.get('docType');
    this.listDocType.forEach((element : any) => {
      if (element.type == docType) {
        this.docId = element.id;
        this.docType = element.type;
        this.docTypeName = element.name;
      }
    });
  }

  reloadDataTable(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }

  changeLimit(val : any) {
    if (val == 10 || val == 25 || val == 50 || val == 100) {
      this.limit = val;
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.page.len(val).draw();
      });
    }
  }

  clickLimit() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.page.len(this.limit).draw();
    });
  }

  checkRoles(key: string): boolean { 
    if (key) {
      return this.permissionsService.hasPermission(key);
    } else {
      return true;
    }
  }

  pieChartCardsNew(): PieChartCardModel[] { 
    return [
        {
          title: '',
          description: '',
          legendposition: 'right',
          data: {
            labels: this.TransactionByTypeLabels,
            datasets: [
              {
                data: this.TransactionByTypeData,
                backgroundColor: ['#21409A', '#A6B3D7', '#00A79D'],
              },
            ],
          },
        },
        {
          title: 'Usia Pengguna',
          description: 'Demografi berdasarkan user yang telah terverifikasi',
          legendposition: 'right',
          data: {
            labels: this.TransactionKTPLabels,
            datasets: [
              {
                data: this.TransactionKTPData,
                backgroundColor: ['#21409A', '#A6B3D7'],
              },
            ],
          },
        },
        {
          title: 'Usia Pengguna',
          description: 'Demografi berdasarkan user yang telah terverifikasi',
          legendposition: 'right',
          data: {
            labels: this.DigitizedCardsLabels,
            datasets: [
              {
                data: this.DigitizedCardsData,
                backgroundColor: ['#21409A', '#A6B3D7', '#00A79D'],
              },
            ],
          },
        },
      ];
  }
}

