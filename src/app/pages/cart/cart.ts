import { Component, inject, computed, Signal, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { DataService } from '../../core/services/data.service';
import { PriceAccount } from '../../models/price-account.model';
import { PaymentModal } from './payment-modal/payment-modal';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, PaymentModal],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart {
  private dataService = inject(DataService);
  copied = false;
  // Señal para controlar la visibilidad del modal de pago
  isPaymentModalOpen = signal(false);
  //Señal que contiene los productos en el carrito
  shoppingCart: Signal<PriceAccount[]> = this.dataService.shoppingCartSignal;
  //Objeto que define las tasas de descuento
  readonly DISCOUNTS = {
    TWO_ITEMS: 0.05, // 5%
    THREE_ITEMS: 0.07, // 7%
    FOUR_OR_MORE_ITEMS: 0.10 // 10%
  };

  ngOnInit(): void {
    window.scrollTo(0, 0); 
  }

  // ----------------------------------------------------
  // Cálculos Reactivos (Computed Signals)
  // ----------------------------------------------------

  // 1. Calcula el subtotal (suma de todos los precios sin descuento)
  subtotal = computed(() => {
    return this.shoppingCart().reduce((sum, item) => sum + item.price, 0);
  });

  // 2. Determina la tasa de descuento actual
  currentDiscountRate = computed(() => {
    const count = this.shoppingCart().length;

    if (count >= 4) {
      return this.DISCOUNTS.FOUR_OR_MORE_ITEMS; // 10%
    } else if (count === 3) {
      return this.DISCOUNTS.THREE_ITEMS; // 7%
    } else if (count === 2) {
      return this.DISCOUNTS.TWO_ITEMS; // 5%
    }
    return 0; // 0% para 0 o 1 cuenta
  });

  // 3. Determina el porcentaje de descuento a mostrar
  displayDiscountPercentage = computed(() => {
    return Math.round(this.currentDiscountRate() * 100);
  });

  // 4. Determina si se aplica cualquier descuento
  hasDiscount = computed(() => {
    return this.shoppingCart().length >= 2;
  });

  // 5. Calcula el valor del descuento
  discountAmount = computed(() => {
    // Usa la tasa de descuento dinámica
    return this.subtotal() * this.currentDiscountRate();
  });

  // 6. Calcula el total final a pagar
  total = computed(() => {
    return this.subtotal() - this.discountAmount();
  });

  // Eliminar producto del carrito
  removeFromCart(platform: PriceAccount): void {
    this.dataService.removeFromCart(platform);
  }

  // Método para abrir el modal
  openPaymentModal(): void {
    if (this.total() > 0) {
      this.isPaymentModalOpen.set(true);
    }
  }

  // Nuevo método para cerrar el modal
  closePaymentModal(): void {
    this.isPaymentModalOpen.set(false);
  }

  /**Copiar número de Nequi al portapapeles */
  copyNequiNumber(): void {
    const nequiNumber = '3125833369';
    navigator.clipboard.writeText(nequiNumber)
      .then(() => {
        this.copied = true;
        setTimeout(() => this.copied = false, 2000); // mensaje por 2 segundos
      })
      .catch(err => console.error('No se pudo copiar', err));
  }
}