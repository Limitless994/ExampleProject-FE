import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private apiUrl = 'http://localhost:8081/api/';

    constructor(private http: HttpClient) {}

    private createHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');
        let headers = new HttpHeaders();

        if (token) {
            headers = headers.set('Authorization', `Bearer ${token}`);
            headers.set('Content-Type', `application/json`);
        }

        return headers;
    }

    get<T>(endpoint: string): Observable<T> {
        return this.http.get<T>(`${this.apiUrl}${endpoint}`, { headers: this.createHeaders() }).pipe(
            catchError(err => {
                console.error('API GET error:', err);
                return throwError('API error. Please try again.');
            })
        );
    }

    post<T>(endpoint: string, body: any): Observable<T> {
        return this.http.post<T>(`${this.apiUrl}${endpoint}`, body, { 
            headers: this.createHeaders(),
            responseType: 'text' as 'json'
        }).pipe(
            catchError(err => {
                console.error('API POST error:', err);
                return throwError('API error. Please try again.');
            })
        );
    }

    put<T>(endpoint: string, body: any): Observable<T> {
        return this.http.put<T>(`${this.apiUrl}${endpoint}`, body, { headers: this.createHeaders() }).pipe(
            catchError(err => {
                console.error('API PUT error:', err);
                return throwError('API error. Please try again.');
            })
        );
    }

    delete<T>(endpoint: string): Observable<T> {
        return this.http.delete<T>(`${this.apiUrl}${endpoint}`, { headers: this.createHeaders() }).pipe(
            catchError(err => {
                console.error('API DELETE error:', err);
                return throwError('API error. Please try again.');
            })
        );
    }
}
