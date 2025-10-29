import { Component, inject, Signal, signal } from '@angular/core';
import { PriceAccount } from '../../models/price-account.model';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { DataService } from '../../core/services/data.service';
import { FeatureModal } from './feature-modal/feature-modal';
@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, FeatureModal],
  templateUrl: './accounts.html',
  styleUrl: './accounts.css'
})

export class Accounts {
  private dataService = inject(DataService);

  priceAccounts: Signal<PriceAccount[]> = this.dataService.priceAccountsSignal;
  //Signal para la plataforma activa en el modal (null si está cerrado)
  selectedPlatform = signal<PriceAccount | null>(null);

  // Método para manejar el clic del botón
  addToCart(account: PriceAccount): void {
    this.dataService.addToCart(account);
  }

  // Abre el modal, estableciendo la plataforma seleccionada
  openFeaturesModal(platform: PriceAccount): void {
    this.selectedPlatform.set(platform);
  }

  //Cierra el modal, reseteando la plataforma a null
  closeFeaturesModal(): void {
    this.selectedPlatform.set(null);
  }
}
