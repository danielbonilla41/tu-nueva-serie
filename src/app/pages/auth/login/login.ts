import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private auth = inject(Auth);
  private router = inject(Router);

  email = signal('');
  password = signal('');
  errorMessage = signal('');
  isLoading = signal(false);

  async onLogin() {
    if (!this.email() || !this.password()) {
      this.errorMessage.set('Por favor, completa todos los campos.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      // Validación real contra los servidores de Firebase
      await signInWithEmailAndPassword(this.auth, this.email(), this.password());
      // Si es exitoso, redirige al panel de administración
      this.router.navigate(['/admin/dashboard']);
    } catch (error: any) {
      console.error(error);
      this.errorMessage.set('Credenciales incorrectas. Inténtalo de nuevo.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
