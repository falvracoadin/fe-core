import { Component, Input, OnInit, Output, EventEmitter, SimpleChange } from '@angular/core';
import { LandaService } from 'src/app/core/services/landa.service';
import { AuthService } from 'src/app/feature/auth/services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-form-user',
  templateUrl: './form-user.component.html',
  styleUrls: ['./form-user.component.scss']
})
export class FormUserComponent implements OnInit {
  readonly MODE_CREATE = 'add';
  readonly MODE_UPDATE = 'update';

  @Input() userId !: number;
  @Output() afterSave = new EventEmitter<boolean>();
  @Output() batal = new EventEmitter<boolean>();

  showPassword = false;
  showPasswordConfirmation = false;
  activeMode!: string;
  status: {
    id: string,
    name: string,
  }[] = [
      { id: 'active', name: 'Aktif' },
      { id: 'not-active', name: 'Tidak Aktif' },
      { id: 'blacklist', name: 'Blacklist' },
      { id: 'suspend', name: 'Suspend' },
      { id: 'expired', name: 'Expired' },
      { id: 'paid', name: 'Paid' },
      { id: 'other', name: 'Other' },
    ];
  formModel!: {
    Fullname: string,
    NIK: string,
    Phone: string,
    Email: string,
    Status: number | any,
    Password: string,
    PasswordConfirmation: string,
  };

  validation : any = {
    Fullname: [],
    NIK: [],
    Phone: [],
    Email: [],
    Status: [],
    Password: [],
    PasswordConfirmation: [],
  };

  constructor(
    private userService: UserService,
    private landaService: LandaService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChange) {
    this.resetForm();
  }

  resetForm() {
    this.formModel = {
      Fullname: '',
      NIK: '',
      Phone: '',
      Email: '',
      Status: null,
      Password: '',
      PasswordConfirmation: '',
    };

    this.validation = {
        Fullname: [],
        NIK: [],
        Phone: [],
        Email: [],
        Status: [],
        Password: [],
        PasswordConfirmation: [],
    };

    if (this.userId > 0) {
      this.activeMode = this.MODE_UPDATE;
      this.getUser(this.userId);
      return true;
    }

    this.activeMode = this.MODE_CREATE;
    return
  }

  getUser(userId : any) {
    this.userService.getUserById(userId).subscribe((res: any) => {
      this.formModel = res.data;
    }, err => {
      console.log(err);
    });
  }

  save() {
    switch (this.activeMode) {
      case this.MODE_CREATE:
        this.insert();
        break;
      case this.MODE_UPDATE:
        this.update();
        break;
    }
  }

  insert() {
    let profile: any;
    this.authService.getProfile().subscribe((res) => profile = res);
    const payload: any = this.formModel;
    payload.ClientId = profile.ClientId;
    payload.Source = 'web';
    this.userService.createUser(payload).subscribe((res: any) => {
      this.landaService.alertSuccess('Berhasil', res.message);
      this.afterSave.emit();
    }, err => {
      this.validation = {
        Fullname: [],
        NIK: [],
        Phone: [],
        Email: [],
        Status: [],
        Password: [],
        PasswordConfirmation: [],
      };

      if (err.error.data) {
        for (const key in err.error.data) {
          if (err.error.data.hasOwnProperty(key)) {
            this.validation[key] = err.error.data[key];
          }
        }
      }
    });
  }

  update() {
    this.userService.updateUser(this.formModel).subscribe((res: any) => {
      this.landaService.alertSuccess('Berhasil', res.message);
      this.afterSave.emit();
    }, err => {
      this.validation = {
        Fullname: [],
        NIK: [],
        Phone: [],
        Email: [],
        Status: [],
        Password: [],
        PasswordConfirmation: [],
      };

      if (err.error.data) {
        for (const key in err.error.data) {
          if (err.error.data.hasOwnProperty(key)) {
            this.validation[key] = err.error.data[key];
          }
        }
      }
    });

    // Validation
    // {
    //   "Email": [
    //   "The Email field is required",
    //   "The Email field must be a valid email address"
    // ],
    //     "Fullname": [
    //   "The Fullname field is required"
    // ],
    //     "NIK": [
    //   "The NIK field is required"
    // ],
    //     "Password": [
    //   "The Password field is required",
    //   "The Password field must be minimum 6 char"
    // ],
    //     "PasswordConfirmation": [
    //   "The PasswordConfirmation field is required",
    //   "The PasswordConfirmation field must be minimum 6 char"
    // ],
    //     "Phone": [
    //   "The Phone field is required",
    //   "The Phone field must be numeric",
    //   "The Phone field must be between 6 and 20"
    // ],
    //     "Status": [
    //   "The Status field must be one of active, blacklist, suspend, expired, paid, other, not-active"
    // ]
    // }
  }
}
