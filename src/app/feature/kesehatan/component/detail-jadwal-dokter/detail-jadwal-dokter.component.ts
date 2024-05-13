import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { DoctorScheduleService } from '../../services/doctor-schedule/doctor-schedule.service';
import Swal from 'sweetalert2';

interface Schedule {
  id?: number;
  start_time: string;
  end_time: string;
}

interface ScheduleForm {
  doctor_uuid: string;
  day: number;
  start_time: string;
  end_time: string;
}

@Component({
  selector: 'app-detail-jadwal-dokter',
  templateUrl: './detail-jadwal-dokter.component.html',
  styleUrls: ['./detail-jadwal-dokter.component.scss']
})

export class DetailJadwalDokterComponent implements OnInit {
  /* schedule configuration */
  scheduleDays = [
    {
      en: 'Sunday',
      id: 'Minggu'
    },
    {
      en: 'Monday',
      id: 'Senin'
    },
    {
      en: 'Tuesday',
      id: 'Selasa'
    },
    {
      en: 'Wednesday',
      id: 'Rabu'
    },
    {
      en: 'Thursday',
      id: 'Kamis'
    },
    {
      en: 'Friday',
      id: 'Jumat'
    },
    {
      en: 'Saturday',
      id: 'Sabtu'
    }
  ];
  selectedDay: any = {};
  selectedSchedules: Schedule[] = [];
  deletedSchedules: Schedule[] = [];

  /* Input Output configuration */
  @Input() dataForm: any = {};
  @Output() afterSave = new EventEmitter<boolean>();

  constructor(
    private doctorScheduleService: DoctorScheduleService,
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    console.log(this.dataForm)
  }

  /* Get schedule by day functions */
  onDaySelected(day: any): void {
    this.selectedDay = day;
    if (this.dataForm.origin_data[day.en.toLowerCase()].length > 0) {
      this.selectedSchedules = this.dataForm.origin_data[day.en.toLowerCase()]
    } else {
      this.selectedSchedules = [this.createEmptyData()]
    }
  }

  /* Create empty data */
  createEmptyData(): ScheduleForm {
    console.log('selected:', this.selectedDay)
    const data: ScheduleForm = {
      doctor_uuid: this.dataForm.uuid,
      day: this.convertDay(this.selectedDay.en),
      start_time: '',
      end_time: ''
    };

    return data;
  }

  /* Create & delete time functions */
  addScheduleRow(): void {
    const data = this.createEmptyData();
    this.selectedSchedules.push(data);
  }

  removeScheduleRow(index: number): void {
    this.deletedSchedules.push(this.selectedSchedules[index]);
    this.selectedSchedules.splice(index, 1);
  }

  /* Save & Cancel functions */
  save(): void {
    const promises: Promise<any>[] = [];

    /* delete data */
    this.deletedSchedules.forEach((data: Schedule) => {
      if (data.id) {
        // delete data
        promises.push(this.doctorScheduleService.deleteDoctorSchedule(data.id))
      }
    })

    this.selectedSchedules.forEach((data: Schedule) => {
      if (data.id) {
        // update data
        promises.push(this.doctorScheduleService.updateDoctorSchedule(data.id, data))
      } else {
        // create data
        promises.push(this.doctorScheduleService.createDoctorSchedule(data))
      }
    })

    Promise.all(promises).then(() => {
      Swal.fire({
        title: 'Berhasil',
        text: 'Data berhasil disimpan',
        icon: 'success',
      })
      this.afterSave.emit();
    }).catch((e) => {
      Swal.fire({
        title: 'Error',
        text: 'Terjadi kesalahan',
        icon: 'error',
      })
    })
  }

  close(): void {
    this.afterSave.emit();
  }

  /* utils */
  convertDay(day: string): number {
    switch (day) {
      case 'Sunday':
        return 0;
      case 'Monday':
        return 1;
      case 'Tuesday':
        return 2;
      case 'Wednesday':
        return 3;
      case 'Thursday':
        return 4;
      case 'Friday':
        return 5;
      case 'Saturday':
        return 6;
      default:
        return 0;
    }
  }
}