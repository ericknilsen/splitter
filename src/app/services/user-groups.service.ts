import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { UserGroup } from '../models/user-group.model';
import { SocialUser } from 'angularx-social-login';
import { ENDPOINT } from '../common/constants';

@Injectable({ providedIn: 'root' })
export class UserGroupService {

    socialUsers: SocialUser[] = []

    constructor(private http: HttpClient) {}

    listUserGroupOfUser(userEmail: string) {
        return this.http.get<UserGroup>(`${ENDPOINT}/listUserGroupOfUser/${userEmail}`);
    }

}