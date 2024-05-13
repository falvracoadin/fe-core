import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { BsDatepickerDirective } from 'ngx-bootstrap/datepicker';

export interface PieChartCardModel {
  title: string;
  description: string;
  legendposition:
  | 'left'
  | 'top'
  | 'right'
  | 'bottom'
  | 'center'
  | 'chartArea'
  | { [scaleId: string]: number };
  data: ChartData<'pie', number[], string | string[]>;
}

@Component({
  selector: 'app-pie-chart-card',
  templateUrl: './pie-chart-card.component.html',
  styleUrls: ['./pie-chart-card.component.css'],
})
export class PieChartCardComponent implements OnInit, OnChanges {
  @ViewChild('piedp') datepicker?: BsDatepickerDirective;
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  @Input() pieChartCard: PieChartCardModel = {
    title: '',
    description: '',
    legendposition: 'top',
    data: {
      labels: [],
      datasets: [],
    },
  };
  @Input() withCustom: number = 0;
  @Input() types: boolean = false;
  @Input() sizeChartWidth: number = 140;
  @Input() sizeChartHeight: number = 140;
  @Input() selectedDateInput: string = '';
  @Input() typeChartInput: string = '';
  localPieChartCard: PieChartCardModel = {
    title: '',
    description: '',
    legendposition: 'top',
    data: {
      labels: [],
      datasets: [],
    },
  };
  emptyData: PieChartCardModel = {
    title: '0',
    description: '',
    legendposition: 'bottom',
    data: {
      datasets: [
        {
          data: [1],
          backgroundColor: ["#bbb"]
        }
      ],
      labels: ['']
    }
  }

  ngOnInit(): void {
    this.pieChartOptions = {

      responsive: false,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false, //back to true if need show legend
          position: this.pieChartCard.legendposition,
          labels: {
            usePointStyle: true,
          },
        },
        datalabels: {
          color: '#fff',
          font: {
            size: 14,
            weight: 700,
          },
          formatter: (value: any, ctx: any) => {
            const sum = ctx.chart.data.datasets[0].data.reduce(
              (a: any, b: any) => a + b,
              0
            );

            const percentage = sum == 0 ? 0 : ((value * 100) / sum).toFixed(0);
            return percentage + '%';
          },
        },
      },
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.createCustomLegend(this.pieChartCard.data);
  }

  public pieChartOptions: ChartConfiguration['options'] = {};
  public sumData = 0;
  public emptyPieChartOptions: ChartConfiguration['options'] = {
    responsive: false,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, //back to true if need show legend
        position: this.pieChartCard.legendposition,
        labels: {
          usePointStyle: true,
        },
      },
      datalabels: {
        color: '#fff',
        font: {
          size: 14,
          weight: 700,
        },
        formatter: (value: any, ctx: any) => {
          return null;
        },
      },
      tooltip: {
        enabled: false,
      }
    },
  };

  public pieChartTypeLine: ChartType = 'line';
  public pieChartTypePie: ChartType = 'pie';
  public pieChartPlugins = [DatalabelsPlugin];

  constructor(
    private sanitizer: DomSanitizer,
  ) { }

  public legendCustomHTML: SafeHtml = '';
  createCustomLegend(datasets: any) {
    let legendHtml = '';
      legendHtml += `
      <div class="d-flex flex-wrap gap-2 mt-2 mx-auto" style="width : 100%">
      `;
      this.sumData = datasets.datasets[0].data.reduce((a: number, b: number) => { return a + b }, 0)
      for (let i = 0; i < datasets.datasets[0].data.length; i++) {
        var databg = datasets.datasets[0].backgroundColor[i];
        var datalabel = datasets.labels[i];

        legendHtml += `   
          <div class="d-flex">
            <div class="legend-color rounded-circle me-2" style="background-color: ${databg}; height: 10px; width: 10px; margin-top: 5px !important;"></div>
            <span style="font-size:14px; color:#737373; min-width: 70px;">${datalabel}</span>
          </div>
        `;
      }
      legendHtml += `</div>`;
    this.legendCustomHTML = this.sanitizer.bypassSecurityTrustHtml(legendHtml);
  }
}
