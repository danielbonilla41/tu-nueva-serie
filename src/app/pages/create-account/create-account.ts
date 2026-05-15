import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../core/services/account.service';
import { AccountProfile } from '../../models/account-profile';
import { Profile } from '../../models/profile';

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-account.html',
  styleUrls: ['./create-account.css']
})
export class CreateAccount implements OnInit {
  private accountService = inject(AccountService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);

  // Contexto de la plataforma
  platformId = signal<string>('');
  platformName = signal<string>('');

  // Estados del formulario
  isConfiguringProfiles = signal<boolean>(false);
  profileCount = signal<number>(1);
  tempProfiles = signal<Profile[]>([]);

  newAccount: AccountProfile = {
    email: '',
    password: '',
    account_id: '',
    purchase_date: new Date().toISOString().split('T')[0],
    renewal_date: '',
    profiles: []
  };

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    const name = this.route.snapshot.paramMap.get('name');
    if (id) {
      this.platformId.set(id);
      this.platformName.set(name || '');
    }
  }

  goBack() {
    this.location.back();
  }

  /**
   * Genera la lista de perfiles basada en la cantidad seleccionada
   */
  prepareProfiles() {
    if (!this.newAccount.email || !this.newAccount.password) {
      alert('Por favor, completa los datos principales de la cuenta.');
      return;
    }

    const count = this.profileCount();
    const profiles: Profile[] = Array.from({ length: count }, (_, i) => ({
      name: `Perfil ${i + 1}`,
      pin: '',
      purchase_date: this.newAccount.purchase_date, // Hereda la fecha de la cuenta
      phone_number: '',
      renewal_date: this.newAccount.renewal_date, // Hereda la fecha de la cuenta
      sold: false
    }));

    this.tempProfiles.set(profiles);
    this.isConfiguringProfiles.set(true);
  }

  /**
   * Guarda la cuenta completa en Firebase
   */
  async saveAccount() {
    const finalAccount: AccountProfile = {
      ...this.newAccount,
      account_id: this.platformId(),
      profiles: this.tempProfiles()
    };

    try {
      await this.accountService.createAccount(finalAccount);
      alert('✅ Cuenta creada exitosamente');
      this.router.navigate(['/admin/catalog']);
    } catch (error) {
      alert('Error al guardar en la base de datos.');
    }
  }
}