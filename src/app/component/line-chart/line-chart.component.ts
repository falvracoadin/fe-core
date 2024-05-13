import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
// import { VenturoService } from 'src/app/core/service/venturo.service';
import { BsDatepickerDirective } from 'ngx-bootstrap/datepicker';

export interface DonaturTransaksiRequest {
  startDate: string;
  endDate: string;
  type?: string;
  mode?: string;
}

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent  {
  @Input() request: DonaturTransaksiRequest = {
    startDate: '',
    endDate: '',
    type: 'total',
    mode: 'weakly',
  };
  @Input() selectedDateInput: string = '';
  @ViewChild('linedon') datepicker?: BsDatepickerDirective;
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  tabActive: number = 0;
  setsColor = [
    '#21409a'
  ];

  lineChartOptions: ChartConfiguration['options'] = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          usePointStyle: true,
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: function (value, index, ticks) {
            return (+value / 1e6).toFixed(0).toString() + 'jt';
          },
        },
      },
    },
  };

  listSelectDate: any;
  selectedType: string = '';

  selectedDate: string = '';
  listMonth: string[] = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];

  lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember',
    ],
    datasets: [
      {
        data: [
          11500000, 12200000, 20000000, 22000000, 34000000, 38000000, 45000000,
          43000000, 50000000, 52000000, 54000000, 100000000,
        ],
        label: 'Transaction',
        fill: false,
        tension: 0,
        borderColor: '#21409a',
        backgroundColor: '#21409a',
        pointBackgroundColor: '#21409a',
        pointRadius: 5,
      },
    ],
  };

  barChartOptions: ChartConfiguration['options'] = {
    indexAxis: 'y',
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        formatter: (value: number, ctx: any) => {
          return 'Rp ' + value.toLocaleString('id');
        },
      },
      tooltip: {
        callbacks: {
          label: (item): string => {
            return 'Rp ' + item.parsed.x.toLocaleString('id');
          },
          title: (item): string => {
            return 'Total ' + item[0].label;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          callback: function (value, index, ticks) {
            return value.toLocaleString('id');
          },
          stepSize: 5 * 1e6,
        },
      },
    },
  };

  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [
      'any',
    ],
    datasets: [
      {
        data: [88900200, 82300200, 65400300, 40012202, 20000000],
        backgroundColor: [
          '#21409a'
        ],
        indexAxis: 'y',
        maxBarThickness: 20,
        barThickness: 20,
        minBarLength: 10,
        barPercentage: 0.5,
      },
    ],
  };

  constructor(
  ) { }

  setBarChartOption(step: number) {
    this.barChartOptions = {
      indexAxis: 'y',
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        datalabels: {
          formatter: (value: number, ctx: any) => {
            return 'Rp ' + value.toLocaleString('id');
          },
        },
        tooltip: {
          callbacks: {
            label: (item): string => {
              return 'Rp ' + item.parsed.x.toLocaleString('id');
            },
            title: (item): string => {
              return 'Total ' + item[0].label;
            },
          },
        },
      },
      scales: {
        x: {
          ticks: {
            callback: function (value, index, ticks) {
              return value.toLocaleString('id');
            },
            stepSize: +Math.round(step / 1e6) * 1e6,
          },
        },
      },
    };
  }

  setLineChartOption() {
    this.lineChartOptions = {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            usePointStyle: true,
          },
        },
      },
      scales: {
        y: {
          ticks: {
            callback: function (value, index, ticks) {
              return (+value).toLocaleString('id');
            },
          },
        },
      },
    };
  }
}
