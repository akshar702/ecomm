import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './api.service';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject: BehaviorSubject<any>;
  public user: Observable<any>;

  constructor(private _api: ApiService, private _token: TokenStorageService) {
    this.userSubject = new BehaviorSubject<any>(this._token.getUser());
    this.user = this.userSubject.asObservable();
  }

  getUser() {
    console.log(this.userSubject);
    console.log(this.userSubject.value);
    return this.userSubject.value;
  }

  loginwithgoogle(token: any): Observable<any> {
    return this._api
      .postTypeRequest('users/loginwithgoogle', token)
      .pipe(
        map((res: any) => {
          let user = {
            accessToken: res?.data?.accessToken,
          };
          this._token.setToken(JSON.stringify({accessToken: res?.data?.accessToken}));
          this._token.setUser(JSON.stringify(res?.data?.accessToken));
          console.log(res);
          this.userSubject.next(user);
          return user;
        })
      );
  }

  login(credentials: any): Observable<any> {
    return this._api
      .postTypeRequest('users/login', {
        username: credentials.username,
        password: credentials.password,
      })
      .pipe(
        map((res: any) => {
          let user = {
            username: credentials.username,
            accessToken: res?.data?.accessToken,
            refreshToken: res?.data.refreshToken,
          };
          this._token.setToken(JSON.stringify({accessToken: res?.data?.accessToken, refreshToken: res?.data?.refreshToken}));
          this._token.setUser(JSON.stringify(res?.data?.user));
          console.log(res);
          this.userSubject.next(user);
          return user;
        })
      );
  }

  register(user: any): Observable<any> {
    return this._api.postTypeRequest('users/register', {
      fullName: user.fullName,
      email: user.email,
      username: user.username,
      password: user.password,
    });
  }

  logout(): Observable<any> {
    return this._api.postTypeRequest('users/logout', null).pipe(
      map((res: any) => {
        this._token.clearStorage();
        this.userSubject.next(null);
      })
    );
  }

  createPayment(data: any): Observable<any> {
    return this._api.postTypeRequest('payments/create-payment', data);
  }

}
