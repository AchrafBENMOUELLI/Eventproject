import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/data/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(form: any) {
    if (!form.valid) {
      this.errorMessage = '⚠️ Veuillez remplir tous les champs';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Login réussi:', response);
        alert(`✅ Bienvenue ${response.user.firstName} !`);
        this.router.navigate(['/events']);
      },
      error: (err) => {
        console.error('Erreur login:', err);
        this.isLoading = false;

        if (err.error && err.error.message) {
          this.errorMessage = `❌ ${err.error.message}`;
        } else {
          this.errorMessage = '❌ Email ou mot de passe incorrect';
        }
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
