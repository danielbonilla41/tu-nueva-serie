import { Injectable, signal, Signal } from '@angular/core';
import { PriceAccount } from '../../models/price-account.model';

@Injectable({ providedIn: 'root' })
export class DataService {

  // Datos estáticos
  private staticData: PriceAccount[] = [
    { name: 'Netflix', price: 12900, iconUrl: 'icons/netflix.png', features: this.featuresNetflix() },
    { name: 'Disney+ Premium', price: 7900, iconUrl: 'icons/disney.png', features: this.featuresDisney() },
    { name: 'PrimeVideo', price: 4900, iconUrl: 'icons/primevideo.png', features: this.featuresPrime() },
    { name: 'Max', price: 6900, iconUrl: 'icons/max.png', features: this.featuresMax() },
    { name: 'Crunchyroll', price: 4900, iconUrl: 'icons/crunchyroll.png', features: this.featuresCrunchyroll() },
    { name: 'Paramount+', price: 5500, iconUrl: 'icons/paramount.png', features: this.featuresParamount() }
  ];

  // Signal para la lista de plataformas (las disponibles)
  private _priceAccounts = signal<PriceAccount[]>(this.staticData);

  // Signal para el Carrito de Compras
  private _shoppingCart = signal<PriceAccount[]>([]);

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

  private featuresNetflix(): string[] {
    return [
      'Acceso ilimitado a películas y series',
      'Descargas para ver sin conexión',
      'Calidad HD y Ultra HD',
      'Perfiles personalizados',
      'Recomendaciones basadas en tu historial de visualización'
    ];
  }

  private featuresDisney(): string[] {
    return [
      'Contenido de Disney, Pixar, Marvel, Star Wars',
      'Descargas ilimitadas en 10 dispositivos',
      'Calidad 4K UHD y HDR',
      'Hasta 4 streams simultáneos',
      'Sin costo adicional por 4K/UHD'
    ];
  }

  private featuresPrime(): string[] {
    return [
      'Envíos gratis de Amazon Prime',
      'Prime Gaming incluido',
      'Calidad 4K Ultra HD',
      'Hasta 3 streams simultáneos',
      'Descargas disponibles'
    ];
  }

  private featuresMax(): string[] {
    return [
      'Contenido de HBO, DC, Warner',
      'Calidad 4K Ultra HD',
      'Descargas offline',
      'Perfiles personalizados',
      'Contenido sin anuncios'
    ];
  }

  private featuresCrunchyroll(): string[] {
    return [
      'Acceso a miles de episodios de anime',
      'Simulcasts al mismo tiempo que Japón',
      'Calidad HD y 4K',
      'Descargas para ver sin conexión',
      'Sin anuncios en la versión premium'
    ];
  }

  private featuresParamount(): string[] {
    return [
      'Acceso a películas y series de Paramount',
      'Contenido exclusivo de CBS, MTV, Nickelodeon',
      'Calidad HD y 4K',
      'Descargas para ver sin conexión',
      'Perfiles personalizados'
    ];
  }
}