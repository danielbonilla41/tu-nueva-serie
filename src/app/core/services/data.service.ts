import { Injectable, signal, Signal } from '@angular/core';
import { PriceAccount } from '../../models/price-account.model';

@Injectable({ providedIn: 'root' })
export class DataService {

  // Datos estáticos
  private staticData: PriceAccount[] = [
    { name: 'Netflix', price: 12900, iconUrl: 'icons/netflix.png' },
    { name: 'Disney+ Premium', price: 7900, iconUrl: 'icons/disney.png' },
    { name: 'PrimeVideo', price: 4900, iconUrl: 'icons/primevideo.png' },
    { name: 'Max', price: 6900, iconUrl: 'icons/max.png' },
    { name: 'Crunchyroll', price: 4900, iconUrl: 'icons/crunchyroll.png' },
    { name: 'Paramount+', price: 5500, iconUrl: 'icons/paramount.png' }
  ];

  // Signal para la lista de plataformas (las disponibles)
  private _priceAccounts = signal<PriceAccount[]>(this.staticData);

  // Signal para el Carrito de Compras
  private _shoppingCart = signal<PriceAccount[]>([]);

  // ----------------------------------------------------
  // Métodos Públicos
  // ----------------------------------------------------

  // Getter para las plataformas disponibles
  get priceAccountsSignal(): Signal<PriceAccount[]> {
    return this._priceAccounts;
  }

  // Getter para el carrito (para usar en otro componente)
  get shoppingCartSignal(): Signal<PriceAccount[]> {
    return this._shoppingCart;
  }

  /**
   * Añade una plataforma al carrito de compras.
   * Utiliza .update() para modificar la Signal de forma inmutable.
   */
  addToCart(platform: PriceAccount): void {
    this._shoppingCart.update(currentCart => {
      // Opcional: Evita duplicados si la plataforma ya está en el carrito
      const isAlreadyInCart = currentCart.some(item => item.name === platform.name);

      if (!isAlreadyInCart) {
        // Devuelve el nuevo array con la plataforma añadida
        return [...currentCart, platform];
      }
      return currentCart; // Si ya está, devuelve el carrito sin cambios
    });
    console.log(`${platform.name} añadido al carrito.`);
  }

  // El método de eliminación es correcto si solo hay una instancia de cada plataforma.
  removeFromCart(platformToRemove: PriceAccount): void {
    this._shoppingCart.update(currentCart => {
        const index = currentCart.findIndex(
            item => item.name === platformToRemove.name
        );

        if (index > -1) {
            const newCart = [...currentCart];
            newCart.splice(index, 1); 
            return newCart;
        }
        return currentCart;
    });
  }
}