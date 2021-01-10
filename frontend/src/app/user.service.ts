import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

declare const FB: any;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
    FB.init({
      appId: environment.facebook_appid,
      status: false,
      cookie: false,
      xfbml: false,
      version: 'v4.0'
    });
  }

  fbLogin() {
    return new Promise((resolve, reject) => {

      FB.login(result => {
        if (result.authResponse) {
          return this.http
            .post(`http://localhost:8000/users/auth/facebook`, { access_token: result.authResponse.accessToken })
            .toPromise()
            .then(response => {
              const token = response;
              if (token) {
                localStorage.setItem('id_token', JSON.stringify(token));
              }
              resolve(response);
            })
            .catch(() => reject());
        } else {
          reject();
        }
      }, { scope: 'public_profile,email' });
    });
  }

  isLoggedIn() {
    return new Promise((resolve, reject) => {
      this.getCurrentUser().then(user => resolve(true)).catch(() => reject(false));
    });
  }

  getCurrentUser() {
    return new Promise((resolve, reject) => {
      return this.http.get(`http://localhost:8000/api/auth/me`).toPromise().then(response => {
        resolve(response);
      }).catch(() => reject());
    });
  }

  logout() {
    localStorage.removeItem('id_token');
    localStorage.clear();
  }

}
