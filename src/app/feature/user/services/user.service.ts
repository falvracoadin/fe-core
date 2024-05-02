import { Injectable } from '@angular/core';
import { LandaService } from 'src/app/core/services/landa.service';
import { DecryptionService } from '../../../core/services/decryption.service';


@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(
        private decryptionService: DecryptionService,
        private landaService: LandaService
    ) { }

    getRoles(arrParameter = {}) {
        // return this.landaService.DataGet('/v1/roles', arrParameter);
        return this.landaService.DataGet('/access/roles/list', arrParameter);
    }

    getUsers(arrParameter: any = {}) {
        if (this.decryptionService.GrabEnvironmentKey('mode') === 'saas') {
            return this.landaService.DataGet('/access/member/list', arrParameter);
        }
        return this.landaService.DataGet('/access/user/list', arrParameter);
    }

    getUserById(userId: any) {
        if (this.decryptionService.GrabEnvironmentKey('mode') === 'saas') {
            return this.landaService.DataGet('/access/member/detail/' + userId);
        }
        return this.landaService.DataGet('/access/user/detail/' + userId);
    }

    createUser(payload: any) {
        // return this.DataPost('/v1/users', payload);

        // test local private ---------------------------
        if (this.decryptionService.GrabEnvironmentKey('mode') === 'saas') {
            return this.landaService.DataPost('/access/v2/user/create', {
                RoleId: this.decryptionService.GrabEnvironmentKey('roleId'),
                Fullname: payload.Fullname,
                Nik: payload.NIK,
                Phone: payload.Phone,
                Email: payload.Email,
                Password: payload.Password,
                PasswordConfirmation: payload.PasswordConfirmation
            }, false, 'saas');
        }
        return this.landaService.DataPost('/access/user/add', payload);
    }

    updateUser(payload: any) {
        // return this.DataPut('/v1/users', payload);

        // test local private ---------------------------
        if (this.decryptionService.GrabEnvironmentKey('mode') === 'saas') {
            return this.landaService.DataPut('/access/v2/user/update/' + payload.id, {
                Fullname: payload.Fullname,
                NIK: payload.NIK,
                Phone: payload.Phone,
                Status: payload.Status,
                Email: payload.Email,
                Username: payload.Username,
                KK: payload.KK,
            }, false, 'saas');
        }
        return this.landaService.DataPut('/access/user/edit/' + payload.id, payload);
    }

    deleteUser(userId: any) {
        // return this.DataDelete('/v1/users/' + userId);

        // test local private ---------------------------
        if (this.decryptionService.GrabEnvironmentKey('mode') === 'saas') {
            return this.landaService.DataDelete('/access/v2/user/delete/' + userId, 'saas');
        }
        return this.landaService.DataDelete('/access/user/delete/' + userId);
    }

    updateMember(userId: any, payload: any) {
        if (this.decryptionService.GrabEnvironmentKey('mode') === 'saas') {
            payload.PhoneConfirmed = payload.PhoneConfirmed === "true";
            payload.EmailConfirmed = payload.EmailConfirmed === "true";
            return this.landaService.DataPut('/access/member/edit/' + userId, {
                Fullname: payload.Fullname,
                Username: payload.Username,
                Phone: payload.Phone,
                PhoneConfirmed: payload.PhoneConfirmed,
                Email: payload.Email,
                EmailConfirmed: payload.EmailConfirmed,
                Status: payload.Status,
                ClientId: payload.ClientId,

            });
        }
        return this.landaService.DataPut('/access/user/edit/' + payload.id, payload);
    }
}
