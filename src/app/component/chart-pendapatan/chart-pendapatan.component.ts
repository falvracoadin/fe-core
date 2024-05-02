import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';

export interface PendapatanTransaksiRequest {
  startDate: string;
  endDate: string;
  type?: string;
  mode?: string;
}

@Component({
  selector: 'app-chart-pendapatan',
  templateUrl: './chart-pendapatan.component.html',
  styleUrls: ['./chart-pendapatan.component.scss']
})
export class ChartPendapatanComponent implements OnChanges {
  @Input() request: PendapatanTransaksiRequest = {
    startDate: '',
    endDate: '',
    type: 'total',
    mode: 'monthly',
  };
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  public lineChartData: Array<any> = [
    { data: [200000, 210000, 100000, 350000, 400000, 250000, 350000, 500000, 620000, 650000, 300000, 700000], label: 'Transaction Price' }
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
