import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap, of, throwError } from 'rxjs';
import { TokenResponce } from './token-responce';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { User } from './user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = "http://127.0.0.1:8000/api/v1/auth/jwt"
  
  private _accessToken: string | null = null
  private _refreshToken: string | null = null
  private user: User | null = null
  

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private router: Router
  ) { }
  
  getAccessToken(): string | null {
    return this._accessToken
  }
  
  getRefreshToken(): string | null {
    return this._refreshToken
  }

  private saveTokens(res: TokenResponce): void {
    this.cookieService.set("authToken", res.access_token)
    this.cookieService.set("refreshToken", res.refresh_token)
    this._accessToken = res.access_token
    this._refreshToken = res.refresh_token
  }

  private auth(payload: {email: string, password: string}, url: string): Observable<TokenResponce> {
    const fd = new FormData()
    fd.append('email', payload.email)
    fd.append('password', payload.password)

    return this.http.post<TokenResponce>(url, fd)
      .pipe(
        tap(response => {
          this.saveTokens(response),
          this.router.navigate(['/products'])
        })
      )
  }

  login(payload: {email: string, password: string}): Observable<any> {    
    return this.auth(payload, `${this.apiUrl}/login`)
  }

  register(payload: {email: string, password: string}): Observable<any> {
    return this.auth(payload, `${this.apiUrl}/register`)
  }

  isLoggenIn(): boolean {
    if(!this._accessToken) {
      this._accessToken = this.cookieService.get("authToken")
    }
    return !!this._accessToken
  }

  logout(): void {
    this.cookieService.delete("authToken")
    this.cookieService.delete("refreshToken")
    this._accessToken = null
    this._refreshToken = null
    this.user = null
    this.router.navigate(['/login'])
  }

  getCurrentUser(): Observable<User> {
    if(!this.user) {
      return this.http.get<User>(`${this.apiUrl}/me`, {
        headers: {Authorization: `Bearer ${this._accessToken}`}
      })
      .pipe(
        tap(user => this.user = user)
      )
    }
    return of(this.user!);
  }

  refreshToken(): Observable<TokenResponce> {
    console.log(this._refreshToken)
    return this.http.post<TokenResponce>(`${this.apiUrl}/refresh`, this._refreshToken)
      .pipe(
        tap(response => this.saveTokens(response)),
        catchError(err => {
          this.logout()
          throw err
        })
      )
  }
}