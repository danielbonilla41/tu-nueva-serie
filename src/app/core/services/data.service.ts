import { inject, Injectable, signal, Signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PriceAccount } from '../../models/price-account.model';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, catchError, shareReplay } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class DataService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly firestore = inject(Firestore, { optional: true });

  // Signal para el Carrito de Compras
  private readonly _shoppingCart = signal<PriceAccount[]>([]);

  /**
   * Obtiene las cuentas directamente desde Firestore.
   * Si no hay conexión o estamos en el servidor, devuelve un array vacío.
   */
  private getAccountsObservable(): Observable<PriceAccount[]> {
    const isBrowser = isPlatformBrowser(this.platformId);

    if (!isBrowser || !this.firestore) {
      return of([]);
    }

    const accountsRef = collection(this.firestore, 'accounts');
    
    return (collectionData(accountsRef, { idField: 'id' }) as Observable<any[]>).pipe(
      map(items => items.map(item => ({
        id: item.id,
        name: item.name || 'Sin nombre',
        price: item.price || 0,
        description: item.description || '',
        iconUrl: item.iconUrl || item.icon_url || 'icons/default.png',
        features: item.features || []
      } as PriceAccount))),
      catchError(err => {
        console.error('🔥 Error al conectar con Firestore:', err);
        return of([]);
      }),
      shareReplay(1)
    );
  }

  // Transformamos el Observable a Signal con valor inicial vacío
  private readonly _priceAccounts = toSignal(this.getAccountsObservable(), {
    initialValue: []
  });

  // --- GETTERS ---

  get priceAccountsSignal(): Signal<PriceAccount[]> {
    return this._priceAccounts;
  }

  get shoppingCartSignal(): Signal<PriceAccount[]> {
    return this._shoppingCart;
  }

  // --- ACCIONES DEL CARRITO ---

  addToCart(platform: PriceAccount): void {
    this._shoppingCart.update(cart => {
      if (cart.some(item => item.id === platform.id)) return cart;
      return [...cart, platform];
    });
  }

  removeFromCart(platformToRemove: PriceAccount): void {
    this._shoppingCart.update(cart => 
      cart.filter(item => item.id !== platformToRemove.id)
    );
  }
}