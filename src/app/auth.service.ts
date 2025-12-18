import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

export interface AuthResponse {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

export interface User {
  email: string;
  id: string;
  token: string;
  tokenExpirationDate: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();
  private tokenExpirationTimer: any;

  private apiKey = "AIzaSyCKWwmIBVa3dtcgqtYo5XA8mPvJOxOrnrc";

  constructor(private http: HttpClient, private router: Router) {}

  signup(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.apiKey}`,
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    ).pipe(
      tap(resData => this.handleAuthentication(resData)),
      catchError(this.handleError)
    );
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.apiKey}`,
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    ).pipe(
      tap(resData => this.handleAuthentication(resData)),
      catchError(this.handleError)
    );
  }

  autoLogin(): void {
    const userData = localStorage.getItem('userData');
    if (!userData) {
      return;
    }

    const parsedUser = JSON.parse(userData);
    const loadedUser: User = {
      email: parsedUser.email,
      id: parsedUser.id,
      token: parsedUser.token,
      tokenExpirationDate: new Date(parsedUser.tokenExpirationDate)
    };

    if (loadedUser.token) {
      this.userSubject.next(loadedUser);
      const expirationDuration =
        loadedUser.tokenExpirationDate.getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  logout(): void {
    this.userSubject.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');

    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number): void {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleAuthentication(resData: AuthResponse): void {
    const expirationDate = new Date(
      new Date().getTime() + +resData.expiresIn * 1000
    );

    const user: User = {
      email: resData.email,
      id: resData.localId,
      token: resData.idToken,
      tokenExpirationDate: expirationDate
    };

    this.userSubject.next(user);
    this.autoLogout(+resData.expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorRes: any): Observable<never> {
    let errorMessage = 'Įvyko nežinoma klaida!';

    if (!errorRes.error || !errorRes.error.error) {
      return throwError(() => new Error(errorMessage));
    }

    // switch (errorRes.error.error.message) {  //bloga praktika
    //   case 'EMAIL_EXISTS':
    //     errorMessage = 'Šis el. paštas jau užregistruotas';
    //     break;
    //   case 'EMAIL_NOT_FOUND':
    //     errorMessage = 'Šis el. paštas nerastas';
    //     break;
    //   case 'INVALID_PASSWORD':
    //     errorMessage = 'Neteisingas slaptažodis';
    //     break;
    //   case 'INVALID_LOGIN_CREDENTIALS':
    //     errorMessage = 'Neteisingi prisijungimo duomenys';
    //     break;
    // }

    switch (errorRes.error.error.message) {
      default:
        errorMessage = 'Prisijungimo duomenys neteisingi';
        break;
    }

    return throwError(() => new Error(errorMessage));
  }
}
