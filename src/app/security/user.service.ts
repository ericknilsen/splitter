import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from './user.model';
import { SocialUser } from 'angularx-social-login';

@Injectable({ providedIn: 'root' })
export class UserService {

    socialUsers: SocialUser[] = []

    constructor(private http: HttpClient) {}

    getAll() {
        return this.http.get<User[]>('http://localhost:4200/users');
    }

}