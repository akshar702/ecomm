import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  username = '';
  password = '';
  error = '';
  loading = false;

  constructor(private _auth: AuthService, private _router: Router) {}

  ngOnInit(): void {}

  onSubmit(): void {
    this.loading = true;
    this.error = '';
    if (!this.username || !this.password) {
      this.error = 'Make sure to fill everything ;)';
    } else {
      this._auth
        .login({ username: this.username, password: this.password })
        .subscribe(
          (res) => {
            this.loading = false;
            this._router.navigate(['/']);
          },
          (err) => {
            console.log(err);
            this.error = err.error.message;
            this.loading = false;
          }
        );
    }
  }

  canSubmit(): boolean {
    return this.username.length > 0 && this.password.length > 0;
  }
}
