// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, firstValueFrom, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080';
  private tokenKey = 'jwt_token';
  private tokenSubject = new BehaviorSubject<string | null>(null);
  
  constructor(private http: HttpClient) {
    const storedToken = localStorage.getItem(this.tokenKey);
    if (storedToken) {
      this.tokenSubject.next(storedToken);
    }
  }

  // Get or create anonymous token
  public async getValidToken(): Promise<string> {
    let token = this.getToken();
    if (!token) {
      token = await firstValueFrom(this.getAnonymousToken());
    }
    else if (this.isTokenExpired(token)) {
      token = await firstValueFrom(this.refreshToken(token));
    }
    
    return token;
  }

  // Get anonymous token from backend
  public getAnonymousToken(): Observable<string> {
    return this.http.post(`${this.apiUrl}/api/token/anonymous`, {}, {
      responseType: 'text'
    }).pipe(
      tap(token => {
        this.storeToken(token);
        console.log('Anonymous token obtained');
      }),
      catchError(error => {
        console.error('Failed to get anonymous token:', error);
        throw error;
      })
    );
  }

  // Refresh existing token
  public refreshToken(oldToken?: string): Observable<string> {
    const token = oldToken || this.getToken();
    
    if (!token) {
      return this.getAnonymousToken();
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(`${this.apiUrl}/api/token/refresh`, {}, {
      headers: headers,
      responseType: 'text'
    }).pipe(
      tap(newToken => {
        this.storeToken(newToken);
        console.log('Token refreshed');
      }),
      catchError(error => {
        console.error('Failed to refresh token:', error);
        return this.getAnonymousToken();
      })
    );
  }

  public getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private storeToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    this.tokenSubject.next(token);
  }

  public clearToken(): void {
    localStorage.removeItem(this.tokenKey);
    this.tokenSubject.next(null);
  }

  public isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000;
      const bufferTime = 60000; // 1 minute buffer
      return Date.now() > (expiry - bufferTime);
    } catch (error) {
      console.error('Failed to parse token:', error);
      return true;
    }
  }

  public get token$(): Observable<string | null> {
    return this.tokenSubject.asObservable();
  }

  public async initializeAuth(): Promise<void> {
    const token = this.getToken();
    
    if (!token || this.isTokenExpired(token)) {
      try {
        await firstValueFrom(this.getAnonymousToken());
      } catch (error) {
        console.error('Failed to initialize auth:', error);
      }
    }
  }
}