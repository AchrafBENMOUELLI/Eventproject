import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { User } from '../../models/user';

interface LoginResponse {
  access_token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private urlBackend = 'http://localhost:3000/user';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Charger l'utilisateur depuis localStorage au démarrage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  /////////////////////////////////////////////////
  // REGISTER
  /////////////////////////////////////////////////
  register(user: User): Observable<User> {
    return this.http.post<User>(`${this.urlBackend}/register`, user);
  }

  /////////////////////////////////////////////////
  // LOGIN
  /////////////////////////////////////////////////
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.urlBackend}/login`, { email, password })
      .pipe(
        tap(response => {
          // Stocker le token et l'utilisateur
          localStorage.setItem('token', response.access_token);
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
        })
      );
  }

  /////////////////////////////////////////////////
  // LOGOUT
  /////////////////////////////////////////////////
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  /////////////////////////////////////////////////
  // GET TOKEN
  /////////////////////////////////////////////////
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /////////////////////////////////////////////////
  // GET CURRENT USER
  /////////////////////////////////////////////////
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /////////////////////////////////////////////////
  // IS LOGGED IN
  /////////////////////////////////////////////////
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  /////////////////////////////////////////////////
  // IS ORGANIZER
  /////////////////////////////////////////////////
  isOrganizer(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'organizer' || user?.role === 'admin';
  }

  /////////////////////////////////////////////////
  // IS ADMIN
  /////////////////////////////////////////////////
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }
}
