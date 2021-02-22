import { Component } from '@angular/core';
import { JwtService } from './services/jwt.service';
import { API_USERNAME, API_PASSWORD } from './utils/constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(jwtService: JwtService) {
    jwtService.login(API_USERNAME, API_PASSWORD).subscribe(resp => {
      localStorage.setItem('accessToken', resp.accessToken);
    })
  }
}
