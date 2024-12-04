import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenStorageService {
  TOKEN_KEY = 'auth-token';
  USER_KEY = 'auth-user';

  constructor() {}

  public getToken(): Object {
    const token = sessionStorage.getItem(this.TOKEN_KEY) 
    return token ?  JSON.parse(sessionStorage.getItem(this.TOKEN_KEY)) : null;
  }

  setToken(token: string): void {
    sessionStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.setItem(this.TOKEN_KEY, token);
  }

  getUser(): any {
    const user = sessionStorage.getItem(this.USER_KEY) 
    return user ? JSON.parse(sessionStorage.getItem(this.USER_KEY)) : null;
  }

  setUser(user): void {
    sessionStorage.removeItem(this.USER_KEY);
    sessionStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  clearStorage(): void {
    sessionStorage.clear();
  }
}
