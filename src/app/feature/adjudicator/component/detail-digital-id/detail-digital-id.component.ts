/* tslint:disable:max-line-length triple-equals */
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CropperPosition, ImageCroppedEvent, ImageCropperComponent, ImageTransform } from 'ngx-image-cropper';
import { DigitalIdService } from '../../services/digital-id/digital-id.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/feature/auth/services/auth.service';
import Swal from 'sweetalert2';
import { LandaService } from 'src/app/core/services/landa.service';
import { WilayahService } from '../../services/wilayah/wilayah.service';
import { BlobToBase64Service } from 'src/app/core/services/blob-to-base64.service';
// import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';

interface Wilayah {
  value: string;
  label: string;
}

@Component({
  selector: 'app-detail-digital-id',
  templateUrl: './detail-digital-id.component.html',
  styleUrls: ['./detail-digital-id.component.scss']
})
export class DetailDigitalIdComponent implements OnInit {
  @ViewChild(ImageCropperComponent) imageCropper!: ImageCropperComponent;

  title = 'image-crop-app';
  srcImg: any;
  imgBase64: any = '';
  cropImgPreview: any = '';
  cropperOpen = false;
  cropperRatio = 3 / 4;
  cropperPosition: CropperPosition = { x1: 80.125, y1: 38.2, x2: 136.2, y2: 133 };
  iteration = 0;
  phone: any;
  minDate !: Date;
  maxDate : Date = new Date();

  transformImage: ImageTransform = {
    rotate: 0
  };
  rotation: number = 0;
  
  isEditData: any;
  isOperator = false;
  isSupervisor = false;
  isSuperadmin = false;
  listKeputusan: any;
  profile: any;

  id: any;
  document: any;
  listViewInfo: any;
  listVerifikasi: any;
  listCatatan: any;
  docName: any;
  genderOptions: any;
  religionOptions: any;
  bloodOptions: any;
  statusKeluargaOptions: any;
  statusKawinOptions: any;
  pendidikanAkhirOptions: any;
  pekerjaanOptions: any;
  kelurahanOptions: Wilayah[] = [];
  kecamatanOptions: Wilayah[] = [];
  kotaKabOptions: Wilayah[] = [];
  provinsiOptions: Wilayah[] = [];
  isFaceDetected: any;

  constructor(
    private route: ActivatedRoute,
    private digitalIdService: DigitalIdService,
    private http: HttpClient,
    private authService: AuthService,
    private landaService: LandaService,
    private router: Router,
    private wilayahService: WilayahService,
    private blobToBase64Service: BlobToBase64Service
    // private dateOpt: NgbDatepickerModule
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.document = {};
      this.isEditData = false;
      const role = this.authService.getUserRole();
      this.authService.getProfile().subscribe((res: any) => this.profile = res);
      this.isOperator = role.operator;
      this.isSupervisor = role.supervisor;
      this.isSuperadmin = role.superadmin;
      this.setComponentData();
      this.getDocument();
    }
    this.fetchWilayah();
  }

  callCenter() {
    this.digitalIdService.callCustomerCare();
  }

  getBase64FromUrl() {
    this.http.get(this.srcImg, { responseType: 'blob' }).subscribe((res: any) => {
      const reader = new FileReader();
      reader.readAsDataURL(res);
      reader.onload = (event: any) => {
        this.imgBase64 = event.target.result;
      };

      reader.onerror = (event: any) => {
        console.log(event);
      };
    });
  }

  viewImageCroped : any;

  cropImg(e: ImageCroppedEvent) {
    this.viewImageCroped = e.objectUrl
    this.convertExampleBlob(e.blob);
  }

  async convertExampleBlob(blob : any) {
    try {
      const base64String = await this.blobToBase64Service.convertBlobToBase64(blob);
      this.cropImgPreview = base64String;
      console.log(base64String)
      return base64String;
    } catch (error) {
      console.error('Conversion failed', error);
      return
    }
  }

  imageLoaded() {
    if (this.iteration++ === 0) {
      this.rotateLeft();
    }

    setTimeout(() => {
      this.cropperPosition = { x1: 0, y1: 0, x2: 140, y2: 180 };
    }, 2);
  }

  rotateLeft() {
    this.rotation += 90;
    if (this.rotation === 360) {
      this.rotation = 0;
    }
    this.transformImage = {
      ...this.transformImage,
      rotate: this.rotation
    };
  }

  toggleCropper() {
    if (this.cropperOpen) {
      this.document.doc_pict_cropping = this.cropImgPreview;
    }
    this.iteration = 0;
    this.cropperOpen = !this.cropperOpen;
    setTimeout(()=>{
      this.transformImage = {
        ...this.transformImage,
        rotate: 0
      }
    },100)
  }

  reset() {
    this.cropImgPreview = '';
    this.imgBase64 = '';
  }

  toggleEditData() {
    this.isEditData = !this.isEditData;
  }

  fetchWilayah() {
    this.wilayahService.getProvinsi('').subscribe((res: any) => {
      res.response.data.forEach((element: any) => {
        this.provinsiOptions.push({ value: element.nama, label: element.nama });
      });
    });

    this.wilayahService.getKabupaten('').subscribe((res: any) => {
      res.response.data.forEach((element: any) => {
        this.kotaKabOptions.push({ value: element.nama, label: element.nama });
      });
    });

    this.wilayahService.getKecamatan('').subscribe((res: any) => {
      res.response.data.forEach((element: any) => {
        this.kecamatanOptions.push({ value: element.nama, label: element.nama });
      });
    });

    this.wilayahService.getKelurahan('').subscribe((res: any) => {
      res.response.data.forEach((element: any) => {
        this.kelurahanOptions.push({ value: element.nama, label: element.nama });
      });
    });
  }

  alertError(msg : any) {
    Swal.fire({
      icon: 'error',
      title: 'Gagal Menyimpan Data',
      text: msg,
      showConfirmButton: true,
      confirmButtonColor: '#CC1D15'
    });
  }

  validateData() {
    if (this.document.catatan_supervisor && this.document.keputusan) {
      Swal.fire({
        title: 'Data Selesai Diverifikasi ?',
        html: `<p>Kamu sedang melakukan verifikasi data.</p><p>Pastikan data sudah sesuai.</p>`,
        iconHtml: `
            <svg width="168" height="169" viewBox="0 0 168 169" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50.9302 33.5682C28.3753 39.6905 10.5547 59.0362 5.34117 83.9035C1.45442 102.412 4.86775 121.501 31.0288 128.454C87.5767 143.48 148.672 138.491 156.013 108.48C163.354 78.4697 149.73 26.9936 117.385 23.8076C98.9681 21.9783 71.3225 28.0534 50.9302 33.5682Z" fill="#F5F6F8"/>
              <path d="M45.77 130.807C46.3137 134.118 49.4668 136.339 52.7676 135.737L112.725 124.798C115.945 124.211 118.099 121.152 117.569 117.923L106.032 47.6818L84.8277 32.8398L37.0849 41.5596C33.8662 42.1474 31.712 45.2056 32.2422 48.4343L45.77 130.807Z" fill="#172D6C"/>
              <path d="M45.0459 73.4131L83.4914 66.4023" stroke="#FCFCFC" stroke-width="3" stroke-linecap="round"/>
              <path d="M44.4404 57.3532L47.9784 59.4995L51.4534 50.3838" stroke="#FCFCFC" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M47.9473 94.5284L86.3849 87.5176" stroke="#FCFCFC" stroke-width="3" stroke-linecap="round"/>
              <path d="M50.8398 115.644L89.2853 108.633" stroke="#FCFCFC" stroke-width="3" stroke-linecap="round"/>
              <path d="M66.4785 25.2988C63.1648 25.2988 60.4785 27.9851 60.4785 31.2988V114.922C60.4785 118.236 63.1648 120.922 66.4785 120.922H127.313C130.626 120.922 133.313 118.236 133.313 114.922V43.7291L114.821 25.2988H66.4785Z" fill="#21409A"/>
              <path d="M60.4785 108.922C60.4785 115.55 65.8511 120.922 72.4785 120.922H121.313C127.94 120.922 133.313 115.55 133.313 108.922V43.7291L114.821 25.2988H72.4785C65.8511 25.2988 60.4785 30.6714 60.4785 37.2988V108.922Z" fill="url(#paint0_linear_1641_73735)" fill-opacity="0.23"/>
              <g filter="url(#filter0_d_1641_73735)">
                  <path d="M114.821 25.2988V40.7291C114.821 42.386 116.164 43.7291 117.821 43.7291H133.313L114.821 25.2988Z" fill="#A6B3D7"/>
              </g>
              <g filter="url(#filter1_d_1641_73735)">
                  <path d="M68.6162 25.2991V21.7522C68.6162 18.9238 70.7915 16.6309 73.475 16.6309V16.6309C74.7636 16.6309 75.9994 17.1704 76.9106 18.1309C77.8218 19.0913 78.3337 20.394 78.3337 21.7522V28.8625C78.3337 31.6909 76.1584 33.9838 73.475 33.9838V33.9838C72.1863 33.9838 70.9505 33.4443 70.0393 32.4838C69.1281 31.5234 68.6162 30.2207 68.6162 28.8625" stroke="#E9ECF5" stroke-width="2.36"/>
              </g>
              <g filter="url(#filter2_d_1641_73735)">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M96.0154 97.2382C85.8853 95.571 78.3846 86.4265 78.2833 75.62C78.1819 64.8134 85.5095 55.5144 95.6064 53.6363C105.703 51.7582 115.608 57.8518 119.022 68.0422C122.167 77.4303 118.953 87.7587 111.409 93.4094L114.053 98.4509C115.034 98.472 115.976 99.0097 116.467 99.9448L127.024 120.069C127.512 120.999 127.424 122.083 126.88 122.905L129.044 127.03C129.331 127.579 129.398 128.226 129.229 128.827C129.061 129.428 128.671 129.932 128.148 130.229C127.63 130.531 127.019 130.604 126.45 130.431C125.88 130.259 125.4 129.855 125.113 129.309L122.965 125.214C121.88 125.31 120.789 124.762 120.248 123.731L109.691 103.606C109.154 102.581 109.315 101.37 110.016 100.526L107.496 95.723C103.893 97.3485 99.9151 97.8817 96.0154 97.2382ZM101.818 57.8667C94.0866 56.5889 86.541 61.1008 83.6151 68.751C80.6892 76.4013 83.1563 85.1678 89.5666 89.8989C95.977 94.63 104.636 94.0751 110.456 88.5604C116.275 83.0457 117.717 74.0287 113.933 66.8084C111.423 62.0138 106.95 58.7126 101.818 57.8667ZM92.2181 70.6619C93.156 67.7154 96.0103 65.9478 98.9087 66.5184C100.171 66.867 101.228 67.7733 101.81 69.0045C102.187 69.654 102.376 70.406 102.352 71.1674C102.211 72.258 101.972 73.3319 101.637 74.3744C101.369 75.1727 101.236 76.014 101.244 76.8605C101.364 77.6664 101.631 78.4402 102.03 79.1394L100.167 80.2168C99.6854 79.372 99.3525 78.4429 99.1839 77.4738C99.1216 76.4147 99.2578 75.3531 99.5848 74.3496L99.9622 72.9988C100.082 72.6301 100.148 72.2446 100.159 71.8552C100.199 71.2532 100.074 70.6516 99.7971 70.1232C99.4602 69.4371 98.9029 68.8996 98.2247 68.6067C97.2705 68.3835 96.2714 68.6024 95.4805 69.2077C94.6897 69.8131 94.1831 70.7469 94.0892 71.7723C94.1548 72.6468 94.4017 73.4955 94.8125 74.2584L92.9492 75.2694C92.1432 73.8935 91.8807 72.2394 92.2181 70.6619ZM101.11 82.015L103.186 80.8051L104.389 83.1006L102.313 84.3105L101.11 82.015Z" fill="white"/>
              </g>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M155.751 18.5843C152.508 18.5953 149.883 21.3665 149.878 24.7847C149.88 23.1412 149.263 21.564 148.161 20.4009C147.059 19.2378 145.564 18.5842 144.005 18.5843C147.248 18.5732 149.873 15.802 149.878 12.3838C149.883 15.8004 152.51 18.5687 155.751 18.5742" fill="#00A79D"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M145.735 158.31C142.492 158.315 139.863 161.082 139.853 164.5C139.858 162.857 139.24 161.279 138.138 160.117C137.035 158.955 135.539 158.304 133.979 158.31C135.539 158.31 137.034 157.656 138.136 156.493C139.237 155.33 139.855 153.753 139.853 152.109C139.858 155.532 142.488 158.304 145.735 158.31Z" fill="#00A79D"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M22.2111 149.695C19.5575 149.701 17.4076 151.967 17.4024 154.764C17.4049 153.419 16.8991 152.128 15.9968 151.177C15.0944 150.226 13.8699 149.692 12.5938 149.695C13.8716 149.692 15.0961 149.155 15.9979 148.2C16.8997 147.246 17.4049 145.953 17.4024 144.606C17.4076 147.403 19.5575 149.669 22.2111 149.675" fill="#00A79D"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M89.941 8.44666C87.8768 8.44665 86.2019 10.2075 86.1967 12.3833C86.1992 11.3375 85.8069 10.3336 85.1062 9.5932C84.4055 8.85277 83.4541 8.43664 82.4619 8.43664C84.5224 8.43114 86.1915 6.67186 86.1967 4.5C86.2019 6.67577 87.8768 8.43665 89.941 8.43664" fill="#00A79D"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M159.496 113.765C157.428 113.765 155.751 115.532 155.751 117.711C155.754 116.666 155.362 115.662 154.661 114.921C153.96 114.181 153.009 113.765 152.017 113.765C154.079 113.765 155.751 112.002 155.751 109.828C155.757 112.004 157.431 113.765 159.496 113.765Z" fill="#00A79D"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M15.0931 73.2162C13.0305 73.2162 11.3584 74.9787 11.3584 77.1528C11.3584 74.9865 9.69782 73.2272 7.64258 73.2162C9.71049 73.2162 11.3869 71.4492 11.3869 69.2695C11.3869 71.4453 13.0574 73.2107 15.1216 73.2162" fill="#00A79D"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M32.1329 16.3303C29.4794 16.3358 27.3295 18.6018 27.3243 21.3988C27.3268 20.0537 26.821 18.763 25.9186 17.8119C25.0163 16.8608 23.7917 16.3276 22.5156 16.3303C23.7917 16.3329 25.0163 15.7998 25.9186 14.8487C26.821 13.8976 27.3268 12.6068 27.3243 11.2617C27.3295 14.0587 29.4794 16.3248 32.1329 16.3303Z" fill="#00A79D"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M145.487 51.3087H145.582L145.611 51.2886C145.884 51.286 146.111 51.0652 146.136 50.7781C146.16 50.4909 145.974 50.2309 145.706 50.1768C144.413 49.9263 143.045 49.716 141.638 49.5457C141.339 49.5014 141.063 49.7212 141.021 50.0365C140.979 50.3519 141.187 50.6434 141.486 50.6876C142.874 50.8579 144.214 51.0583 145.487 51.3087ZM153.422 53.6426C153.357 53.6569 153.289 53.6569 153.223 53.6426C151.981 53.1149 150.712 52.6601 149.422 52.2803C149.24 52.2284 149.098 52.0783 149.05 51.8866C149.002 51.6948 149.055 51.4905 149.188 51.3507C149.321 51.2108 149.516 51.1566 149.697 51.2085C151.031 51.5941 152.341 52.0624 153.622 52.6109C153.847 52.7181 153.973 52.9746 153.925 53.2301C153.878 53.4857 153.669 53.6732 153.422 53.6827V53.6426ZM159.837 58.1001C159.94 58.2091 160.081 58.2704 160.227 58.2704V58.2504C160.38 58.2652 160.532 58.2106 160.645 58.1001C160.852 57.8813 160.852 57.5276 160.645 57.3088C159.66 56.2442 158.548 55.3184 157.338 54.5542C157.091 54.391 156.766 54.4694 156.611 54.7295C156.456 54.9895 156.53 55.3325 156.777 55.4957C157.896 56.2268 158.924 57.1016 159.837 58.1001ZM163.458 66.915C163.166 66.9042 162.935 66.6517 162.935 66.3441V66.1137C162.94 64.8184 162.738 63.5315 162.337 62.3072C162.241 62.0268 162.137 61.7463 162.023 61.4758C161.908 61.1935 162.026 60.866 162.289 60.7346C162.419 60.6743 162.566 60.671 162.698 60.7255C162.83 60.7801 162.936 60.8879 162.992 61.0251L162.992 61.0257L162.993 61.0262C163.116 61.3263 163.239 61.6265 163.344 61.9366C163.784 63.2802 164.005 64.6924 164 66.1137V66.3641C163.981 66.6489 163.766 66.8756 163.496 66.895L163.458 66.915ZM161.025 75.0387C161.102 75.0787 161.186 75.0993 161.272 75.0988V75.0788C161.465 75.0828 161.643 74.975 161.738 74.7983C162.381 73.4968 162.909 72.1354 163.315 70.7315C163.357 70.588 163.342 70.4331 163.274 70.3014C163.206 70.1697 163.091 70.072 162.954 70.0303C162.674 69.9519 162.385 70.1196 162.299 70.4109C161.914 71.7496 161.411 73.0475 160.797 74.2875C160.665 74.5615 160.767 74.8964 161.025 75.0387ZM156.692 82.2008C156.57 82.1972 156.453 82.1515 156.359 82.0706C156.25 81.9751 156.182 81.8379 156.17 81.6895C156.157 81.541 156.202 81.3934 156.292 81.2793C157.186 80.1473 158.013 79.0154 158.735 77.9036C158.911 77.6813 159.218 77.6363 159.444 77.7998C159.671 77.9633 159.742 78.2816 159.609 78.5346C158.868 79.6766 158.022 80.8385 157.1 82.0005C156.995 82.1192 156.846 82.1848 156.692 82.1808V82.2008ZM150.657 88.221C150.757 88.3366 150.898 88.4021 151.047 88.4013V88.3812C151.157 88.3582 151.256 88.2985 151.332 88.211C152.368 87.2093 153.318 86.2076 154.268 85.2059C154.417 85.0662 154.479 84.851 154.429 84.6479C154.38 84.4448 154.227 84.2878 154.033 84.2408C153.839 84.1938 153.637 84.2647 153.508 84.4246C152.653 85.4263 151.674 86.4279 150.657 87.4296C150.45 87.6485 150.45 88.0021 150.657 88.221ZM144.803 93.9306C144.64 93.933 144.486 93.8552 144.385 93.7202C144.208 93.473 144.25 93.1218 144.48 92.9289C145.573 92.0474 146.637 91.1459 147.644 90.2544C147.789 90.1274 147.986 90.0911 148.163 90.1593C148.339 90.2275 148.468 90.3898 148.5 90.585C148.533 90.7803 148.464 90.9788 148.319 91.1058C147.302 92.0074 146.228 92.9189 145.126 93.8204C145.031 93.8884 144.917 93.9202 144.803 93.9106V93.9306ZM13.6389 98.3781C13.7405 98.475 13.8726 98.5286 14.0096 98.5284C14.1756 98.5571 14.3447 98.5014 14.4657 98.3781C15.3305 97.3764 16.2998 96.3747 17.3167 95.373C17.5233 95.1542 17.5233 94.8005 17.3167 94.5817C17.1091 94.3639 16.7736 94.3639 16.5659 94.5817C15.5396 95.5834 14.5893 96.5851 13.639 97.5867L13.6389 97.5868C13.4323 97.8056 13.4323 98.1593 13.6389 98.3781ZM138.179 98.9391C137.952 98.9364 137.753 98.7797 137.686 98.5513C137.619 98.3229 137.699 98.0748 137.885 97.9374C139.035 97.126 140.156 96.3046 141.22 95.5033C141.333 95.4134 141.475 95.3755 141.615 95.3982C141.755 95.4208 141.88 95.5021 141.962 95.6235C142.132 95.8753 142.076 96.2247 141.838 96.4048C140.764 97.2161 139.633 98.0476 138.474 98.8689C138.383 98.9168 138.281 98.9376 138.179 98.929V98.9391ZM130.819 103.135C130.88 103.356 131.063 103.515 131.28 103.537C131.367 103.562 131.458 103.566 131.546 103.547C132.734 102.796 133.903 102.044 135.043 101.293C135.306 101.127 135.391 100.768 135.233 100.492C135.076 100.215 134.735 100.125 134.473 100.291C133.342 101.043 132.192 101.794 131.004 102.535C130.832 102.676 130.758 102.914 130.819 103.135ZM8.86829 105.17C8.67154 105.171 8.49013 105.058 8.39661 104.875C8.30309 104.693 8.31271 104.471 8.42164 104.298C9.15339 103.156 9.98017 101.984 10.8925 100.812C11.0061 100.636 11.2044 100.543 11.4044 100.572C11.6045 100.601 11.7718 100.747 11.8365 100.948C11.9012 101.15 11.8521 101.373 11.7098 101.523C10.826 102.665 10.0182 103.807 9.30544 104.919C9.21174 105.078 9.04568 105.173 8.86829 105.17ZM123.77 107.33C123.824 107.549 123.997 107.712 124.209 107.744H124.162C124.259 107.772 124.363 107.765 124.457 107.724C125.679 107.043 126.877 106.352 128.049 105.65C128.306 105.501 128.399 105.16 128.258 104.889C128.109 104.626 127.791 104.534 127.536 104.679C126.367 105.37 125.169 106.061 123.962 106.742C123.792 106.879 123.716 107.111 123.77 107.33ZM5.21904 112.883C5.26296 112.892 5.30816 112.892 5.35208 112.883C5.58701 112.889 5.79697 112.729 5.86526 112.492C6.21786 111.144 6.69532 109.835 7.29075 108.585C7.38364 108.316 7.26894 108.016 7.02475 107.89C6.78057 107.764 6.48546 107.852 6.34042 108.095C5.71441 109.408 5.21459 110.783 4.84841 112.201C4.80792 112.344 4.82469 112.497 4.89478 112.626C4.96487 112.755 5.08212 112.848 5.21904 112.883ZM109.451 115.207C109.202 115.201 108.99 115.015 108.94 114.759C108.89 114.502 109.015 114.243 109.242 114.135C110.496 113.554 111.732 112.973 112.958 112.382C113.132 112.251 113.364 112.244 113.545 112.362C113.727 112.481 113.824 112.703 113.791 112.926C113.758 113.148 113.602 113.329 113.395 113.383C112.169 113.974 110.924 114.555 109.66 115.136C109.598 115.173 109.53 115.197 109.46 115.207H109.451ZM101.411 118.131C101.493 118.344 101.688 118.482 101.905 118.482H101.915C101.987 118.487 102.058 118.474 102.124 118.442C103.407 117.921 104.671 117.38 105.925 116.839C106.195 116.72 106.322 116.393 106.21 116.108C106.158 115.97 106.054 115.86 105.924 115.803C105.793 115.747 105.646 115.748 105.516 115.808C104.549 116.256 103.593 116.642 102.631 117.03L102.63 117.03L102.629 117.03C102.325 117.153 102.021 117.275 101.715 117.4C101.442 117.516 101.307 117.841 101.411 118.131ZM5.59917 121.317C5.38383 121.319 5.19027 121.179 5.1145 120.966L4.94344 120.505C4.52885 119.235 4.31066 117.902 4.29722 116.559C4.29206 116.409 4.34484 116.264 4.44342 116.156C4.54201 116.049 4.67792 115.988 4.8199 115.988C4.96087 115.98 5.09885 116.033 5.20135 116.135C5.30384 116.238 5.3618 116.38 5.36159 116.529C5.3749 117.75 5.57713 118.962 5.96029 120.115C5.96029 120.208 6.00253 120.302 6.04477 120.395C6.06588 120.442 6.087 120.489 6.10284 120.535C6.15844 120.672 6.15837 120.826 6.10266 120.963C6.04695 121.099 5.94049 121.206 5.80824 121.257C5.7465 121.291 5.67848 121.312 5.60867 121.317H5.59917ZM93.7552 121.009C93.7964 121.27 94.0047 121.465 94.2551 121.477H94.2646C94.3259 121.477 94.3868 121.467 94.4452 121.447C95.3917 121.099 96.3545 120.723 97.3131 120.349L97.3137 120.348L97.3149 120.348L97.3156 120.348L97.3159 120.347L97.3162 120.347L97.3165 120.347C97.6272 120.226 97.9374 120.105 98.2465 119.985C98.3788 119.933 98.4862 119.828 98.545 119.692C98.6038 119.557 98.6093 119.403 98.5601 119.263C98.513 119.125 98.4151 119.012 98.2883 118.949C98.1615 118.887 98.0164 118.881 97.8854 118.933L94.0841 120.395C93.851 120.493 93.714 120.748 93.7552 121.009ZM86.5195 124.192C86.2865 124.191 86.0799 124.034 86.0063 123.801C85.9198 123.505 86.0772 123.191 86.3579 123.1C87.6409 122.679 88.9333 122.238 90.2257 121.778C90.5062 121.685 90.8056 121.845 90.9005 122.138C90.9455 122.278 90.9356 122.43 90.8731 122.562C90.8107 122.694 90.7007 122.794 90.5679 122.839C89.2659 123.3 87.964 123.741 86.6715 124.172L86.5195 124.192ZM10.8925 127.738C10.7882 127.737 10.6862 127.706 10.5979 127.648C9.41663 126.84 8.34007 125.873 7.39529 124.773C7.26257 124.623 7.21743 124.41 7.27749 124.215C7.33756 124.021 7.49331 123.876 7.68393 123.838C7.87456 123.8 8.06985 123.874 8.19356 124.031C9.07565 125.06 10.0821 125.963 11.1871 126.716C11.4261 126.889 11.4894 127.232 11.3296 127.487C11.223 127.65 11.0409 127.738 10.8545 127.718L10.8925 127.738ZM70.3176 128.245C70.3485 128.52 70.5662 128.731 70.8296 128.739L70.9436 128.719C72.2646 128.409 73.5855 128.078 74.916 127.718C75.1992 127.639 75.3718 127.337 75.3056 127.036C75.2721 126.892 75.1846 126.768 75.0628 126.692C74.9411 126.617 74.7956 126.596 74.6594 126.636L74.2741 126.735L73.8948 126.832L73.8796 126.836C72.8152 127.109 71.7606 127.38 70.706 127.637C70.4518 127.711 70.2866 127.969 70.3176 128.245ZM62.8468 130.522C62.5929 130.523 62.374 130.334 62.3242 130.072C62.2964 129.927 62.325 129.776 62.4036 129.654C62.4823 129.531 62.6043 129.447 62.7423 129.42C64.0633 129.15 65.3937 128.87 66.7337 128.569C66.8712 128.537 67.0154 128.564 67.1334 128.645C67.2515 128.726 67.3336 128.854 67.3609 129C67.4196 129.301 67.2373 129.596 66.9522 129.661C65.6028 129.961 64.2628 130.252 62.9419 130.512L62.8468 130.522ZM18.1815 131.173H18.3335L18.2955 131.163C18.5414 131.192 18.7738 131.039 18.8562 130.793C18.8972 130.651 18.8819 130.497 18.8139 130.367C18.7459 130.237 18.631 130.141 18.4951 130.102C17.202 129.713 15.9325 129.241 14.6938 128.689C14.4261 128.57 14.1173 128.7 14.0001 128.98C13.8864 129.265 14.0086 129.593 14.2756 129.721C15.549 130.287 16.8532 130.772 18.1815 131.173ZM54.7976 131.935C54.5271 131.923 54.308 131.699 54.2885 131.415C54.2691 131.13 54.4554 130.875 54.7215 130.823C56.0425 130.623 57.3825 130.402 58.7414 130.172C58.8803 130.146 59.0233 130.18 59.1378 130.267C59.2523 130.354 59.3287 130.486 59.3496 130.633C59.3743 130.779 59.3417 130.93 59.2594 131.05C59.1771 131.171 59.052 131.252 58.9125 131.274C57.6825 131.491 56.4603 131.684 55.253 131.875L54.8736 131.935H54.7976ZM26.2213 132.836H26.2878V132.826C26.5499 132.826 26.774 132.627 26.82 132.355C26.8534 132.049 26.6453 131.771 26.3543 131.734C24.9763 131.554 23.6269 131.334 22.3629 131.073C22.0753 131.018 21.7976 131.213 21.7357 131.514C21.6834 131.82 21.8736 132.115 22.1634 132.175C23.4558 132.436 24.8243 132.656 26.2213 132.836ZM46.6533 132.926C46.3594 132.926 46.1211 132.675 46.1211 132.365C46.1211 132.056 46.3594 131.805 46.6533 131.805C47.9837 131.684 49.3427 131.534 50.7017 131.374C50.8409 131.354 50.9818 131.395 51.0914 131.488C51.2009 131.581 51.2696 131.717 51.2814 131.865C51.3148 132.171 51.1067 132.449 50.8157 132.486C49.4567 132.646 48.0883 132.796 46.7483 132.916L46.6533 132.926ZM30.3267 133.217C31.6381 133.307 33.0256 133.397 34.4321 133.397H34.4511C34.7152 133.36 34.9123 133.122 34.9123 132.841C34.9123 132.56 34.7152 132.323 34.4511 132.285C33.0541 132.255 31.6951 132.195 30.3932 132.105C30.1239 132.121 29.9083 132.346 29.8914 132.63C29.8744 132.913 30.0614 133.166 30.3267 133.217ZM37.9768 132.856C37.987 133.158 38.2223 133.397 38.509 133.397H38.5185C39.8489 133.367 41.2269 133.317 42.6144 133.227C42.754 133.222 42.8856 133.157 42.9789 133.047C43.0722 132.938 43.119 132.793 43.1086 132.646C43.1092 132.496 43.0497 132.353 42.9446 132.252C42.8396 132.151 42.699 132.101 42.5574 132.115L42.1084 132.141C40.8825 132.214 39.6684 132.285 38.4995 132.285C38.3575 132.285 38.2216 132.346 38.123 132.454C38.0244 132.561 37.9716 132.707 37.9768 132.856ZM78.1851 126.165C78.2492 126.408 78.4591 126.576 78.6983 126.576L78.8408 126.556C80.0172 126.221 81.2013 125.861 82.3932 125.5L82.3936 125.499L82.394 125.499L82.3943 125.499L82.3947 125.499L82.3951 125.499L82.3954 125.499L82.3958 125.499L82.7752 125.384C83.0559 125.292 83.2133 124.978 83.1268 124.683C83.0873 124.541 82.9957 124.422 82.8724 124.353C82.7492 124.283 82.6047 124.268 82.4711 124.312C81.1596 124.713 79.8577 125.103 78.5557 125.474C78.4196 125.514 78.304 125.609 78.2345 125.738C78.1649 125.868 78.1472 126.022 78.1851 126.165ZM116.93 111.63C116.686 111.625 116.476 111.445 116.422 111.194C116.368 110.942 116.484 110.685 116.702 110.569C117.937 109.938 119.154 109.307 120.351 108.665C120.522 108.561 120.734 108.566 120.901 108.677C121.068 108.789 121.163 108.988 121.147 109.196C121.132 109.404 121.008 109.585 120.826 109.667C119.629 110.308 118.403 110.939 117.158 111.57C117.088 111.609 117.009 111.63 116.93 111.63Z" fill="#00A79D"/>
              <path d="M22.6867 89.0225C21.6319 89.8839 20.6055 90.7654 19.6172 91.6469C19.3972 91.845 19.3677 92.192 19.5507 92.4282C19.6536 92.5533 19.8022 92.6262 19.9593 92.6285C20.0848 92.6316 20.2068 92.5851 20.3014 92.4983C21.1377 91.7471 22.0025 91.0058 22.8863 90.2746L22.6867 89.0225Z" fill="#00A79D"/>
              <defs>
                  <filter id="filter0_d_1641_73735" x="112.821" y="24.2988" width="26.4912" height="26.4307" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                      <feOffset dx="2" dy="3"/>
                      <feGaussianBlur stdDeviation="2"/>
                      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.44 0"/>
                      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1641_73735"/>
                      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1641_73735" result="shape"/>
                  </filter>
                  <filter id="filter1_d_1641_73735" x="65.4365" y="15.4512" width="16.0771" height="23.7129" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                      <feOffset dy="2"/>
                      <feGaussianBlur stdDeviation="1"/>
                      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.364511 0"/>
                      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1641_73735"/>
                      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1641_73735" result="shape"/>
                  </filter>
                  <filter id="filter2_d_1641_73735" x="71.2822" y="53.2979" width="59.0381" height="86.2256" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                      <feOffset dx="-3" dy="5"/>
                      <feGaussianBlur stdDeviation="2"/>
                      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.24 0"/>
                      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1641_73735"/>
                      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1641_73735" result="shape"/>
                  </filter>
                  <linearGradient id="paint0_linear_1641_73735" x1="117.116" y1="95.2142" x2="154.352" y2="58.3263" gradientUnits="userSpaceOnUse">
                      <stop stop-color="#010101" stop-opacity="0.01"/>
                      <stop offset="1" stop-color="#010101"/>
                  </linearGradient>
              </defs>
          </svg>
        `,
        showCancelButton: true,
        confirmButtonColor: '#21409A',
        cancelButtonColor: '#CC1D15',
        confirmButtonText: 'Ya, Simpan',
        cancelButtonText: 'Batal'
      }).then((result) => {
        if (!result.value) {
          return false;
        }

        const doc = this.prepareDoc();

        doc.NIK = doc.Nik;
        doc.NoKK = doc.NoKk;
        doc.DocDoB = doc.DocDob;
        doc.DocPoB = doc.DocPob;
        // doc.DocMarital = doc.StatusKawin;
        doc.DocRtRw = (this.document.rt == undefined ? '-' : this.document.rt) + '/' + (this.document.rw == undefined ? '-' : this.document.rw);
        doc.rt = this.document.rt == undefined ? '' : this.document.rt;
        doc.rw = this.document.rw == undefined ? '' : this.document.rw;
        doc.DocIssuer = (doc.Provinsi == undefined ? '-' : 'PROVINSI ' + doc.Provinsi) + ', ' + (doc.KotamadyaKab == undefined ? '-' : doc.KotamadyaKab);
        doc.DocAdjId = this.document.id;
        if (this.document.keputusan === 'Anomali') {
          doc.DocAdjStatus = 6;
        } else if (this.document.keputusan === 'Diterima') {
          doc.DocAdjStatus = 3;
          doc.DocAdjApprovedBy = this.profile.Fullname;
          const date = new Date();
          doc.DocAdjApprovedDate = date.toISOString();
        } else if (this.document.keputusan === 'Ditolak') {
          const date = new Date();
          doc.DocAdjStatus = 5;
          doc.DocAdjRejectedBy = this.profile.Fullname;
          doc.DocAdjRejectedDate = date.toISOString();
        } else if (this.document.keputusan === 'Kirim Kembali') {
          doc.DocAdjStatus = 1;
        }

        if (this.isOperator) {
          doc.docPictCropping = this.cropImgPreview.substr(22);
        }

        doc.DocDoB = doc.DocDoB.split('T')[0];
        doc.DocDob = doc.DocDob.split('T')[0];
        doc.DocExpired = doc.DocExpired.split('T')[0];
        doc.DocIssueDate = doc.DocIssueDate.split('T')[0];
        doc.AdjStatus = doc.AdjStatus == undefined ? 0 : doc.AdjStatus;
        doc.AdjValidateBy = doc.AdjValidateBy = undefined ? '' : doc.AdjValidateBy;
        doc.DeletedDate = doc.DeletedDate == undefined ? null : doc.DeletedDate;
        doc.DocAddress = doc.DocAddress == undefined ? '' : doc.DocAddress;
        doc.DocBlood = doc.DocBlood == undefined ? '' : doc.DocBlood;
        doc.DocCompany = doc.DocCompany == undefined ? '' : doc.DocCompany;
        doc.DocDepartment = doc.DocDepartment == undefined ? '' : doc.DocDepartment;
        doc.DocEmail = doc.DocEmail == undefined ? '' : doc.DocEmail;
        doc.DocInterNo = doc.DocInterNo == undefined ? '' : doc.DocInterNo;
        doc.DocInterType = doc.DocInterType == undefined ? '' : doc.DocInterType;
        doc.DocIssuerConfirm = doc.DocIssuerConfirm == undefined ? 0 : doc.DocIssuerConfirm;
        doc.DocKecamatan = doc.DocKecamatan == undefined ? '' : doc.DocKecamatan;
        doc.DocKelDesa = doc.DocKelDesa == undefined ? '' : doc.DocKelDesa;
        doc.DocPhoneNo = doc.DocPhoneNo == undefined ? '' : doc.DocPhoneNo;
        doc.DocPoB = doc.DocPoB == undefined ? '' : doc.DocPoB;
        doc.DocPob = doc.DocPob == undefined ? '' : doc.DocPob;
        doc.DocProfession = doc.DocProfession == undefined ? '' : doc.DocProfession;
        doc.DocQR = doc.DocQR == undefined ? '' : doc.DocQR;
        doc.KotamadyaKab = doc.KotamadyaKab == undefined ? '' : doc.KotamadyaKab;
        doc.DocMarital = doc.DocMarital == undefined ? 'Belum Kawin' : doc.DocMarital;
        doc.Provinsi = doc.Provinsi == undefined ? '' : doc.Provinsi;
        // doc.DocHeight = doc.DocHeight == undefined ? '' : doc.DocHeight;
        // doc.DocWeight = doc.DocWeight == undefined ? '' : doc.DocWeight;

        doc.SecurityStamp = doc.SecurityStamp == undefined ? '' : doc.SecurityStamp;
        doc.Status = doc.Status == undefined ? '' : doc.Status;
        doc.StatusKawin = doc.DocMarital == undefined ? 'Belum Kawin' : doc.DocMarital;
        doc.TglCerai = doc.TglCerai == undefined ? '' : doc.TglCerai;
        doc.TglKawin = doc.TglKawin == undefined ? '' : doc.TglKawin;
        doc.UpdatedDate = doc.UpdatedDate == undefined ? null : doc.UpdatedDate;

        const date = new Date();
        if (this.document.created_date) {
          if (!this.document.created_date.includes('T')) {
            doc.CreatedDate = this.document.created_date + 'T00:00:00.000Z';
          } else {
            doc.CreatedDate = this.document.created_date;
          }
        } else {
          doc.CreatedDate = date.toISOString();
        }
        this.sendData(doc);
        return
      });
    }
  }

  verifData() {
    if (this.document.notes && this.document.keputusan) {
      Swal.fire({
        title: 'Data Selesai Diverifikasi ?',
        html: `<p>Kamu sedang melakukan verifikasi data.</p><p>Pastikan data sudah sesuai.</p>`,
        iconHtml: `
            <svg width="168" height="169" viewBox="0 0 168 169" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50.9302 33.5682C28.3753 39.6905 10.5547 59.0362 5.34117 83.9035C1.45442 102.412 4.86775 121.501 31.0288 128.454C87.5767 143.48 148.672 138.491 156.013 108.48C163.354 78.4697 149.73 26.9936 117.385 23.8076C98.9681 21.9783 71.3225 28.0534 50.9302 33.5682Z" fill="#F5F6F8"/>
              <path d="M45.77 130.807C46.3137 134.118 49.4668 136.339 52.7676 135.737L112.725 124.798C115.945 124.211 118.099 121.152 117.569 117.923L106.032 47.6818L84.8277 32.8398L37.0849 41.5596C33.8662 42.1474 31.712 45.2056 32.2422 48.4343L45.77 130.807Z" fill="#172D6C"/>
              <path d="M45.0459 73.4131L83.4914 66.4023" stroke="#FCFCFC" stroke-width="3" stroke-linecap="round"/>
              <path d="M44.4404 57.3532L47.9784 59.4995L51.4534 50.3838" stroke="#FCFCFC" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M47.9473 94.5284L86.3849 87.5176" stroke="#FCFCFC" stroke-width="3" stroke-linecap="round"/>
              <path d="M50.8398 115.644L89.2853 108.633" stroke="#FCFCFC" stroke-width="3" stroke-linecap="round"/>
              <path d="M66.4785 25.2988C63.1648 25.2988 60.4785 27.9851 60.4785 31.2988V114.922C60.4785 118.236 63.1648 120.922 66.4785 120.922H127.313C130.626 120.922 133.313 118.236 133.313 114.922V43.7291L114.821 25.2988H66.4785Z" fill="#21409A"/>
              <path d="M60.4785 108.922C60.4785 115.55 65.8511 120.922 72.4785 120.922H121.313C127.94 120.922 133.313 115.55 133.313 108.922V43.7291L114.821 25.2988H72.4785C65.8511 25.2988 60.4785 30.6714 60.4785 37.2988V108.922Z" fill="url(#paint0_linear_1641_73735)" fill-opacity="0.23"/>
              <g filter="url(#filter0_d_1641_73735)">
                  <path d="M114.821 25.2988V40.7291C114.821 42.386 116.164 43.7291 117.821 43.7291H133.313L114.821 25.2988Z" fill="#A6B3D7"/>
              </g>
              <g filter="url(#filter1_d_1641_73735)">
                  <path d="M68.6162 25.2991V21.7522C68.6162 18.9238 70.7915 16.6309 73.475 16.6309V16.6309C74.7636 16.6309 75.9994 17.1704 76.9106 18.1309C77.8218 19.0913 78.3337 20.394 78.3337 21.7522V28.8625C78.3337 31.6909 76.1584 33.9838 73.475 33.9838V33.9838C72.1863 33.9838 70.9505 33.4443 70.0393 32.4838C69.1281 31.5234 68.6162 30.2207 68.6162 28.8625" stroke="#E9ECF5" stroke-width="2.36"/>
              </g>
              <g filter="url(#filter2_d_1641_73735)">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M96.0154 97.2382C85.8853 95.571 78.3846 86.4265 78.2833 75.62C78.1819 64.8134 85.5095 55.5144 95.6064 53.6363C105.703 51.7582 115.608 57.8518 119.022 68.0422C122.167 77.4303 118.953 87.7587 111.409 93.4094L114.053 98.4509C115.034 98.472 115.976 99.0097 116.467 99.9448L127.024 120.069C127.512 120.999 127.424 122.083 126.88 122.905L129.044 127.03C129.331 127.579 129.398 128.226 129.229 128.827C129.061 129.428 128.671 129.932 128.148 130.229C127.63 130.531 127.019 130.604 126.45 130.431C125.88 130.259 125.4 129.855 125.113 129.309L122.965 125.214C121.88 125.31 120.789 124.762 120.248 123.731L109.691 103.606C109.154 102.581 109.315 101.37 110.016 100.526L107.496 95.723C103.893 97.3485 99.9151 97.8817 96.0154 97.2382ZM101.818 57.8667C94.0866 56.5889 86.541 61.1008 83.6151 68.751C80.6892 76.4013 83.1563 85.1678 89.5666 89.8989C95.977 94.63 104.636 94.0751 110.456 88.5604C116.275 83.0457 117.717 74.0287 113.933 66.8084C111.423 62.0138 106.95 58.7126 101.818 57.8667ZM92.2181 70.6619C93.156 67.7154 96.0103 65.9478 98.9087 66.5184C100.171 66.867 101.228 67.7733 101.81 69.0045C102.187 69.654 102.376 70.406 102.352 71.1674C102.211 72.258 101.972 73.3319 101.637 74.3744C101.369 75.1727 101.236 76.014 101.244 76.8605C101.364 77.6664 101.631 78.4402 102.03 79.1394L100.167 80.2168C99.6854 79.372 99.3525 78.4429 99.1839 77.4738C99.1216 76.4147 99.2578 75.3531 99.5848 74.3496L99.9622 72.9988C100.082 72.6301 100.148 72.2446 100.159 71.8552C100.199 71.2532 100.074 70.6516 99.7971 70.1232C99.4602 69.4371 98.9029 68.8996 98.2247 68.6067C97.2705 68.3835 96.2714 68.6024 95.4805 69.2077C94.6897 69.8131 94.1831 70.7469 94.0892 71.7723C94.1548 72.6468 94.4017 73.4955 94.8125 74.2584L92.9492 75.2694C92.1432 73.8935 91.8807 72.2394 92.2181 70.6619ZM101.11 82.015L103.186 80.8051L104.389 83.1006L102.313 84.3105L101.11 82.015Z" fill="white"/>
              </g>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M155.751 18.5843C152.508 18.5953 149.883 21.3665 149.878 24.7847C149.88 23.1412 149.263 21.564 148.161 20.4009C147.059 19.2378 145.564 18.5842 144.005 18.5843C147.248 18.5732 149.873 15.802 149.878 12.3838C149.883 15.8004 152.51 18.5687 155.751 18.5742" fill="#00A79D"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M145.735 158.31C142.492 158.315 139.863 161.082 139.853 164.5C139.858 162.857 139.24 161.279 138.138 160.117C137.035 158.955 135.539 158.304 133.979 158.31C135.539 158.31 137.034 157.656 138.136 156.493C139.237 155.33 139.855 153.753 139.853 152.109C139.858 155.532 142.488 158.304 145.735 158.31Z" fill="#00A79D"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M22.2111 149.695C19.5575 149.701 17.4076 151.967 17.4024 154.764C17.4049 153.419 16.8991 152.128 15.9968 151.177C15.0944 150.226 13.8699 149.692 12.5938 149.695C13.8716 149.692 15.0961 149.155 15.9979 148.2C16.8997 147.246 17.4049 145.953 17.4024 144.606C17.4076 147.403 19.5575 149.669 22.2111 149.675" fill="#00A79D"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M89.941 8.44666C87.8768 8.44665 86.2019 10.2075 86.1967 12.3833C86.1992 11.3375 85.8069 10.3336 85.1062 9.5932C84.4055 8.85277 83.4541 8.43664 82.4619 8.43664C84.5224 8.43114 86.1915 6.67186 86.1967 4.5C86.2019 6.67577 87.8768 8.43665 89.941 8.43664" fill="#00A79D"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M159.496 113.765C157.428 113.765 155.751 115.532 155.751 117.711C155.754 116.666 155.362 115.662 154.661 114.921C153.96 114.181 153.009 113.765 152.017 113.765C154.079 113.765 155.751 112.002 155.751 109.828C155.757 112.004 157.431 113.765 159.496 113.765Z" fill="#00A79D"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M15.0931 73.2162C13.0305 73.2162 11.3584 74.9787 11.3584 77.1528C11.3584 74.9865 9.69782 73.2272 7.64258 73.2162C9.71049 73.2162 11.3869 71.4492 11.3869 69.2695C11.3869 71.4453 13.0574 73.2107 15.1216 73.2162" fill="#00A79D"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M32.1329 16.3303C29.4794 16.3358 27.3295 18.6018 27.3243 21.3988C27.3268 20.0537 26.821 18.763 25.9186 17.8119C25.0163 16.8608 23.7917 16.3276 22.5156 16.3303C23.7917 16.3329 25.0163 15.7998 25.9186 14.8487C26.821 13.8976 27.3268 12.6068 27.3243 11.2617C27.3295 14.0587 29.4794 16.3248 32.1329 16.3303Z" fill="#00A79D"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M145.487 51.3087H145.582L145.611 51.2886C145.884 51.286 146.111 51.0652 146.136 50.7781C146.16 50.4909 145.974 50.2309 145.706 50.1768C144.413 49.9263 143.045 49.716 141.638 49.5457C141.339 49.5014 141.063 49.7212 141.021 50.0365C140.979 50.3519 141.187 50.6434 141.486 50.6876C142.874 50.8579 144.214 51.0583 145.487 51.3087ZM153.422 53.6426C153.357 53.6569 153.289 53.6569 153.223 53.6426C151.981 53.1149 150.712 52.6601 149.422 52.2803C149.24 52.2284 149.098 52.0783 149.05 51.8866C149.002 51.6948 149.055 51.4905 149.188 51.3507C149.321 51.2108 149.516 51.1566 149.697 51.2085C151.031 51.5941 152.341 52.0624 153.622 52.6109C153.847 52.7181 153.973 52.9746 153.925 53.2301C153.878 53.4857 153.669 53.6732 153.422 53.6827V53.6426ZM159.837 58.1001C159.94 58.2091 160.081 58.2704 160.227 58.2704V58.2504C160.38 58.2652 160.532 58.2106 160.645 58.1001C160.852 57.8813 160.852 57.5276 160.645 57.3088C159.66 56.2442 158.548 55.3184 157.338 54.5542C157.091 54.391 156.766 54.4694 156.611 54.7295C156.456 54.9895 156.53 55.3325 156.777 55.4957C157.896 56.2268 158.924 57.1016 159.837 58.1001ZM163.458 66.915C163.166 66.9042 162.935 66.6517 162.935 66.3441V66.1137C162.94 64.8184 162.738 63.5315 162.337 62.3072C162.241 62.0268 162.137 61.7463 162.023 61.4758C161.908 61.1935 162.026 60.866 162.289 60.7346C162.419 60.6743 162.566 60.671 162.698 60.7255C162.83 60.7801 162.936 60.8879 162.992 61.0251L162.992 61.0257L162.993 61.0262C163.116 61.3263 163.239 61.6265 163.344 61.9366C163.784 63.2802 164.005 64.6924 164 66.1137V66.3641C163.981 66.6489 163.766 66.8756 163.496 66.895L163.458 66.915ZM161.025 75.0387C161.102 75.0787 161.186 75.0993 161.272 75.0988V75.0788C161.465 75.0828 161.643 74.975 161.738 74.7983C162.381 73.4968 162.909 72.1354 163.315 70.7315C163.357 70.588 163.342 70.4331 163.274 70.3014C163.206 70.1697 163.091 70.072 162.954 70.0303C162.674 69.9519 162.385 70.1196 162.299 70.4109C161.914 71.7496 161.411 73.0475 160.797 74.2875C160.665 74.5615 160.767 74.8964 161.025 75.0387ZM156.692 82.2008C156.57 82.1972 156.453 82.1515 156.359 82.0706C156.25 81.9751 156.182 81.8379 156.17 81.6895C156.157 81.541 156.202 81.3934 156.292 81.2793C157.186 80.1473 158.013 79.0154 158.735 77.9036C158.911 77.6813 159.218 77.6363 159.444 77.7998C159.671 77.9633 159.742 78.2816 159.609 78.5346C158.868 79.6766 158.022 80.8385 157.1 82.0005C156.995 82.1192 156.846 82.1848 156.692 82.1808V82.2008ZM150.657 88.221C150.757 88.3366 150.898 88.4021 151.047 88.4013V88.3812C151.157 88.3582 151.256 88.2985 151.332 88.211C152.368 87.2093 153.318 86.2076 154.268 85.2059C154.417 85.0662 154.479 84.851 154.429 84.6479C154.38 84.4448 154.227 84.2878 154.033 84.2408C153.839 84.1938 153.637 84.2647 153.508 84.4246C152.653 85.4263 151.674 86.4279 150.657 87.4296C150.45 87.6485 150.45 88.0021 150.657 88.221ZM144.803 93.9306C144.64 93.933 144.486 93.8552 144.385 93.7202C144.208 93.473 144.25 93.1218 144.48 92.9289C145.573 92.0474 146.637 91.1459 147.644 90.2544C147.789 90.1274 147.986 90.0911 148.163 90.1593C148.339 90.2275 148.468 90.3898 148.5 90.585C148.533 90.7803 148.464 90.9788 148.319 91.1058C147.302 92.0074 146.228 92.9189 145.126 93.8204C145.031 93.8884 144.917 93.9202 144.803 93.9106V93.9306ZM13.6389 98.3781C13.7405 98.475 13.8726 98.5286 14.0096 98.5284C14.1756 98.5571 14.3447 98.5014 14.4657 98.3781C15.3305 97.3764 16.2998 96.3747 17.3167 95.373C17.5233 95.1542 17.5233 94.8005 17.3167 94.5817C17.1091 94.3639 16.7736 94.3639 16.5659 94.5817C15.5396 95.5834 14.5893 96.5851 13.639 97.5867L13.6389 97.5868C13.4323 97.8056 13.4323 98.1593 13.6389 98.3781ZM138.179 98.9391C137.952 98.9364 137.753 98.7797 137.686 98.5513C137.619 98.3229 137.699 98.0748 137.885 97.9374C139.035 97.126 140.156 96.3046 141.22 95.5033C141.333 95.4134 141.475 95.3755 141.615 95.3982C141.755 95.4208 141.88 95.5021 141.962 95.6235C142.132 95.8753 142.076 96.2247 141.838 96.4048C140.764 97.2161 139.633 98.0476 138.474 98.8689C138.383 98.9168 138.281 98.9376 138.179 98.929V98.9391ZM130.819 103.135C130.88 103.356 131.063 103.515 131.28 103.537C131.367 103.562 131.458 103.566 131.546 103.547C132.734 102.796 133.903 102.044 135.043 101.293C135.306 101.127 135.391 100.768 135.233 100.492C135.076 100.215 134.735 100.125 134.473 100.291C133.342 101.043 132.192 101.794 131.004 102.535C130.832 102.676 130.758 102.914 130.819 103.135ZM8.86829 105.17C8.67154 105.171 8.49013 105.058 8.39661 104.875C8.30309 104.693 8.31271 104.471 8.42164 104.298C9.15339 103.156 9.98017 101.984 10.8925 100.812C11.0061 100.636 11.2044 100.543 11.4044 100.572C11.6045 100.601 11.7718 100.747 11.8365 100.948C11.9012 101.15 11.8521 101.373 11.7098 101.523C10.826 102.665 10.0182 103.807 9.30544 104.919C9.21174 105.078 9.04568 105.173 8.86829 105.17ZM123.77 107.33C123.824 107.549 123.997 107.712 124.209 107.744H124.162C124.259 107.772 124.363 107.765 124.457 107.724C125.679 107.043 126.877 106.352 128.049 105.65C128.306 105.501 128.399 105.16 128.258 104.889C128.109 104.626 127.791 104.534 127.536 104.679C126.367 105.37 125.169 106.061 123.962 106.742C123.792 106.879 123.716 107.111 123.77 107.33ZM5.21904 112.883C5.26296 112.892 5.30816 112.892 5.35208 112.883C5.58701 112.889 5.79697 112.729 5.86526 112.492C6.21786 111.144 6.69532 109.835 7.29075 108.585C7.38364 108.316 7.26894 108.016 7.02475 107.89C6.78057 107.764 6.48546 107.852 6.34042 108.095C5.71441 109.408 5.21459 110.783 4.84841 112.201C4.80792 112.344 4.82469 112.497 4.89478 112.626C4.96487 112.755 5.08212 112.848 5.21904 112.883ZM109.451 115.207C109.202 115.201 108.99 115.015 108.94 114.759C108.89 114.502 109.015 114.243 109.242 114.135C110.496 113.554 111.732 112.973 112.958 112.382C113.132 112.251 113.364 112.244 113.545 112.362C113.727 112.481 113.824 112.703 113.791 112.926C113.758 113.148 113.602 113.329 113.395 113.383C112.169 113.974 110.924 114.555 109.66 115.136C109.598 115.173 109.53 115.197 109.46 115.207H109.451ZM101.411 118.131C101.493 118.344 101.688 118.482 101.905 118.482H101.915C101.987 118.487 102.058 118.474 102.124 118.442C103.407 117.921 104.671 117.38 105.925 116.839C106.195 116.72 106.322 116.393 106.21 116.108C106.158 115.97 106.054 115.86 105.924 115.803C105.793 115.747 105.646 115.748 105.516 115.808C104.549 116.256 103.593 116.642 102.631 117.03L102.63 117.03L102.629 117.03C102.325 117.153 102.021 117.275 101.715 117.4C101.442 117.516 101.307 117.841 101.411 118.131ZM5.59917 121.317C5.38383 121.319 5.19027 121.179 5.1145 120.966L4.94344 120.505C4.52885 119.235 4.31066 117.902 4.29722 116.559C4.29206 116.409 4.34484 116.264 4.44342 116.156C4.54201 116.049 4.67792 115.988 4.8199 115.988C4.96087 115.98 5.09885 116.033 5.20135 116.135C5.30384 116.238 5.3618 116.38 5.36159 116.529C5.3749 117.75 5.57713 118.962 5.96029 120.115C5.96029 120.208 6.00253 120.302 6.04477 120.395C6.06588 120.442 6.087 120.489 6.10284 120.535C6.15844 120.672 6.15837 120.826 6.10266 120.963C6.04695 121.099 5.94049 121.206 5.80824 121.257C5.7465 121.291 5.67848 121.312 5.60867 121.317H5.59917ZM93.7552 121.009C93.7964 121.27 94.0047 121.465 94.2551 121.477H94.2646C94.3259 121.477 94.3868 121.467 94.4452 121.447C95.3917 121.099 96.3545 120.723 97.3131 120.349L97.3137 120.348L97.3149 120.348L97.3156 120.348L97.3159 120.347L97.3162 120.347L97.3165 120.347C97.6272 120.226 97.9374 120.105 98.2465 119.985C98.3788 119.933 98.4862 119.828 98.545 119.692C98.6038 119.557 98.6093 119.403 98.5601 119.263C98.513 119.125 98.4151 119.012 98.2883 118.949C98.1615 118.887 98.0164 118.881 97.8854 118.933L94.0841 120.395C93.851 120.493 93.714 120.748 93.7552 121.009ZM86.5195 124.192C86.2865 124.191 86.0799 124.034 86.0063 123.801C85.9198 123.505 86.0772 123.191 86.3579 123.1C87.6409 122.679 88.9333 122.238 90.2257 121.778C90.5062 121.685 90.8056 121.845 90.9005 122.138C90.9455 122.278 90.9356 122.43 90.8731 122.562C90.8107 122.694 90.7007 122.794 90.5679 122.839C89.2659 123.3 87.964 123.741 86.6715 124.172L86.5195 124.192ZM10.8925 127.738C10.7882 127.737 10.6862 127.706 10.5979 127.648C9.41663 126.84 8.34007 125.873 7.39529 124.773C7.26257 124.623 7.21743 124.41 7.27749 124.215C7.33756 124.021 7.49331 123.876 7.68393 123.838C7.87456 123.8 8.06985 123.874 8.19356 124.031C9.07565 125.06 10.0821 125.963 11.1871 126.716C11.4261 126.889 11.4894 127.232 11.3296 127.487C11.223 127.65 11.0409 127.738 10.8545 127.718L10.8925 127.738ZM70.3176 128.245C70.3485 128.52 70.5662 128.731 70.8296 128.739L70.9436 128.719C72.2646 128.409 73.5855 128.078 74.916 127.718C75.1992 127.639 75.3718 127.337 75.3056 127.036C75.2721 126.892 75.1846 126.768 75.0628 126.692C74.9411 126.617 74.7956 126.596 74.6594 126.636L74.2741 126.735L73.8948 126.832L73.8796 126.836C72.8152 127.109 71.7606 127.38 70.706 127.637C70.4518 127.711 70.2866 127.969 70.3176 128.245ZM62.8468 130.522C62.5929 130.523 62.374 130.334 62.3242 130.072C62.2964 129.927 62.325 129.776 62.4036 129.654C62.4823 129.531 62.6043 129.447 62.7423 129.42C64.0633 129.15 65.3937 128.87 66.7337 128.569C66.8712 128.537 67.0154 128.564 67.1334 128.645C67.2515 128.726 67.3336 128.854 67.3609 129C67.4196 129.301 67.2373 129.596 66.9522 129.661C65.6028 129.961 64.2628 130.252 62.9419 130.512L62.8468 130.522ZM18.1815 131.173H18.3335L18.2955 131.163C18.5414 131.192 18.7738 131.039 18.8562 130.793C18.8972 130.651 18.8819 130.497 18.8139 130.367C18.7459 130.237 18.631 130.141 18.4951 130.102C17.202 129.713 15.9325 129.241 14.6938 128.689C14.4261 128.57 14.1173 128.7 14.0001 128.98C13.8864 129.265 14.0086 129.593 14.2756 129.721C15.549 130.287 16.8532 130.772 18.1815 131.173ZM54.7976 131.935C54.5271 131.923 54.308 131.699 54.2885 131.415C54.2691 131.13 54.4554 130.875 54.7215 130.823C56.0425 130.623 57.3825 130.402 58.7414 130.172C58.8803 130.146 59.0233 130.18 59.1378 130.267C59.2523 130.354 59.3287 130.486 59.3496 130.633C59.3743 130.779 59.3417 130.93 59.2594 131.05C59.1771 131.171 59.052 131.252 58.9125 131.274C57.6825 131.491 56.4603 131.684 55.253 131.875L54.8736 131.935H54.7976ZM26.2213 132.836H26.2878V132.826C26.5499 132.826 26.774 132.627 26.82 132.355C26.8534 132.049 26.6453 131.771 26.3543 131.734C24.9763 131.554 23.6269 131.334 22.3629 131.073C22.0753 131.018 21.7976 131.213 21.7357 131.514C21.6834 131.82 21.8736 132.115 22.1634 132.175C23.4558 132.436 24.8243 132.656 26.2213 132.836ZM46.6533 132.926C46.3594 132.926 46.1211 132.675 46.1211 132.365C46.1211 132.056 46.3594 131.805 46.6533 131.805C47.9837 131.684 49.3427 131.534 50.7017 131.374C50.8409 131.354 50.9818 131.395 51.0914 131.488C51.2009 131.581 51.2696 131.717 51.2814 131.865C51.3148 132.171 51.1067 132.449 50.8157 132.486C49.4567 132.646 48.0883 132.796 46.7483 132.916L46.6533 132.926ZM30.3267 133.217C31.6381 133.307 33.0256 133.397 34.4321 133.397H34.4511C34.7152 133.36 34.9123 133.122 34.9123 132.841C34.9123 132.56 34.7152 132.323 34.4511 132.285C33.0541 132.255 31.6951 132.195 30.3932 132.105C30.1239 132.121 29.9083 132.346 29.8914 132.63C29.8744 132.913 30.0614 133.166 30.3267 133.217ZM37.9768 132.856C37.987 133.158 38.2223 133.397 38.509 133.397H38.5185C39.8489 133.367 41.2269 133.317 42.6144 133.227C42.754 133.222 42.8856 133.157 42.9789 133.047C43.0722 132.938 43.119 132.793 43.1086 132.646C43.1092 132.496 43.0497 132.353 42.9446 132.252C42.8396 132.151 42.699 132.101 42.5574 132.115L42.1084 132.141C40.8825 132.214 39.6684 132.285 38.4995 132.285C38.3575 132.285 38.2216 132.346 38.123 132.454C38.0244 132.561 37.9716 132.707 37.9768 132.856ZM78.1851 126.165C78.2492 126.408 78.4591 126.576 78.6983 126.576L78.8408 126.556C80.0172 126.221 81.2013 125.861 82.3932 125.5L82.3936 125.499L82.394 125.499L82.3943 125.499L82.3947 125.499L82.3951 125.499L82.3954 125.499L82.3958 125.499L82.7752 125.384C83.0559 125.292 83.2133 124.978 83.1268 124.683C83.0873 124.541 82.9957 124.422 82.8724 124.353C82.7492 124.283 82.6047 124.268 82.4711 124.312C81.1596 124.713 79.8577 125.103 78.5557 125.474C78.4196 125.514 78.304 125.609 78.2345 125.738C78.1649 125.868 78.1472 126.022 78.1851 126.165ZM116.93 111.63C116.686 111.625 116.476 111.445 116.422 111.194C116.368 110.942 116.484 110.685 116.702 110.569C117.937 109.938 119.154 109.307 120.351 108.665C120.522 108.561 120.734 108.566 120.901 108.677C121.068 108.789 121.163 108.988 121.147 109.196C121.132 109.404 121.008 109.585 120.826 109.667C119.629 110.308 118.403 110.939 117.158 111.57C117.088 111.609 117.009 111.63 116.93 111.63Z" fill="#00A79D"/>
              <path d="M22.6867 89.0225C21.6319 89.8839 20.6055 90.7654 19.6172 91.6469C19.3972 91.845 19.3677 92.192 19.5507 92.4282C19.6536 92.5533 19.8022 92.6262 19.9593 92.6285C20.0848 92.6316 20.2068 92.5851 20.3014 92.4983C21.1377 91.7471 22.0025 91.0058 22.8863 90.2746L22.6867 89.0225Z" fill="#00A79D"/>
              <defs>
                  <filter id="filter0_d_1641_73735" x="112.821" y="24.2988" width="26.4912" height="26.4307" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                      <feOffset dx="2" dy="3"/>
                      <feGaussianBlur stdDeviation="2"/>
                      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.44 0"/>
                      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1641_73735"/>
                      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1641_73735" result="shape"/>
                  </filter>
                  <filter id="filter1_d_1641_73735" x="65.4365" y="15.4512" width="16.0771" height="23.7129" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                      <feOffset dy="2"/>
                      <feGaussianBlur stdDeviation="1"/>
                      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.364511 0"/>
                      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1641_73735"/>
                      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1641_73735" result="shape"/>
                  </filter>
                  <filter id="filter2_d_1641_73735" x="71.2822" y="53.2979" width="59.0381" height="86.2256" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                      <feOffset dx="-3" dy="5"/>
                      <feGaussianBlur stdDeviation="2"/>
                      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.24 0"/>
                      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1641_73735"/>
                      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1641_73735" result="shape"/>
                  </filter>
                  <linearGradient id="paint0_linear_1641_73735" x1="117.116" y1="95.2142" x2="154.352" y2="58.3263" gradientUnits="userSpaceOnUse">
                      <stop stop-color="#010101" stop-opacity="0.01"/>
                      <stop offset="1" stop-color="#010101"/>
                  </linearGradient>
              </defs>
          </svg>
        `,
        showCancelButton: true,
        confirmButtonColor: '#21409A',
        cancelButtonColor: '#CC1D15',
        confirmButtonText: 'Ya, Simpan',
        cancelButtonText: 'Batal'
      }).then((result) => {
        if (!result.value) {
          return false;
        }
        if (this.document.keputusan === 'Diterima') {
          if (this.document.doc_name == undefined || this.document.doc_name == '') {
            return this.alertError('Data Nama Lengkap harus diisi');
          } else if (this.document.nik == undefined || this.document.nik == '') {
            return this.alertError('Data NIK harus diisi');
          // } else if (this.document.no_kk == undefined || this.document.no_kk == '') {
          //   return this.alertError('Data No. KK harus diisi');
          } else if (this.document.email == undefined || this.document.email == '') {
            return this.alertError('Data Email harus diisi');
          } else if (this.document.phone == undefined || this.document.phone == '') {
            return this.alertError('Data No. HP harus diisi');
          } else if (this.document.doc_dob == undefined || this.document.doc_dob == '') {
            return this.alertError('Data Tanggal Lahir harus diisi');
          } else if (this.document.doc_pob == undefined || this.document.doc_pob == '') {
            return this.alertError('Data Tempat Lahir harus diisi');
          } else if (this.document.doc_gender == undefined || this.document.doc_gender == '') {
            return this.alertError('Data Jenis Kelamin harus diisi');
          // } else if (this.document.status_keluarga == undefined || this.document.status_keluarga == '') {
          //   return this.alertError('Data Status Keluarga harus diisi');
          }else if (this.document.doc_blood == undefined || this.document.doc_blood == '') {
            return this.alertError('Data Golongan Darah harus diisi');
          } else if (this.document.doc_address == undefined || this.document.doc_address == '') {
            return this.alertError('Data Alamat harus diisi');
          } else if (this.document.doc_religion == undefined || this.document.doc_religion == '') {
            return this.alertError('Data Agama harus diisi');
          } else if (this.document.doc_nationality == undefined || this.document.doc_nationality == '') {
            return this.alertError('Data Kewarganegaraan harus diisi');
          } else if (this.document.doc_kecamatan == undefined || this.document.doc_kecamatan == '') {
            return this.alertError('Data Kecamatan harus diisi');
          } else if (this.document.doc_kel_desa == undefined || this.document.doc_kel_desa == '') {
            return this.alertError('Data Kelurahan harus diisi');
          } else if (this.document.rt == undefined || this.document.rt == '') {
            return this.alertError('Data RT harus diisi');
          } else if (this.document.rw == undefined || this.document.rw == '') {
            return this.alertError('Data RW harus diisi');
          } else if (this.document.doc_profession == undefined || this.document.doc_profession == '') {
            return this.alertError('Data Pekerjaan harus diisi');
          } else if (this.document.doc_marital == undefined || this.document.doc_marital == '') {
            return this.alertError('Data Status Kawin harus diisi');
          } else if (this.document.kotamadya_kab == undefined || this.document.kotamadya_kab == '' || this.document.kotamadya_kab === null) {
            return this.alertError('Data Kota / Kabupaten harus diisi');
          } else if (this.document.provinsi == undefined || this.document.provinsi == '' || this.document.provinsi === null) {
            return this.alertError('Data Provinsi harus diisi');
          } else if (this.document.doc_pict_cropping == undefined || this.document.doc_pict_cropping == '') {
            return this.alertError('Foto Cropping KTP harus diisi');
          // } else if (this.document.doc_height == undefined || this.document.doc_height == '') {
          //   return this.alertError('Data Tinggi Badan harus diisi');
          // } else if (this.document.doc_weight == undefined || this.document.doc_weight == '') {
          //   return this.alertError('Data Berat Badan harus diisi');
          }
        }
        const doc = this.prepareDoc();
        doc.NIK = doc.Nik;
        doc.NoKK = doc.NoKk;
        doc.DocDoB = doc.DocDob;
        doc.DocPoB = doc.DocPob;
        // doc.DocMarital = doc.StatusKawin;
        doc.DocRtRw = (this.document.rt == undefined ? '-' : this.document.rt) + '/' + (this.document.rw == undefined ? '-' : this.document.rw);
        doc.rt = this.document.rt == undefined ? '' : this.document.rt;
        doc.rw = this.document.rw == undefined ? '' : this.document.rw;
        doc.DocIssuer = (doc.Provinsi == undefined ? '-' : 'PROVINSI ' + doc.Provinsi) + ', ' + (doc.KotamadyaKab == undefined ? '-' : doc.KotamadyaKab);
        doc.DocAdjId = this.document.id;
        if (this.document.keputusan === 'Anomali') {
          // doc.DocAdjStatus = 6;
          doc.DocAdjStatus = 8;
          doc.DocAdjValidatedBy = this.profile.Fullname;
          const date = new Date();
          doc.DocAdjValidatedDate = date.toISOString();
        } else if (this.document.keputusan === 'Diterima') {
          doc.DocAdjStatus = 2;
          doc.DocAdjValidatedBy = this.profile.Fullname;
          const date = new Date();
          doc.DocAdjValidatedDate = date.toISOString();
        } else if (this.document.keputusan === 'Ditolak') {
          // doc.DocAdjStatus = 5;
          doc.DocAdjStatus = 7;
          doc.DocAdjValidatedBy = this.profile.Fullname;
          const date = new Date();
          doc.DocAdjValidatedDate = date.toISOString();
        }

        if (this.isOperator) {
          doc.docPictCropping = this.cropImgPreview.substr(22);
        }

        doc.DocDoB = doc.DocDoB.split('T')[0];
        doc.DocDob = doc.DocDob.split('T')[0];
        doc.DocExpired = doc.DocExpired.split('T')[0];
        doc.DocIssueDate = doc.DocIssueDate.split('T')[0];
        doc.AdjStatus = doc.AdjStatus == undefined ? 0 : doc.AdjStatus;
        doc.DeletedDate = doc.DeletedDate == undefined ? null : doc.DeletedDate;
        doc.DocAddress = doc.DocAddress == undefined ? '' : doc.DocAddress;
        doc.DocBlood = doc.DocBlood == undefined ? '' : doc.DocBlood;
        doc.DocCompany = doc.DocCompany == undefined ? '' : doc.DocCompany;
        doc.DocDepartment = doc.DocDepartment == undefined ? '' : doc.DocDepartment;
        doc.DocEmail = doc.DocEmail == undefined ? '' : doc.DocEmail;
        doc.DocInterNo = doc.DocInterNo == undefined ? '' : doc.DocInterNo;
        doc.DocInterType = doc.DocInterType == undefined ? '' : doc.DocInterType;
        doc.DocIssuerConfirm = doc.DocIssuerConfirm == undefined ? 0 : doc.DocIssuerConfirm;
        doc.DocKecamatan = doc.DocKecamatan == undefined ? '' : doc.DocKecamatan;
        doc.DocKelDesa = doc.DocKelDesa == undefined ? '' : doc.DocKelDesa;
        doc.DocPhoneNo = doc.DocPhoneNo == undefined ? '' : doc.DocPhoneNo;
        doc.DocPoB = doc.DocPoB == undefined ? '' : doc.DocPoB;
        doc.DocPob = doc.DocPob == undefined ? '' : doc.DocPob;
        doc.DocProfession = doc.DocProfession == undefined ? '' : doc.DocProfession;
        doc.DocQR = doc.DocQR == undefined ? '' : doc.DocQR;
        doc.KotamadyaKab = doc.KotamadyaKab == undefined ? '' : doc.KotamadyaKab;
        doc.DocMarital = doc.DocMarital == undefined ? 'Belum Kawin' : doc.DocMarital;
        doc.Provinsi = doc.Provinsi == undefined ? '' : doc.Provinsi;

        doc.SecurityStamp = doc.SecurityStamp == undefined ? '' : doc.SecurityStamp;
        doc.Status = doc.Status == undefined ? '' : doc.Status;
        doc.StatusKawin = doc.DocMarital == undefined ? 'Belum Kawin' : doc.DocMarital;
        doc.TglCerai = doc.TglCerai == undefined ? '' : doc.TglCerai;
        doc.TglKawin = doc.TglKawin == undefined ? '' : doc.TglKawin;
        doc.UpdatedDate = doc.UpdatedDate == undefined ? null : doc.UpdatedDate;

        const date = new Date();
        if (this.document.created_date) {
          if (!this.document.created_date.includes('T')) {
            doc.CreatedDate = this.document.created_date + 'T00:00:00.000Z';
          } else {
            doc.CreatedDate = this.document.created_date;
          }
        } else {
          doc.CreatedDate = date.toISOString();
        }
        this.sendData(doc);
        return
      });
    }
  }

  sendData(doc : any) {
    this.digitalIdService.validateDocument(doc).subscribe((res: any) => {
      if (res.status_code === 200) {
        this.landaService.alertSuccess('Success', res.message);
        this.router.navigate(['/adjudicator/digital-id/ktp']).then();
      } else {
        this.landaService.alertError('Error', res.message);
      }
    }, (err: any) => {
      this.landaService.alertError('Error', err.error.message);
    });
  }

  prepareDoc() {
    const keys = Object.keys(this.document);
    const doc: any = {};
    keys.forEach((key: string) => {
      doc[this.transformText(key)] = this.document[key];
    });
    return doc;
  }

  transformText(text: string) {
    const temp = text.split('_');
    let result = '';
    temp.forEach((st: string) => {
      result += st.charAt(0).toUpperCase() + st.substring(1);
    });
    return result;
  }

  setComponentData() {
    this.genderOptions = [
      { value: 'Male', label: 'Male' },
      { value: 'Female', label: 'Female' }
    ];

    this.religionOptions = [
      { value: 'Budha', label: 'Budha' },
      { value: 'Islam', label: 'Islam' },
      { value: 'Hindu', label: 'Hindu' },
      { value: 'Katholik', label: 'Katholik' },
      { value: 'Khonghucu', label: 'Khonghucu' },
      { value: 'Kristen', label: 'Kristen' },
      { value: 'Other', label: 'Other' },
    ];

    this.bloodOptions = [
      { value: '-', label: '-' },
      { value: 'A', label: 'A' },
      { value: 'B', label: 'B' },
      { value: 'AB', label: 'AB' },
      { value: 'O', label: 'O' },
    ];

    this.statusKeluargaOptions = [
      { value: 'Kepala Keluarga', label: 'Kepala Keluarga' },
      { value: 'Suami', label: 'Suami' },
      { value: 'Istri', label: 'Istri' },
      { value: 'Anak', label: 'Anak' },
      { value: 'Menantu', label: 'Menantu' },
      { value: 'Cucu', label: 'Cucu' },
      { value: 'Orang Tua', label: 'Orang Tua' },
      { value: 'Mertua', label: 'Mertua' },
      { value: 'Famili Lain', label: 'Famili Lain' },
      { value: 'Pembantu', label: 'Pembantu' },
      { value: 'Lainnya', label: 'Lainnya' },
    ];

    this.statusKawinOptions = [
      { value: 'Belum Kawin', label: 'Belum Kawin' },
      { value: 'Kawin', label: 'Kawin' },
      { value: 'Cerai Hidup', label: 'Cerai Hidup' },
      { value: 'Cerai Mati', label: 'Cerai Mati' },
    ];

    this.pendidikanAkhirOptions = [
      { value: 'Tidak / Belum Sekolah', label: 'Tidak / Belum Sekolah' },
      { value: 'Belum Tamat SD / Sederajat', label: 'Belum Tamat SD / Sederajat' },
      { value: 'Tamat SD / Sederajat', label: 'Tamat SD / Sederajat' },
      { value: 'SLTP / Sederajat', label: 'SLTP / Sederajat' },
      { value: 'SLTA / Sederajat', label: 'SLTA / Sederajat' },
      { value: 'Diploma I / II', label: 'Diploma I / II' },
      { value: 'Akademi / Diploma III / Sarjana Muda', label: 'Akademi / Diploma III / Sarjana Muda' },
      { value: 'Diploma IV / Strata-I', label: 'Diploma IV / Strata-I' },
      { value: 'Strata-II', label: 'Strata-II' },
      { value: 'Strata-III', label: 'Strata-III' },
    ];

    this.pekerjaanOptions = [
      { label: 'Belum / Tidak Bekerja', value: 'Belum / Tidak Bekerja' },
      { label: 'Mengurus Rumah Tangga', value: 'Mengurus Rumah Tangga' },
      { label: 'Pelajar / Mahasiswa', value: 'Pelajar / Mahasiswa' },
      { label: 'Pensiunan', value: 'Pensiunan' },
      { label: 'Pegawai Negeri Sipil', value: 'Pegawai Negeri Sipil' },
      { label: 'Tentara Nasional Indonesia', value: 'Tentara Nasional Indonesia' },
      { label: 'Kepolisian RI', value: 'Kepolisian RI' },
      { label: 'Perdagangan', value: 'Perdagangan' },
      { label: 'Petani / Pekebun', value: 'Petani / Pekebun' },
      { label: 'Peternak', value: 'Peternak' },
      { label: 'Nelayan / Perikanan', value: 'Nelayan / Perikanan' },
      { label: 'Industri', value: 'Industri' },
      { label: 'Konstruksi', value: 'Konstruksi' },
      { label: 'Transportasi', value: 'Transportasi' },
      { label: 'Karyawan Swasta', value: 'Karyawan Swasta' },
      { label: 'Karyawan BUMN', value: 'Karyawan BUMN' },
      { label: 'Karyawan BUMD', value: 'Karyawan BUMD' },
      { label: 'Karyawan Honorer', value: 'Karyawan Honorer' },
      { label: 'Buruh Harian Lepas', value: 'Buruh Harian Lepas' },
      { label: 'Buruh Tani / Perkebunan', value: 'Buruh Tani / Perkebunan' },
      { label: 'Buruh Nelayan / Perikanan', value: 'Buruh Nelayan / Perikanan' },
      { label: 'Buruh Peternakan', value: 'Buruh Peternakan' },
      { label: 'Pembantu Rumah Tangga', value: 'Pembantu Rumah Tangga' },
      { label: 'Tukang Cukur', value: 'Tukang Cukur' },
      { label: 'Tukang Listrik', value: 'Tukang Listrik' },
      { label: 'Tukang Batu', value: 'Tukang Batu' },
      { label: 'Tukang Kayu', value: 'Tukang Kayu' },
      { label: 'Tukang Sol Sepatu', value: 'Tukang Sol Sepatu' },
      { label: 'Tukang Las / Pandai Besi', value: 'Tukang Las / Pandai Besi' },
      { label: 'Tukang Jahit ', value: 'Tukang Jahit ' },
      { label: 'Penata Rambut', value: 'Penata Rambut' },
      { label: 'Penata Rias', value: 'Penata Rias' },
      { label: 'Penata Busana', value: 'Penata Busana' },
      { label: 'Mekanik', value: 'Mekanik' },
      { label: 'Tukang Gigi', value: 'Tukang Gigi' },
      { label: 'Seniman', value: 'Seniman' },
      { label: 'Tabib', value: 'Tabib' },
      { label: 'Paraji', value: 'Paraji' },
      { label: 'Perancang Busana', value: 'Perancang Busana' },
      { label: 'Penterjemah', value: 'Penterjemah' },
      { label: 'Imam Masjid', value: 'Imam Masjid' },
      { label: 'Pendeta', value: 'Pendeta' },
      { label: 'Pastur', value: 'Pastur' },
      { label: 'Wartawan', value: 'Wartawan' },
      { label: 'Ustadz / Mubaligh', value: 'Ustadz / Mubaligh' },
      { label: 'Juru Masak', value: 'Juru Masak' },
      { label: 'Promotor Acara', value: 'Promotor Acara' },
      { label: 'Anggota Dpe-RI', value: 'Anggota Dpe-RI' },
      { label: 'Anggota DPD', value: 'Anggota DPD' },
      { label: 'Anggota BPK', value: 'Anggota BPK' },
      { label: 'Presiden', value: 'Presiden' },
      { label: 'Wakil Presiden', value: 'Wakil Presiden' },
      { label: 'Anggota MahkamahKonstitusi', value: 'Anggota MahkamahKonstitusi' },
      { label: 'Anggota Kabinet /Kementerian', value: 'Anggota Kabinet /Kementerian' },
      { label: 'Duta Besar', value: 'Duta Besar' },
      { label: 'Gubernur', value: 'Gubernur' },
      { label: 'Wakil Gubernur', value: 'Wakil Gubernur' },
      { label: 'Bupati', value: 'Bupati' },
      { label: 'Wakil Bupati', value: 'Wakil Bupati' },
      { label: 'Walikota', value: 'Walikota' },
      { label: 'Wakil Walikota', value: 'Wakil Walikota' },
      { label: 'Anggota DPRD Propinsi', value: 'Anggota DPRD Propinsi' },
      { label: 'Anggota DPRD Kabupaten/ Kota', value: 'Anggota DPRD Kabupaten/ Kota' },
      { label: 'Dosen', value: 'Dosen' },
      { label: 'Guru', value: 'Guru' },
      { label: 'Pilot', value: 'Pilot' },
      { label: 'Pengacara', value: 'Pengacara' },
      { label: 'Notaris', value: 'Notaris' },
      { label: 'Arsitek', value: 'Arsitek' },
      { label: 'Akuntan', value: 'Akuntan' },
      { label: 'Konsultan', value: 'Konsultan' },
      { label: 'Dokter', value: 'Dokter' },
      { label: 'Bidan', value: 'Bidan' },
      { label: 'Perawat', value: 'Perawat' },
      { label: 'Apoteker', value: 'Apoteker' },
      { label: 'Psikiater / Psikolog', value: 'Psikiater / Psikolog' },
      { label: 'Penyiar Televisi', value: 'Penyiar Televisi' },
      { label: 'Penyiar Radio', value: 'Penyiar Radio' },
      { label: 'Pelaut', value: 'Pelaut' },
      { label: 'Peneliti', value: 'Peneliti' },
      { label: 'Sopir', value: 'Sopir' },
      { label: 'Pialang', value: 'Pialang' },
      { label: 'Paranormal', value: 'Paranormal' },
      { label: 'Pedagang', value: 'Pedagang' },
      { label: 'Perangkat Desa', value: 'Perangkat Desa' },
      { label: 'Kepala Desa', value: 'Kepala Desa' },
      { label: 'Biarawati', value: 'Biarawati' },
    ];

    this.listViewInfo = {
      'Informasi Permohonan': [
        { label: 'Status', bind: 'adj_status', type: 'status' },
        { label: 'Diverifikasi Oleh', bind: 'adj_validate_by', type: 'text' },
        { label: 'Tgl. Divalidasi', bind: 'doc_adj_approved_date', type: 'date' },
      ],
      'Detail Identitas': [
        { isEdit: false, label: 'NIK', bind: 'nik', required: true },
        { isEdit: false, label: 'No. KK', bind: 'no_kk'},
        // { isEdit: false, label: 'Email', bind: 'doc_email', required: true },
        // { isEdit: false, label: 'No. HP', bind: 'doc_phone_no', required: true },
        { isEdit: false, label: 'Nama Lengkap', bind: 'doc_name', required: true },
        { isEdit: false, label: 'Tempat Lahir', bind: 'doc_pob', required: true },
        { isEdit: false, label: 'Tgl. Lahir', bind: 'doc_dob', type: 'date', required: true },
        { isEdit: false, label: 'Jenis Kelamin', bind: 'doc_gender', type: 'dropdown', options: this.genderOptions, required: true },
        { isEdit: false, label: 'Status Keluarga', bind: 'status_keluarga', type: 'dropdown', options: this.statusKeluargaOptions},
        { isEdit: false, label: 'Agama', bind: 'doc_religion', type: 'dropdown', options: this.religionOptions, required: true },
        { isEdit: false, label: 'Status Kawin', bind: 'doc_marital', type: 'dropdown', options: this.statusKawinOptions, required: true },
        { isEdit: false, label: 'Pend. Akhir', bind: 'pendidikan_terakhir', type: 'dropdown', options: this.pendidikanAkhirOptions },
        { isEdit: false, label: 'Pekerjaan', bind: 'doc_profession', type: 'dropdown', options: this.pekerjaanOptions, required: true },
        { isEdit: false, label: 'Gol. Darah', bind: 'doc_blood', type: 'dropdown', options: this.bloodOptions, required: true },
        { isEdit: false, label: 'Alamat', bind: 'doc_address', required: true },
        { isEdit: false, label: 'RT', bind: 'rt', required: true },
        { isEdit: false, label: 'RW', bind: 'rw', required: true },
        { isEdit: false, label: 'Dusun', bind: 'dusun' },
        { isEdit: false, label: 'Kelurahan', bind: 'doc_kel_desa', type: 'dropdown', options: this.kelurahanOptions, required: true },
        { isEdit: false, label: 'Kecamatan', bind: 'doc_kecamatan', type: 'dropdown', options: this.kecamatanOptions, required: true },
        { isEdit: false, label: 'Kota / Kab', bind: 'kotamadya_kab', type: 'dropdown', options: this.kotaKabOptions, required: true },
        { isEdit: false, label: 'Provinsi', bind: 'provinsi', type: 'dropdown', options: this.provinsiOptions, required: true },
        { isEdit: false, label: 'Kode Pos', bind: 'kode_pos' },
        // { isEdit: false, label: 'Tinggi Badan', bind: 'doc_height', required: true },
        // { isEdit: false, label: 'Berat Badan', bind: 'doc_weight', required: true },
        { isEdit: false, label: 'No. Akta Lahir', bind: 'no_akta_lahir' },
        { isEdit: false, label: 'No. Akta Kawin', bind: 'no_akta_kawin' },
        { isEdit: false, label: 'Tgl. Kawin', bind: 'tgl_kawin', type: 'date' },
        { isEdit: false, label: 'No. Akta Cerai', bind: 'no_akta_cerai' },
        { isEdit: false, label: 'NIK Ayah', bind: 'nik_ayah' },
        { isEdit: false, label: 'Nama Ayah', bind: 'nama_ayah' },
        { isEdit: false, label: 'NIK Ibu', bind: 'nik_ibu' },
        { isEdit: false, label: 'Nama Ibu', bind: 'nama_ibu' },
      ],
    };

    if (this.isOperator) {
      delete this.listViewInfo['Informasi Permohonan'];
    }

    this.isFaceDetected = {
      label: 'Foto wajah sudah terdeteksi?',
      bind: 'is_face_detected',
    };

    this.listVerifikasi = [
      { label: 'Data KTP dan Kartu Fisik KTP sesuai?', bind: 'doc_adj_key1_status' },
      { label: 'Foto wajah dan foto pada kartu fisik KTP sesuai?', bind: 'doc_adj_key2_status' },
      { label: 'Adjudikasi secara manual?', bind: 'doc_adj_key3_status' },
    ];

    this.listCatatan = [
      { label: 'Dari Operator', bind: 'notes' },
      { label: 'Dari Supervisor', bind: 'catatan_supervisor' }
    ];

    this.listKeputusan = [
      { label: 'Anomali' },
      { label: 'Diterima' },
      { label: 'Ditolak' }
    ];

    if (this.isSupervisor) { this.listKeputusan.push({ label: 'Kirim Kembali' }); }
  }

  getDocument() {
    this.digitalIdService.getDocumentById(this.id).subscribe((res: any) => {
      if (res.status === 'success') {
        this.document = res.data;
        this.docName = this.document.doc_name.split(' ')[0];
        this.srcImg = this.document.doc_pict_secondary;
        this.document.keputusan = null;
        this.document.catatan_supervisor = '';
        this.phone = this.document.phone;
        if (this.document.doc_rt_rw) {
          this.document.rt = this.document.doc_rt_rw.split('/')[0];
          this.document.rw = this.document.doc_rt_rw.split('/')[1];
        }
        // if (this.document.email) {
        //   this.document.doc_email = this.document.email
        // }
        // if (this.document.phone){
        //   this.document.doc_phone_no = this.document.phone
        // }
        this.getBase64FromUrl();
      }
    });
  }

  getKeyObject(object : any) {
    return Object.keys(object);
  }

  searchNgSelect(event : any, row : any) {
    if (row.bind === 'doc_kel_desa') {
      this.searchKelurahan(event, row);
    } else if (row.bind === 'doc_kecamatan') {
      this.searchKecamatan(event, row);
    } else if (row.bind === 'kotamadya_kab') {
      this.searchKabupaten(event, row);
    } else if (row.bind === 'provinsi') {
      this.searchProvinsi(event, row);
    }
  }

  searchKelurahan(event : any, row : any) {
    this.wilayahService.getKelurahan(event.term).subscribe((res: any) => {
      this.kelurahanOptions = [];
      res.response.data.forEach((element: any) => {
        this.kelurahanOptions.push({ value: element.nama, label: element.nama });
      });
      row.options = this.kelurahanOptions;
    });
  }

  searchKecamatan(event : any, row : any) {
    this.wilayahService.getKecamatan(event.term).subscribe((res: any) => {
      this.kecamatanOptions = [];
      res.response.data.forEach((element: any) => {
        this.kecamatanOptions.push({ value: element.nama, label: element.nama });
      });
      row.options = this.kecamatanOptions;
    });
  }

  searchKabupaten(event : any, row : any) {
    this.wilayahService.getKabupaten(event.term).subscribe((res: any) => {
      this.kotaKabOptions = [];
      res.response.data.forEach((element: any) => {
        this.kotaKabOptions.push({ value: element.nama, label: element.nama });
      });
      row.options = this.kotaKabOptions;
    });
  }

  searchProvinsi(event : any, row : any) {
    this.wilayahService.getProvinsi(event.term).subscribe((res: any) => {
      this.provinsiOptions = [];
      res.response.data.forEach((element: any) => {
        this.provinsiOptions.push({ value: element.nama, label: element.nama });
        return this.provinsiOptions;
      });
      row.options = this.provinsiOptions;
    });
  }
}
