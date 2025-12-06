import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/data/auth.service';
import { User } from '../../../models/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user: User = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'user'
  };

  confirmPassword: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(form: any) {
    if (!form.valid) {
      this.errorMessage = '⚠️ Veuillez remplir tous les champs correctement';
      return;
    }

    if (this.user.password !== this.confirmPassword) {
      this.errorMessage = '⚠️ Les mots de passe ne correspondent pas';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.register(this.user).subscribe({
      next: (response) => {
        console.log('Utilisateur créé:', response);
        alert('✅ Inscription réussie ! Vous pouvez maintenant vous connecter.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Erreur inscription:', err);
        this.isLoading = false;

        if (err.error && err.error.message) {
          this.errorMessage = `❌ ${err.error.message}`;
        } else {
          this.errorMessage = '❌ Erreur lors de l\'inscription. Veuillez réessayer.';
        }
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
