import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';

export interface TrendTransaksiRequest {
  startDate: string;
  endDate: string;
  type?: string;
  mode?: string;
}

@Component({
  selector: 'app-chart-trend',
  templateUrl: './chart-trend.component.html',
  styleUrls: ['./chart-trend.component.scss']
})

export class ChartTrendComponent implements OnChanges {
  @Input() request: TrendTransaksiRequest = {
    startDate: '',
    endDate: '',
    type: 'total',
    mode: 'monthly',
  };
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  public lineChartData: Array<any> = [
    { data: [10, 10, 18, 20, 23, 27, 30, 21, 25, 8, 21, 50], label: 'Transaction Trend' }
  ];

  public lineChartLabels: Array<any> = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  public lineChartOptions: any = {
    responsive: true,
    elements: {
      line: {
        tension: 0 // Set tension to 0 for straight lines
      }
    }
  };

  public lineChartColors: Array<any> = [
    { // grey
      backgroundColor: 'rgba(0,0,0,0)',
      borderColor: '#21409A',
      pointBackgroundColor: '#21409A',
      // pointBorderColor: '#fff',
      // pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#21409A'
    }
  ];

  public lineChartLegend = true;
  public lineChartType = 'line';

  constructor(
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
  }



}
