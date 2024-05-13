import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { DoctorService, SaveEducationRequest, SaveSpecialistRequestDoctorspecialist, SaveFacilityRequest, SaveSpecialistRequest } from '../../services/doctor/doctor.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';


/* interface declaration */
interface Specialist {
    slug: string;
    rate: number | null;
}
@Component({
    selector: 'app-detail-dokter',
    templateUrl: './detail-dokter.component.html',
    styleUrls: ['./detail-dokter.component.scss']
})

export class DetailDokterComponent implements OnInit {
    /* state configuration */
    isEditData: boolean = false;

    /* parameters */
    no_str: any;
    listProvince: any = [];
    listRegion: any = [];
    listSpecialist: any = [];
    data: any = {};

    /* forms configuration */
    educationForm: any = {
        name: '',
        year: ''
    }

    specialistForm: Specialist = {
        slug: '',
        rate: null
    }
    selectedSpecialist: any = {};


    facilityForm: SaveFacilityRequest = {
        name: '',
        province_id: 0,
        regency_id: 0,
        uuid: ''
    }
    selectedProvince: any = {};
    selectedRegion: any = {};

    newEducationData: SaveEducationRequest[] = [];
    newSpecialistData: SaveSpecialistRequestDoctorspecialist[] = [];
    newFacilityData: SaveFacilityRequest[] = [];

    constructor(
        private route: ActivatedRoute,
        private doctorService: DoctorService,
        private modalService: BsModalService
    ) { }

    ngOnInit(): void {
        this.no_str = this.route.snapshot.paramMap.get('id');
        if (this.no_str) {
            this.getData();
            this.getProvince();
            this.getListSpecialist();
        }
    }

    getData() {
        this.doctorService.detailDoctorByStr(this.no_str).subscribe({
            next: (res: any) => {
                if (res.status_code == 200) {
                    this.data = res.data;
                    console.log(this.data.status, 'status')
                } else {
                    Swal.fire({
                        title: 'Gagal',
                        text: 'Terjadi kesalahan saat mengambil data dokter',
                        icon: 'error'
                    })
                }
            },
            error: (err) => {
                Swal.fire({
                    title: 'Gagal',
                    text: 'Terjadi kesalahan saat mengambil data dokter',
                    icon: 'error'
                })
            }
        })
    }

    save() {
        const promises: Observable<Object>[] = []

        /* add education */
        if (this.newEducationData.length > 0) {
            this.newEducationData.forEach((item: SaveEducationRequest) => {
                promises.push(this.doctorService.saveEducation(item))
            });
        }

        /* add specialist */
        if (this.newSpecialistData.length > 0) {
            const specialist: SaveSpecialistRequest = {
                uuid: this.data.uuid,
                doctor_specialists: this.newSpecialistData
            }
            promises.push(this.doctorService.saveSpecialist(specialist))
        }

        /* add facility */
        if (this.newFacilityData.length > 0) {
            this.newFacilityData.forEach((item: SaveFacilityRequest) => {
                promises.push(this.doctorService.saveFacility(item))
            });
        }

        /* fetch all data */
        Promise.all(promises).then((res: any) => {
            Swal.fire({
                title: 'Berhasil',
                text: 'Data berhasil disimpan',
                icon: 'success'
            }).then(() => {
                this.isEditData = false;
                this.reset();
                this.getData();
            })
        }).catch((err: any) => {
            console.error(err)
        });
    }

    blockDoctor() {
        this.doctorService.updateStatusDoctor(this.data.uuid).subscribe({
            next: (res: any) => {
                if (res.code == 200) {
                    Swal.fire({
                        title: 'Berhasil',
                        text: 'Dokter berhasil dinonaktifkan',
                        icon: 'success'
                    }).then(() => {
                        this.getData();
                    })
                } else {
                    Swal.fire({
                        title: 'Gagal',
                        text: 'Terjadi kesalahan saat menonaktifkan dokter',
                        icon: 'error'
                    })
                }
            },
            error: (err) => {
                Swal.fire({
                    title: 'Gagal',
                    text: 'Terjadi kesalahan saat menonaktifkan dokter',
                    icon: 'error'
                })
            }
        })
    }

    unblockDoctor() {
        this.doctorService.activateDoctor(this.data.uuid).subscribe({
            next: (res: any) => {
                if (res.code == 200) {
                    Swal.fire({
                        title: 'Berhasil',
                        text: 'Dokter berhasil diaktifkan',
                        icon: 'success'
                    }).then(() => {
                        this.getData();
                    })
                } else {
                    Swal.fire({
                        title: 'Gagal',
                        text: 'Terjadi kesalahan saat mengaktifkan dokter',
                        icon: 'error'
                    })
                }
            },
            error: (err) => {
                Swal.fire({
                    title: 'Gagal',
                    text: 'Terjadi kesalahan saat mengaktifkan dokter',
                    icon: 'error'
                })
            }
        })
    }

    /* get parameter functions */
    getProvince() {
        this.doctorService.getProvince().subscribe({
            next: (res: any) => {
                this.listProvince = res.data;
            },
            error: (err) => {
                Swal.fire({
                    title: 'Gagal',
                    text: 'Terjadi kesalahan saat mengambil data provinsi',
                    icon: 'error'
                })
            }
        })
    }

    getRegion(province_id: number) {
        this.doctorService.getRegion(province_id).subscribe({
            next: (res: any) => {
                this.listRegion = res.data;
            },
            error: (err) => {
                Swal.fire({
                    title: 'Gagal',
                    text: 'Terjadi kesalahan saat mengambil data kota/kabupaten',
                    icon: 'error'
                })
            }
        })
    }

    getListSpecialist() {
        this.doctorService.getListSpecialist().subscribe({
            next: (res: any) => {
                this.listSpecialist = res.data;
            },
            error: (err) => {
                Swal.fire({
                    title: 'Gagal',
                    text: 'Terjadi kesalahan saat mengambil data spesialis',
                    icon: 'error'
                })
            }
        })
    }

    /* modal functions */
    openModal(modalId: TemplateRef<any>) {
        this.modalService.show(modalId, { class: 'modal-lg' });
        this.reset();
    }

    saveEducationModal() {
        this.data.educations.push({
            education: this.educationForm.education,
            graduation_year: this.educationForm.graduation_year
        });
        this.newEducationData.push({
            education: this.educationForm.education,
            graduation_year: `${this.educationForm.graduation_year}`,
            uuid: this.data.uuid
        });
    }

    saveSpecialistModal() {
        if (this.specialistForm.rate == null) return;
        this.data.doctor_specialists.push({
            specialist: this.selectedSpecialist.name,
            rate: this.specialistForm.rate
        });

        this.newSpecialistData.push({
            slug: this.selectedSpecialist.slug,
            rate: this.specialistForm.rate,
        });
    }

    saveFacilityModal() {
        console.log(this.facilityForm, this.selectedProvince, this.selectedRegion, this.data.uuid)
        this.data.facilities.push({
            name: this.facilityForm.name,
            province_name: this.selectedProvince.name,
            regency_name: this.selectedRegion.name
        });
        this.newFacilityData.push({
            name: this.facilityForm.name,
            province_id: this.selectedProvince.id,
            regency_id: this.selectedRegion.id,
            uuid: this.data.uuid
        });
    }

    /* utils */
    updateState() {
        this.isEditData = true;
    }

    createSlug(value: string) {
        return value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    }

    reset(): void {
        this.educationForm = {}
        this.specialistForm = {
            slug: '',
            rate: null
        }
        this.facilityForm = {
            name: '',
            province_id: 0,
            regency_id: 0,
            uuid: ''
        }

        this.newEducationData = [];
        this.newSpecialistData = [];
        this.newFacilityData = [];
    }

    closeUpdate() {
        Swal.fire({
            title: 'Apakah Anda Yakin?',
            text: "Data yang sudah diubah tidak akan tersimpan!",
            showCancelButton: true
        }).then((res: any) => {
            console.log(res)
            if (res.isConfirmed) {
                this.isEditData = false;
            }
        })
    }

    formatCurrency(event: any) {
        // let cleanValue = event.target.value.toString().replace(/\D/g, '');
        // event.target.value = parseFloat(event.target.value).toLocaleString('id-ID')
        // console.log(event.target.value)
    }
}