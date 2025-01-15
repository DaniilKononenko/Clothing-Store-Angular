import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.scss'
})
export class RegisterFormComponent {
  registerForm = new FormGroup({
    email: new FormControl(""),
    password: new FormControl("")
  })

  constructor(private authService: AuthService) {}

  onSubmit(): void {
    console.log(this.registerForm.value)
    this.register()
  }

  private register(): void {
    //@ts-ignore
    this.authService.register(this.registerForm.value)
      .subscribe(data => console.log(data))
  }
}
