import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AccountService } from '../../core/services/account.service';
import { AccountProfile } from '../../models/account-profile';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-profiles',
  standalone: true,
  templateUrl: './admin-profiles.html',
  styleUrls: ['./admin-profiles.css'],
  imports: [CommonModule, FormsModule, RouterLink] // Añadido RouterLink para el botón de volver
})
export class AdminProfilesComponent implements OnInit {
  private accountService = inject(AccountService);
  private route = inject(ActivatedRoute);
  private location = inject(Location);

  // --- Signals de Estado ---
  platformId = signal<string>('');
  platformName = signal<string>('');
  accounts = signal<AccountProfile[]>([]);
  
  // Gestión de edición inline
  editingAccountId = signal<string | null>(null);
  tempEditingAccount = signal<AccountProfile | null>(null);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    const name = this.route.snapshot.paramMap.get('name');
    if (id) {
      this.platformId.set(id);
      this.platformName.set(name || '');
      this.loadData();
    }
  }

  // Cargar datos de Firebase según la plataforma
  loadData() {
    this.accountService.getAccountsByPlatform(this.platformId()).subscribe({
      next: (res) => this.accounts.set(res),
      error: (err) => console.error('Error al cargar:', err)
    });
  }

  // Navegación hacia atrás (usada en el botón de la interfaz)
  goBack() {
    this.location.back();
  }

  /**
   * Inicia el modo de edición creando una copia profunda del objeto
   */
  startEdit(acc: AccountProfile) {
    if (!acc.id) return;
    this.editingAccountId.set(acc.id);
    // structuredClone es más moderno y seguro para clonar objetos en Angular 20
    this.tempEditingAccount.set(structuredClone(acc));
  }

  /**
   * Cancela la edición y limpia los temporales
   */
  cancelEdit() {
    this.editingAccountId.set(null);
    this.tempEditingAccount.set(null);
  }

  /**
   * Guarda los cambios acumulados en el modo edición
   */
  async saveInlineEdit() {
    const updatedAcc = this.tempEditingAccount();
    if (updatedAcc && updatedAcc.id) {
      try {
        await this.accountService.updateAccount(updatedAcc.id, updatedAcc);
        this.cancelEdit();
        console.log('✅ Cuenta actualizada con éxito');
      } catch (error) {
        console.error('Error al actualizar:', error);
        alert('No se pudo guardar la información.');
      }
    }
  }

  /**
   * Maneja el cambio de estado 'Vendido' / 'Disponible'
   * Detecta automáticamente si estamos en modo edición o lectura
   */
  async onToggleSold(account: AccountProfile, index: number) {
    // Escenario 1: Si estamos editando esta tarjeta específica, modificamos la copia temporal
    if (this.editingAccountId() === account.id) {
      const temp = this.tempEditingAccount();
      if (temp) {
        temp.profiles[index].sold = !temp.profiles[index].sold;
        this.tempEditingAccount.set({...temp});
      }
    } 
    // Escenario 2: Cambio rápido en modo lectura (impacto directo en DB)
    else if (account.id) {
      const updatedProfiles = [...account.profiles];
      updatedProfiles[index].sold = !updatedProfiles[index].sold;

      try {
        await this.accountService.updateAccount(account.id, { profiles: updatedProfiles });
      } catch (error) {
        console.error('Error al actualizar estado:', error);
      }
    }
  }

  /**
   * Elimina la cuenta completa
   */
  async onDeleteAccount(id: string | undefined) {
    if (id && confirm('¿Estás seguro de eliminar esta cuenta y todos sus perfiles?')) {
      try {
        await this.accountService.deleteAccount(id);
      } catch (error) {
        console.error('Error al eliminar:', error);
      }
    }
  }
}