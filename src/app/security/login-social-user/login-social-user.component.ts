import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SocialAuthService } from "angularx-social-login";
import { SocialUser, GoogleLoginProvider } from "angularx-social-login";
import {AuthenticationService} from '../authentication.service'

@Component({
  selector: 'pro-login-social-user',
  templateUrl: './login-social-user.component.html',
  styleUrls: ['./login-social-user.component.css']
})
export class LoginSocialUserComponent implements OnInit {

  returnUrl!: string;

  ngOnInit() {
    // reset login status
    this.authenticationService.logout();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  constructor(private socialAuthService: SocialAuthService, 
              private authenticationService: AuthenticationService,
              private route: ActivatedRoute,
              private router: Router) {}

  signinWithGoogle() {
    let socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
 
    this.socialAuthService.signIn(socialPlatformProvider)
    .then((userData) => {
       this.sendToRestApiMethod(userData);
    });
  } 

  sendToRestApiMethod(socialUser: SocialUser) : void {
    this.authenticationService.findSocialUser(socialUser)
      .subscribe(
         data => {
            if(data) {
               this.loginSocialUser(socialUser)
            } 
         },
         () => {
           this.createSocialUser(socialUser)
         }
      )         
  }

  createSocialUser(socialUser: SocialUser) {
    this.authenticationService.createSocialUser(socialUser)
    .subscribe(
      data => {
          if(data) {
            this.loginSocialUser(socialUser)
          } else {
            console.log('Unable to create a new social user')
          }
      },
      error => {
        console.log(`Impossible to log in: ${error}`)
      }
    )  
  }

  loginSocialUser(socialUser: SocialUser) {
    this.authenticationService.loginSocialUser(socialUser)
    .subscribe(
      user => {
          if(user && user.accessToken) {
            this.router.navigate([this.returnUrl]);
          } 
      },
      error => {
        console.log(`Impossible to log in: ${error}`)
      }
    )  
  }

}
