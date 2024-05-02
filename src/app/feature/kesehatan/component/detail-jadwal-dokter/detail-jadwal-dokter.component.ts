import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'app-detail-jadwal-dokter',
  templateUrl: './detail-jadwal-dokter.component.html',
  styleUrls: ['./detail-jadwal-dokter.component.scss']
})

export class DetailJadwalDokterComponent implements OnInit {
  scheduleDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  indonesianDays = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  selectedDay!: string;
  selectedSchedules: string[] = []; // Variable to store the schedules for the selected day
  @Input() dataform: any;
  @Output() afterSave = new EventEmitter<boolean>();

  mode!: string;
  formModel!: {
    id: number | null;
    text: string | null;
    day: string | null;
    schedule_start: string | null;
    schedule_end: string | null;
  };

  constructor() { }

  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.selectedDay = 'Minggu'; // Set default day to Minggu (Sunday) after a slight delay
      // You can fetch schedules for the default selected day here
      // For now, let's initialize it with an empty array
      this.selectedSchedules = [];
    });
  }

  addScheduleRow(): void {
    this.selectedSchedules.push('');
  }

  removeScheduleRow(index: number): void {
    this.selectedSchedules.splice(index, 1);
  }

  // Function to handle selection of day
  onDaySelected(day: string): void {
    this.selectedDay = day;
    console.log(day);
    // You can fetch schedules for the selected day from your data source and assign them to selectedSchedules array
    // For now, let's initialize it with an empty array
    this.selectedSchedules = [];
  }

}