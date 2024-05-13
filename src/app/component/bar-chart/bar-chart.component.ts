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

export interface BarChartDataCustom {
  data: number[];
  title: string;
  labels: string[];
}

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
})
export class BarChartComponent implements OnChanges {
  @Input() id : string = "";
  @Input() data: BarChartDataCustom = {
    data: [1000, 200, 300, 400, 100, 200, 300, 400, 100, 200, 300, 400],
    title: '',
    labels: ['0','1','2','3','4','5','6','7','8','9']
  };
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  barChartOptions: ChartConfiguration['options'] = {
    indexAxis: 'y',
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        formatter: (value: number, ctx: any) => {
          return value.toLocaleString('id');
        },
      },
      tooltip: {
        callbacks: {
          label: (item): string => {
            return item.parsed.x.toLocaleString('id');
          },
          title: (item): string => {
            console.log(item)
            return 'Total ' + item[0].label;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: false,
        },
      },
    },
  };

  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: this.data.labels,
    datasets: [
      {
        data: [1000, 200, 300, 400, 100, 200, 300, 400, 100, 200, 300, 400],
        backgroundColor: ['#53B665'],
        indexAxis: 'y',
        maxBarThickness: 20,
        barThickness: 20,
        minBarLength: 10,
        barPercentage: 0.5,
      },
    ],
  };

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    let tempColor: string[] = [];
    this.data.data.forEach((element, index) => {
      if (element > 0) {
        tempColor.push('#a6b3d7');
      } else {
        tempColor.push('#FFFFFF');
      }
    });
    this.barChartData.labels = this.data.labels ?? []
    this.barChartData.datasets[0].data = this.data.data ?? [];
    this.barChartData.datasets[0].backgroundColor = tempColor;
    this.chart?.update();
    this.changeDetectorRef.detectChanges();
  }
}
