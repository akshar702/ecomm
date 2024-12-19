import { Component, OnInit } from '@angular/core';
import { HostListener } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { TokenStorageService } from '../services/token-storage.service';
import { loadStripe } from '@stripe/stripe-js';

import {
  SocialAuthService,
  GoogleLoginProvider,
  SocialUser,
} from '@abacritt/angularx-social-login';
import { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  stripePromise = loadStripe('YOUR_KEY');

  screenHeight: any;
  screenWidth: any;
  isMenuOpen = false;
  isMobile = false;
  isLoggedIn = false;
  dropdownVisible = false;
  cartData: any;

  socialUser!: SocialUser;

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;

    if (this.screenWidth > 768) this.isMobile = false;
    else this.isMobile = true;
  }

  constructor(
    private _token: TokenStorageService,
    private _auth: AuthService,
    private _cart: CartService,
    private _router: Router,
    private socialAuthService: SocialAuthService
  ) {
    this.getScreenSize();
    this._auth.user.subscribe((user) => {
      if (user) this.isLoggedIn = true;
      else this.isLoggedIn = false;
    });
    this._cart.cartDataObs$.subscribe((cartData) => {
      this.cartData = cartData;
    });
  }

  ngOnInit(): void {
    if (this._token.getUser()) this.isLoggedIn = true;
    else this.isLoggedIn = false;
    this.socialAuthService.authState.subscribe((user) => {
      if (user) {
        const googleToken = user.idToken; // Get Google ID token
        console.log(googleToken, 'googleToken');
        this.verifyGoogleToken(googleToken);
      }
    });
    
  }

  verifyGoogleToken(idToken: string): void{
    this._auth
    .loginwithgoogle({ token: idToken })
    .subscribe({
      next : (res) => {
        console.log(res, 'res');
        this._router.navigate(['/']);
        this.toggleMenu();
      },
      error : (err) => {
        console.log(err);
      }
    });
  }

  loginWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }

  removeProductFromCart(id: number) {
    this._cart.removeProduct(id);
  }

  logout() {
      this._auth.logout().subscribe(
        (res) => {
          console.log(res);
          this.socialAuthService.signOut();
        },
        (err) => {
          console.log(err);
        }
      );
    this.isMenuOpen = false;
  }


  async createPayment() {


    const stripe = await this.stripePromise;
    const paymentData  = {
      amount: 100, // $20.00
      currency: 'usd',
    };
    // Request Checkout Session ID from backend
    this._auth.createPayment(paymentData).subscribe(
        {
        next : async (response) => {
         console.log(response, 'next');
         let checkoutUrl =  response?.data?.checkoutUrl;
          // Redirect to Stripe's Checkout page
          //New Tab
          window.open(checkoutUrl, '_blank'); // Opens in a new tab
        // Same tab
        //  const { error } = await stripe!.redirectToCheckout({ sessionId });
        // if (error) {
        //   console.error('Error redirecting to Stripe:', error);
        // }
        },
        error : (err)  => {
          console.log(err, 'err');
        }
      } 
    );

  }
}
