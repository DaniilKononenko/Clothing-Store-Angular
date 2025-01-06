import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { User } from './user.interface';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  private user: User | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    this.authService.getCurrentUser().subscribe(user => this.user = user);
    console.log("AdminGuard: ");
    console.log(this.user)

    if (this.user && this.user.role === 'admin') {
      return true; // Если роль пользователя — администратор, доступ разрешен
    }

    // Если пользователь не администратор, перенаправляем, например, на главную страницу
    this.router.navigate(['/login']);
    return false;
  }
}
