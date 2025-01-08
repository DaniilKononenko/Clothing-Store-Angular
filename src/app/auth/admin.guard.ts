import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { User } from './user.interface';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.getCurrentUser()
      .pipe(
        map(user => {
          if (user && user.role === 'admin') {
            console.log("This user is admin")
            console.log(user.email)
            return true; // Если роль пользователя — администратор, доступ разрешен
          }
      
          // Если пользователь не администратор, перенаправляем, например, на главную страницу
          this.router.navigate(['/login']);
          return false;
        })
      );
  }
}
