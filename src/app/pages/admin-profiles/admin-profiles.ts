import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from '../../core/services/account.service';
import { AccountProfile } from '../../models/account-profile';
import { Profile } from '../../models/profile';
import { CommonModule, Location } from '@angular/common'; // Importar Location y CommonModule
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-profiles',
  standalone: true,
  templateUrl: './admin-profiles.html',
  styleUrls: ['./admin-profiles.css'],
  imports: [CommonModule, FormsModule]
})
export class AdminProfilesComponent implements OnInit {
  private accountService = inject(AccountService);
  private route = inject(ActivatedRoute);
  private location = inject(Location);

  platformId = signal<string>('');
  platformName = signal<string>('');
  accounts = signal<AccountProfile[]>([]);
  isConfiguringProfiles = signal<boolean>(false);
  tempProfiles = signal<Profile[]>([]);
  profileCount = signal<number>(1);
  newAccount: AccountProfile = {
    email: '',
    password: '',
    account_id: '',
    purchase_date: new Date().toISOString().split('T')[0], // Fecha de hoy por defecto
    renewal_date: '',
    profiles: []
  };

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    const name = this.route.snapshot.paramMap.get('name');
    if (id) {
      this.platformId.set(id);
      this.platformName.set(name || '');
      this.loadData();
    }
  }

  goBack() {
    this.location.back();
  }

  loadData() {
    this.accountService.getAccountsByPlatform(this.platformId()).subscribe({
      next: (res) => this.accounts.set(res),
      error: (err) => console.error('Error al cargar:', err)
    });
  }

  async onToggleSold(account: AccountProfile, index: number) {
    if (!account.id) return;

    // Clonamos y modificamos el estado
    const updatedProfiles = [...account.profiles];
    updatedProfiles[index].sold = !updatedProfiles[index].sold;

    try {
      await this.accountService.updateAccount(account.id, { profiles: updatedProfiles });
    } catch (error) {
      console.error('Error al actualizar:', error);
    }
  }

  async onDeleteAccount(id: string | undefined) {
    if (id && confirm('¿Estás seguro de eliminar esta cuenta?')) {
      await this.accountService.deleteAccount(id);
    }
  }

  prepareProfiles() {
    const count = this.profileCount();

    // Solo generamos los datos internos del perfil
    const profiles: Profile[] = Array.from({ length: count }, (_, i) => ({
      name: `Perfil ${i + 1}`,
      pin: '',
      purchase_date: new Date().toISOString(),
      phone_number: '',
      renewal_date: '',
      sold: false
    }));

    this.tempProfiles.set(profiles);
    this.isConfiguringProfiles.set(true);
  }

  async addAccount() {
    // Construimos el objeto con el account_id en la raíz
    const finalAccount: AccountProfile = {
      email: this.newAccount.email,
      password: this.newAccount.password,
      account_id: this.platformId(),
      purchase_date: this.newAccount.purchase_date,
      renewal_date: this.newAccount.renewal_date,
      profiles: this.tempProfiles()
    };

    try {
      await this.accountService.createAccount(finalAccount);
      this.resetForm();
      this.isConfiguringProfiles.set(false);
    } catch (error) {
      console.error(error);
    }
  }

  cancelConfiguration() {
    this.isConfiguringProfiles.set(false);
    this.tempProfiles.set([]);
  }

  private resetForm() {
    this.newAccount = {
      email: '',
      password: '',
      account_id: '',
      purchase_date: new Date().toISOString().split('T')[0],
      renewal_date: '',
      profiles: []
    };
    this.profileCount.set(1);
  }

}