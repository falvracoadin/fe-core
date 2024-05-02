import { Component, Input, OnInit, Output, EventEmitter, SimpleChange } from '@angular/core';
// import { DaterangepickerConfig } from 'ng2-daterangepicker';
import * as moment from 'moment';


interface DateRangeModel {
  placeholder: string;
  startDate: any; 
  endDate: any;   
  showRange: boolean;
  daterange: string;
}

@Component({
  selector: 'app-daterangepicker',
  templateUrl: './daterangepicker.component.html',
  styleUrls: ['./daterangepicker.component.scss']
})

export class DaterangepickerComponent implements OnInit {
  readonly FORMAT = 'DD/MM/YYYY';
  readonly FORMAT_MODEL = 'YYYY-MM-DD';

  @Input() placeholder!: string;
  @Input() startDate: any;
  @Input() endDate: any;
  @Input() showRanges: any;

  model: DateRangeModel = {
    placeholder: '',
    startDate: null,
    endDate: null,
    showRange: false,
    daterange: ''
  };

  @Output() onChange = new EventEmitter<any>();

  // constructor(private dateRangePickerOptions: DaterangepickerConfig) {
  //   this.dateRangePickerOptions.settings = {
  //     locale: {
  //       format: this.FORMAT
  //     },
  //     alwaysShowCalendars: true,
  //   }
  // }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChange) {
    this.model = {
      placeholder: '',
      startDate: moment().format(this.FORMAT),
      endDate: moment().format(this.FORMAT),
      showRange: false,
      daterange: ''
    }

    if (this.startDate) {
      this.model.startDate = this.startDate;
    } else {
      this.model.startDate = null;
    }

    if (this.endDate) {
      this.model.endDate = this.endDate;
    } else {
      this.model.endDate = null;
    }

    if (this.placeholder) {
      this.model.placeholder = this.placeholder;
    }

    if (this.showRanges) {
      this.appendRangeConfiguration();
    }

    this.setDefaultValue();
  }

  setDefaultValue() {
    if (!this.model.startDate && !this.model.endDate) {
      this.model.daterange = '';
      return false;
    }

    const { startDate, endDate } = this.model;
    this.model.daterange = moment(startDate).format(this.FORMAT) + ' - ' + moment(endDate).format(this.FORMAT);
    return
  }

  selectedDate($event : any) {
    this.onChange.emit({
      startDate: moment($event.start).format(this.FORMAT_MODEL),
      endDate: moment($event.end).format(this.FORMAT_MODEL)
    });
  }

  appendRangeConfiguration() {
    // this.dateRangePickerOptions.settings.ranges = {
    //   'Today': [moment(), moment()],
    //   'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    //   'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    //   'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    //   'This Month': [moment().startOf('month'), moment().endOf('month')],
    //   'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
    // };
  }

}
