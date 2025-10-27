// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api';

 
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {
  }

  public login(): Observable<boolean> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, {}).pipe(
      map(() => {
        this.isAuthenticatedSubject.next(true);
        return true;
      }),
      catchError(error => {
        console.error('Login failed:', error);
        this.isAuthenticatedSubject.next(false);
        return of(false);
      })
    );
  }


  public logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/logout`, {}).pipe(
      tap(() => {
        // On successful logout, update the state.
        this.isAuthenticatedSubject.next(false);
      })
    );
  }

  public verifyAuthentication(): Observable<boolean> {
    return this.http.get(`${this.apiUrl}/auth/verify`).pipe(
      map(() => {
        this.isAuthenticatedSubject.next(true);
        return true;
      }),
      catchError(() => {
        this.isAuthenticatedSubject.next(false);
        return of(false);
      })
    );
  }
}