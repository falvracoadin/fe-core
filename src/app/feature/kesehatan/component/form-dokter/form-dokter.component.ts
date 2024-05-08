import { Component, OnInit, TemplateRef } from '@angular/core';
import Stepper from 'bs-stepper';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { DoctorService } from '../../services/doctor/doctor.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, forkJoin } from 'rxjs';

/* interface declaration */
interface Specialist {
  id: number;
  name: string;
  slug: string;
  rate: number | null;
}

interface SpecialistRequest {
  slug: string;
  rate: number;
}

interface Education {
  id: number;
  education: string;
  graduation_year: string;
}

interface History {
  specialist: Specialist[];
  education: Education[];
}

interface Location {
  id: number;
  name: string;
}

interface SaveDoctorRequest {
  full_name: string;
  gender: string;
  phone_number: string;
  no_str: string;
  email: string;
  province_id: number | null;
  regency_id: number | null;
  sip_date: string;
  start_experience: string;
  str_date: string;
  is_new: string;
  tags: any[];
}

interface SaveDoctorResponse {
  code: number;
  success: boolean;
  messages: string;
  data: {
    full_name: string;
    gender: string;
    phone_number: string;
    no_str: string;
    email: string;
    province_id: number;
    regency_id: number;
    sip_date: string;
    start_experience: string;
    str_date: string;
    is_new: string;
    tags: any[];
    uuid: string;
  };
}

@Component({
  selector: 'app-form-dokter',
  templateUrl: './form-dokter.component.html',
  styleUrls: ['./form-dokter.component.scss']
})

export class FormDokterComponent implements OnInit {
  /* stepper configuration */
  private stepper: Stepper = {} as Stepper;
  currentStep: number = 1;
  stepWidths = [15, 40, 65, 100];

  /* form doctor configuration */
  doctorForm: any = {
    full_name: '',
    email: '',
    gender: 'L',
    is_new: 'true',
    no_str: '',
    phone_number: '',
    province_id: null,
    regency_id: null,
    sip_date: '',
    start_experience: '',
    str_date: '',
    tags: []
  };

  listProvince: Location[] = [];
  listRegion: Location[] = [];
  listSpecialist: any = [];
  listGender = [
    { id: 'L', name: 'Laki-laki' },
    { id: 'P', name: 'Perempuan' }
  ]

  /* history data configuration */
  historyData: History = {
    specialist: [],
    education: []
  };

  specialistForm: Specialist = {
    id: 0,
    slug: '',
    name: '',
    rate: null
  };
  selectedSpecialist: any = {};

  educationForm: Education = {
    id: 0,
    education: '',
    graduation_year: ''
  };

  /* upload image configuration */
  imageUrl: string | ArrayBuffer | null = 'assets/images/photo.png';
  imageFile: File = {} as File;

  /* validation configuration */
  isValid: boolean = false;

  doctorDataValidation: any = {
    full_name: false,
    email: false,
    gender: false,
    is_new: false,
    no_str: false,
    phone_number: false,
    province_id: false,
    regency_id: false,
    sip_date: false,
    start_experience: false,
    str_date: false
  }

  isValidHistory: boolean = false;

  isValidImage: boolean = false;

  /* modal configuration */
  modalRef: BsModalRef = {} as BsModalRef;

  constructor(
    private modalService: BsModalService,
    private router: Router,
    private doctorService: DoctorService,
  ) { }

  ngOnInit() {
    this.stepper = new Stepper(document.querySelector('#stepper1') as Element, {
      linear: true,
      animation: true
    })

    this.getProvince();
    this.getListSpecialist();
  }

  /* Stepper Functions */
  nextStep(step: number) {
    /* validate doctor data */
    if (step == 2) {
      if (this.validateDoctorData() == false) return;
    }

    /* validate history doctor */
    if (step == 3) {
      if (this.validateHistoryData() == false) return;
    }

    if (step == 4) {
      /* validate upload image doctor */
      if (this.validateImage() == false) return;

      /* show confirmation popup */
      Swal.fire({
        title: 'Apakah Anda Yakin?',
        text: 'Data yang sudah diubah tidak akan tersimpan!',
        showCancelButton: true
      }).then((res: any) => {
        if (res.isConfirmed) {
          this.onSubmit();
          return;
        }
      });
    }

    /* update step */
    if (step != 4) {
      this.updateNextStep(this.currentStep);
      this.currentStep = step;
      this.stepper.next();
    }
  }

  prevStep(step: number) {
    this.updatePrevStep(this.currentStep);
    this.currentStep = step;
    this.stepper.previous();
  }

  updateNextStep(step: number) {
    const steps = document.querySelectorAll('.step');
    steps.forEach((el, index) => {
      if (index === step - 1) {
        el.classList.add('prev-step');
      }
    });
  }

  updatePrevStep(step: number) {
    const steps = document.querySelectorAll('.step');
    steps.forEach((el, index) => {
      if (index === step - 2) {
        el.classList.remove('prev-step');
      }
    });
  }

  backToList() {
    Swal.fire({
      title: 'Apakah Anda Yakin?',
      text: "Data yang sudah diubah tidak akan tersimpan!",
      showCancelButton: true
    }).then((res: any) => {
      if (res.isConfirmed) {
        this.router.navigate(['/kesehatan/telemedicine/dokter']);
      }
    })
  }

  /* form functions */
  resetHistoryForm() {
    this.specialistForm = {
      id: 0,
      slug: '',
      name: '',
      rate: null
    }

    this.educationForm = {
      id: 0,
      education: '',
      graduation_year: ''
    }
  }

  getProvince() {
    this.doctorService.getProvince().subscribe({
      next: (res: any) => {
        this.listProvince = res.data;
      },
      error: (err: any) => {
        console.error(err);
      }
    })
  }

  getRegion() {
    if (this.doctorForm.province_id == null) return;

    this.doctorForm.regency_id = 0;
    // this.doctorService.getRegion(this.doctorForm.province_id).then((res: any) => {
    //   this.listRegion = res.data;
    // }).catch((err: any) => {
    //   console.log(err)
    // });
    this.doctorService.getRegion(this.doctorForm.province_id).subscribe({
      next: (res: any) => {
        this.listRegion = res.data;
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }

  getListSpecialist() {
    this.doctorService.getListSpecialist().subscribe({
      next: (res: any) => {
        this.listSpecialist = res.data;
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }

  /* modal functions */
  openModal(modalId: TemplateRef<void>, type: string, data: any = null) {
    this.resetHistoryForm();

    if (data != null) {
      if (type == "specialist") {
        this.specialistForm = data;
      } else if (type == "education") {
        this.educationForm = data;
      }
    }

    this.modalRef = this.modalService.show(modalId, { class: 'modal-lg' });
  }

  /* modal specialist function */
  saveSpecialistModal() {
    const data: Specialist = {
      id: Date.now(),
      slug: this.selectedSpecialist.slug,
      name: this.selectedSpecialist.name,
      rate: this.specialistForm.rate
    }

    if (this.specialistForm.id) {
      this.historyData.specialist.findIndex((el, index) => {
        if (el.id == this.specialistForm.id) {
          this.historyData.specialist[index] = data;
        }
      });
    } else {
      this.historyData.specialist.push(data);
    }
  }

  deleteSpecialist(id: number) {
    this.historyData.specialist = this.historyData.specialist.filter(el => el.id != id);
  }

  createSlug(value: string) {
    return value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  }

  async saveSpecialist(uuid: string) {
    /* setup request */
    const datas: SpecialistRequest[] = this.historyData.specialist.map(el => {
      const data: SpecialistRequest = {
        slug: el.slug,
        rate: el.rate || 0
      }

      return data;
    })

    const payload = {
      uuid: uuid,
      doctor_specialists: datas
    }

    /* process save */
    return this.doctorService.saveSpecialist(payload)
  }

  /* modal education function */
  saveEducationModal() {
    const data: Education = {
      id: Date.now(),
      education: this.educationForm.education,
      graduation_year: this.educationForm.graduation_year
    }

    if (this.educationForm.id) {
      this.historyData.education.findIndex((el, index) => {
        if (el.id == this.educationForm.id) {
          this.historyData.education[index] = data;
        }
      });
    } else {
      this.historyData.education.push(data);
    }
  }

  deleteEducation(id: number) {
    this.historyData.education = this.historyData.education.filter(el => el.id != id);
  }

  async saveEducation(uuid: string): Promise<any> {
    /* setup request */
    // const promises: Promise<any>[] = [];
    const requests: Observable<any>[] = [];

    this.historyData.education.forEach(el => {
      const payload = {
        education: el.education,
        graduation_year: `${el.graduation_year}`,
        uuid: uuid
      }

      requests.push(this.doctorService.saveEducation(payload));
    });

    /* process save */
    return forkJoin(requests)
  }

  /* upload image handler */
  onFileChange(event: any) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      this.imageFile = file;

      reader.readAsDataURL(file);

      reader.onload = () => {
        this.imageUrl = reader.result;
      }
    }
  }

  async uploadImage(uuid: string) {
    return this.doctorService.saveImage(uuid, this.imageFile);
  }

  /* validation handler */
  validateDoctorData(): boolean {
    let i = 0;
    Object.keys(this.doctorForm).forEach((key: string) => {
      if (!this.doctorForm[key]) {
        this.doctorDataValidation[key] = true;
        i++;
      } else {
        this.doctorDataValidation[key] = false;
      }
    })

    if (i > 0) {
      this.isValid = false;
      return false;
    }

    this.isValid = true;
    return true;
  }

  validateHistoryData(): boolean {
    if (this.historyData.specialist.length == 0 || this.historyData.education.length == 0) {
      Swal.fire({
        title: 'Peringatan!',
        text: 'Data spesialis dan pendidikan tidak boleh kosong',
        icon: 'warning'
      });
      return false;
    }

    return true;
  }

  validateImage(): boolean {
    /* check available image */
    if (!this.imageFile) {
      Swal.fire({
        title: 'Peringatan!',
        text: 'Gambar tidak boleh kosong',
        icon: 'warning'
      });
      this.isValidImage = false;
      return false;
    }

    /* check image size */
    const maxSize = 2 * 1024 * 1024
    if (this.imageFile.size > maxSize) {
      Swal.fire({
        title: 'Peringatan!',
        text: 'Ukuran gambar tidak boleh lebih dari 2MB',
        icon: 'warning'
      });
      this.isValidImage = false;
      return false;
    }

    this.isValidImage = true;
    return true;
  }

  onSubmit() {
    /* save doctor first */
    this.doctorService.saveDoctor(this.doctorForm).subscribe({
      next: (res: any) => {
        saveDetail(res as SaveDoctorResponse);
      },
      error: (err: any) => {
        Swal.fire({
          title: 'Gagal!',
          text: 'Data dokter gagal disimpan',
          icon: 'error'
        });
      }
    })

    /* save detail function */
    const saveDetail = (res: SaveDoctorResponse) => {
      /* save specialist, education and upload image */
      Promise.all([this.saveSpecialist(res.data.uuid), this.saveEducation(res.data.uuid), this.uploadImage(res.data.uuid)]);

      /* show success popup and update step */
      Swal.fire({
        title: 'Berhasil!',
        text: 'Data dokter berhasil disimpan',
        icon: 'success'
      }).then(() => {
        /* update step */
        this.updateNextStep(this.currentStep);
        this.currentStep = 4;
        this.stepper.next();

        setTimeout(() => {
          this.router.navigate(['/kesehatan/telemedicine/dokter']);
        }, 2000)
      });
    }
  }
}
