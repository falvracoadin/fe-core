import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// //import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl } from '@angular/forms';
import { DecryptionService } from 'src/app/core/services/decryption.service';
import { AuthService } from 'src/app/feature/auth/services/auth.service';

import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-detail-user',
  templateUrl: './detail-user.component.html',
  styleUrls: ['./detail-user.component.scss']
})
export class DetailUserComponent implements OnInit {
  saasMode = false;
  roleUser: any;
  generalForm : any = new FormGroup({
    Fullname: new FormControl(''),
    Username: new FormControl(''),
    Phone: new FormControl(''),
    Email: new FormControl(''),
    Status: new FormControl('')
  });

  socialForm :any = new FormGroup({
    instagram: new FormControl(''),
    facebook: new FormControl(''),
    twitter: new FormControl(''),
    line: new FormControl(''),
    reason: new FormControl('')
  });

  id: any = "";
  active = 'general';
  titleModal = '';

  user: any;

  status: {
    id: string,
    name: string,
  }[] = [
      { id: 'active', name: 'Active' },
      { id: 'not-active', name: 'Inactive' },
      // { id: 'blacklist', name: 'Blacklist' },
      // { id: 'suspend', name: 'Suspend' },
      // { id: 'expired', name: 'Expired' },
      // { id: 'paid', name: 'Paid' },
      // { id: 'other', name: 'Other' },
    ];

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    // //private modalService: NgbModal,
    private decryptionService: DecryptionService,
    private authService: AuthService
  ) {
    this.id = route.snapshot.params['id'];
  }

  ngOnInit(): void {
    if (this.decryptionService.GrabEnvironmentKey('mode') === 'saas') {
      this.saasMode = true
    } else {
      this.saasMode = false
    }
    this.roleUser = this.authService.getUserRole();
    this.id = this.route.snapshot.paramMap.get('id');
    this.getUser();
  }

  getUser() {
    this.userService.getUserById(this.id).subscribe((res: any) => {
      if (res.code === 200) {
        this.user = res.data;
        this.generalForm.patchValue({
            Fullname: this.user.Fullname,
            Username: this.user.Username,
            Phone: this.user.Phone,
            Email: this.user.Email,
            Status: this.user.Status,
        });
      }
    });
  }

  goingBack() {
    window.history.back();
  }

  openEditModal(content : any, title: string) {
    this.titleModal = title;
    // this.modalService.open(content, { size: 'lg', centered: true });
  }

  openModal(content : any) {
    this.titleModal = 'Activity Log - ' + this.user.Fullname;
    // this.modalService.open(content, { size: 'lg', centered: true });
  }

  resetForm() {
    this.generalForm.reset();
    this.socialForm.reset();
  }

  saveGeneral() {
    this.generalForm.value.Id = parseInt(this.id, 10) || null;
    this.generalForm.value.ClientId = this.user.ClientId || null;
    this.generalForm.value.DeviceId = this.user.DeviceId || null;
    this.generalForm.value.DeviceType = this.user.DeviceType || null;
    this.generalForm.value.EmailConfirmed = this.user.EmailConfirmed || null;
    this.generalForm.value.InstallId = this.user.InstallId || null;
    this.generalForm.value.NIK = this.user.NIK || null;
    this.generalForm.value.PhoneConfirmed = this.user.PhoneConfirmed || null;
    // this.generalForm.value.Username = this.user.Username || null;

    console.log(this.generalForm.value);
    

    this.userService.updateMember(this.generalForm.value.Id, this.generalForm.value).subscribe((res: any) => {
      if (res.code === 200) {
        // this.modalService.dismissAll();
        this.getUser();
      }
    });
  }

  saveSocial() {
    this.socialForm.value.Id = this.id;
    this.socialForm.value.ClientId = this.user.ClientId;
    this.socialForm.value.DeviceId = this.user.DeviceId;
    this.socialForm.value.DeviceType = this.user.DeviceType;
    this.socialForm.value.EmailConfirmed = this.user.EmailConfirmed;
    this.socialForm.value.InstallId = this.user.InstallId;
    this.socialForm.value.NIK = this.user.NIK;
    this.socialForm.value.NIKConfirmed = this.user.NIKConfirmed;
    this.socialForm.value.PhoneConfirmed = this.user.PhoneConfirmed;
    this.socialForm.value.Username = this.user.Username;
  }

  isControlDisabled(controlName: string): boolean {
    const control = this.generalForm.get(controlName);
    return control && control.value != null && control.value.trim() !== '';
}

}
