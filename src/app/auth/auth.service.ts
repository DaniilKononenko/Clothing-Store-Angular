import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap, of } from 'rxjs';
import { TokenResponce } from './token-responce';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { User } from './user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = "http://127.0.0.1:8000/api/v1/auth/jwt"
  
  private accessToken: string | null = null
  private refreshToken: string | null = null
  private user: User | null = null
  

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private router: Router
  ) { }
  

  private auth(payload: {email: string, password: string}, url: string): Observable<any> {
    const fd = new FormData()
    fd.append('email', payload.email)
    fd.append('password', payload.password)

    return this.http.post<TokenResponce>(url, fd)
      .pipe(
        tap(response => {
          this.cookieService.set("authToken", response.access_token)
          this.cookieService.set("refreshToken", response.refresh_token)
          this.accessToken = response.access_token
          this.refreshToken = response.refresh_token
          console.log(this.accessToken, this.refreshToken)
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
    if(!this.accessToken) {
      this.accessToken = this.cookieService.get("authToken")
    }
    return !!this.accessToken
  }

  logout(): void {
    this.cookieService.delete("authToken")
    this.cookieService.delete("refreshToken")
    this.accessToken = null
    this.refreshToken = null
    this.router.navigate(['/login'])
  }

  getCurrentUser(): Observable<User> {
    if(!this.user) {
      return this.http.get<User>(`${this.apiUrl}/me`, {
        headers: {Authorization: `Bearer ${this.accessToken}`}
      })
      .pipe(
        tap(user => {
          this.user = user
          console.log("AuthService | Fetched user ", user)
        })
      )
    }
    console.log("AuthService | Cached user: ")
    console.log(this.user)
    return of(this.user!);
  }
}