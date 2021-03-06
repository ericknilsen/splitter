import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from './user.model';
import { SocialUser } from 'angularx-social-login';

import {ENDPOINT} from '../common/constants';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<any>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser') || '{}'));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): any { 
        return this.currentUserSubject.value;  
    }

    login(username: string, password: string) {
        return this.http.post<any>(`${ENDPOINT}/login`, { username, password })
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                if (user && user.accessToken) {  
                    this.setLocalStorage(user)
                }
                return user;
            })); 
    }


    findSocialUser(socialUser: SocialUser) { 
        return this.http.get<any>(`${ENDPOINT}/socialusers/`+socialUser.id)
    }   
    
    createSocialUser(socialUser: SocialUser) {
        let body = {id: socialUser.id, email: socialUser.email, firstName: socialUser.firstName, provider: socialUser.provider}
        return this.http.post<any>(`${ENDPOINT}/socialusers/`, body)
    }

    loginSocialUser(socialUser: SocialUser) { 
        let body = {id:socialUser.id, firstName: socialUser.firstName, provider: socialUser.provider}
        return this.http.post<any>(`${ENDPOINT}/loginsu/`, body)
            .pipe(map(user => {
                if (user && user.accessToken) {
                    user.photoUrl = socialUser.photoUrl;
                    user.name = socialUser.firstName;
                    user.email = socialUser.email;
                    this.setLocalStorage(user)
                }             
                return user;
            }));
    }   

    private setLocalStorage(object: Object) {
        localStorage.setItem('currentUser', JSON.stringify(object))
        this.currentUserSubject.next(object)
    }    

    logout() {
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }
}