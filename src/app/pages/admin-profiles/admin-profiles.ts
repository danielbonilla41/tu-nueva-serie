import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AccountService } from '../../core/services/account.service';
import { AccountProfile } from '../../models/account-profile';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface SaleData {
  phone: string;
  startDate: string;
  endDate: string;
  profileIndex: number;
  account: AccountProfile | null;
  mode: 'vender' | 'renovar';
}

@Component({
  selector: 'app-admin-profiles',
  standalone: true,
  templateUrl: './admin-profiles.html',
  styleUrls: ['./admin-profiles.css'],
  imports: [CommonModule, FormsModule, RouterLink]
})
export class AdminProfilesComponent implements OnInit {
  private accountService = inject(AccountService);
  private route = inject(ActivatedRoute);
  private location = inject(Location);

  // --- Signals de Estado ---
  platformId = signal<string>('');
  platformName = signal<string>('');
  accounts = signal<AccountProfile[]>([]);
  showDetailModal = signal<boolean>(false);
  selectedAccount = signal<AccountProfile | null>(null);
  selectedProfile = signal<any>(null);
  selectedProfileIndex = signal<number>(-1);

  // Gestión de edición inline superior
  editingAccountId = signal<string | null>(null);
  tempEditingAccount = signal<AccountProfile | null>(null);

  // Modales de venta/renovación rápida
  showModal = signal<boolean>(false);
  saleForm = signal<SaleData>({
    phone: '',
    startDate: '',
    endDate: '',
    profileIndex: -1,
    account: null,
    mode: 'vender'
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    const name = this.route.snapshot.paramMap.get('name');
    if (id) {
      this.platformId.set(id);
      this.platformName.set(name || '');
      this.loadData();
    }
  }

  loadData() {
    this.accountService.getAccountsByPlatform(this.platformId()).subscribe({
      next: (res) => this.accounts.set(res),
      error: (err) => console.error('Error al cargar cuentas:', err)
    });
  }

  goBack() {
    this.location.back();
  }

  startEdit(acc: AccountProfile) {
    if (!acc.id) return;
    this.editingAccountId.set(acc.id);
    this.tempEditingAccount.set(structuredClone(acc));
  }

  cancelEdit() {
    this.editingAccountId.set(null);
    this.tempEditingAccount.set(null);
  }

  async saveInlineEdit() {
    const updatedAcc = this.tempEditingAccount();
    if (updatedAcc && updatedAcc.id) {
      try {
        await this.accountService.updateAccount(updatedAcc.id, updatedAcc);
        this.accounts.update(list => list.map(a => a.id === updatedAcc.id ? updatedAcc : a));
        this.cancelEdit();
      } catch (error) {
        console.error('Error al actualizar:', error);
        alert('No se pudo guardar la información.');
      }
    }
  }

  async onToggleSold(account: AccountProfile, index: number) {
    if (this.editingAccountId() === account.id) {
      const temp = this.tempEditingAccount();
      if (temp) {
        temp.profiles[index].sold = !temp.profiles[index].sold;
        this.tempEditingAccount.set({ ...temp });
      }
    } else if (account.id) {
      const updatedProfiles = [...account.profiles];
      updatedProfiles[index].sold = !updatedProfiles[index].sold;

      try {
        await this.accountService.updateAccount(account.id, { profiles: updatedProfiles });
        this.accounts.update(list => list.map(a => a.id === account.id ? { ...a, profiles: updatedProfiles } : a));
      } catch (error) {
        console.error('Error al actualizar estado:', error);
      }
    }
  }

  openSaleModal(acc: AccountProfile, index: number, mode: 'vender' | 'renovar') {
    const today = new Date();
    const profile = acc.profiles[index];
    const end = new Date();
    end.setMonth(today.getMonth() + 1);
    if (mode === 'vender') end.setDate(today.getDate() - 1);

    this.saleForm.set({
      phone: mode === 'renovar' ? (profile.phone_number || '') : '',
      startDate: today.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
      profileIndex: index,
      account: acc,
      mode: mode
    });
    this.showModal.set(true);
  }

  async confirmSale() {
    const form = this.saleForm();
    if (!form.account || form.profileIndex === -1) return;

    const updatedProfiles = [...form.account.profiles];
    const targetProfile = updatedProfiles[form.profileIndex];

    targetProfile.phone_number = form.phone;
    targetProfile.purchase_date = form.startDate;
    targetProfile.renewal_date = form.endDate;
    targetProfile.sold = true;
    if (!targetProfile.sold_id) targetProfile.sold_id = crypto.randomUUID();

    try {
      await this.accountService.updateAccount(form.account.id!, { profiles: updatedProfiles });
      this.accounts.update(list => list.map(a => a.id === form.account!.id ? { ...a, profiles: updatedProfiles } : a));
      this.showModal.set(false);
    } catch (error) {
      console.error(error);
    }
  }

  openProfileDetailModal(account: AccountProfile, profile: any, index: number) {
    this.selectedAccount.set(account);
    this.selectedProfileIndex.set(index);
    this.selectedProfile.set(structuredClone(profile));
    this.showDetailModal.set(true);
  }

  triggerUpdateOrSell() {
    const acc = this.selectedAccount();
    const index = this.selectedProfileIndex();
    const mode = this.selectedProfile().sold ? 'renovar' : 'vender';

    this.showDetailModal.set(false);
    if (acc) this.openSaleModal(acc, index, mode);
  }

  triggerToggleStatus() {
    const acc = this.selectedAccount();
    const index = this.selectedProfileIndex();

    if (acc) {
      this.onToggleSold(acc, index);
      this.selectedProfile.set({
        ...this.selectedProfile(),
        sold: !this.selectedProfile().sold
      });
    }
  }

  async saveProfileChanges() {
    const acc = this.selectedAccount();
    const index = this.selectedProfileIndex();
    const updatedProfile = this.selectedProfile();

    if (acc && acc.id && index !== -1 && updatedProfile) {
      const updatedProfiles = [...acc.profiles];
      updatedProfiles[index] = updatedProfile;

      try {
        await this.accountService.updateAccount(acc.id, { profiles: updatedProfiles });
        this.accounts.update(list => list.map(a => a.id === acc.id ? { ...a, profiles: updatedProfiles } : a));
        this.showDetailModal.set(false);
      } catch (error) {
        console.error('Error al guardar cambios del perfil:', error);
      }
    }
  }

  copyAccountInfo() {
    const email = this.selectedAccount()?.email;
    const password = this.selectedAccount()?.password;
    const profileName = this.selectedProfile()?.name;
    const pin = this.selectedProfile()?.pin || 'Sin PIN';
    const platform = this.platformName() ? this.platformName().toUpperCase() : 'STREAMING';

    const textToCopy = `🍿 🎉 *¡Gracias por tu compra en www.tunuevaserie.com!*
  
✨ *DATOS DE ACCESO - ${platform}*
────────────────────────
📧 *Correo:* \`${email}\`
🔑 *Clave:* \`${password}\`
👤 *Perfil:* ${profileName}
🔢 *PIN:* ${pin}
────────────────────────

📌 *REGLAS DE USO IMPORTANTES:*
⚠️ Uso exclusivo en *1 solo dispositivo* a la vez.
🚫 Prohibido modificar el perfil (nombre, imagen o PIN).
🚫 Prohibido cambiar los datos generales de la cuenta.

🔍 _Cualquier infracción detectada causará la suspensión del servicio sin previo aviso y sin derecho a reembolso._`;

    navigator.clipboard.writeText(textToCopy).then(() => {
      console.log('Datos de acceso copiados.');
    }).catch(err => {
      console.error('Error al copiar', err);
    });
  }

  copySingleField(value: string | undefined, fieldName: string) {
    if (!value) return;

    navigator.clipboard.writeText(value).then(() => {
      console.log(`${fieldName} copiado al portapapeles.`);
    }).catch(err => {
      console.error('Error al copiar el campo:', err);
    });
  }
}