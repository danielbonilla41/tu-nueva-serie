import { Component, inject, computed, Signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { DataService } from '../../core/services/data.service';
import { PriceAccount } from '../../models/price-account.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart {
  private dataService = inject(DataService);
  //Señal que contiene los productos en el carrito
  shoppingCart: Signal<PriceAccount[]> = this.dataService.shoppingCartSignal;

  //Constante para el descuento (0.05 = 5%)
  readonly DISCOUNT_RATE = 0.05;

  // ----------------------------------------------------
  // Cálculos Reactivos (Computed Signals)
  // ----------------------------------------------------

  // 1. Calcula el subtotal (suma de todos los precios sin descuento)
  subtotal = computed(() => {
    return this.shoppingCart().reduce((sum, item) => sum + item.price, 0);
  });

  // 2. Determina si se aplica el descuento
  hasDiscount = computed(() => {
    // El descuento se aplica solo si hay más de un producto
    return this.shoppingCart().length > 1;
  });

  // 3. Calcula el valor del descuento
  discountAmount = computed(() => {
    if (this.hasDiscount()) {
      return this.subtotal() * this.DISCOUNT_RATE;
    }
    return 0;
  });

  // 4. Calcula el total final a pagar
  total = computed(() => {
    return this.subtotal() - this.discountAmount();
  });
}
