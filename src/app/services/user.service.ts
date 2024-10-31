import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { NewUserDto } from '../models/user';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(private apiService: ApiService) {}

    getUsers(): Observable<any[]> {
        return this.apiService.get<any[]>("users");
    }
    deleteUser(userId: string): Observable<void> {
        return this.apiService.delete<void>(`users/${userId}`);
    }
    addUser(user: NewUserDto): Observable<NewUserDto> {
        return this.apiService.post<NewUserDto>('users', user);
      }
}
