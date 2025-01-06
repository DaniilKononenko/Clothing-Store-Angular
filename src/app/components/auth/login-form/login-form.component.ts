import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgIf],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss'
})
export class LoginFormComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required , Validators.min(8)]),
  })

  isPasswordVisible: boolean = false

  constructor (private authService: AuthService) {}

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible
  }

  onSubmit(): void {
    console.log(this.loginForm.value)
    //@ts-ignore
    this.authService.login(this.loginForm.value)
      .subscribe(data => console.log(data))
  }
}
