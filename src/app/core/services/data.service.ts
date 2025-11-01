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
    { name: 'Paramount+', price: 5500, iconUrl: 'icons/paramount.png', features: this.featuresParamount() },
    { name: 'DGO 1 dispositvo', price: 11000, iconUrl: 'icons/dgo.png', features: this.featuresDgo1() },
    { name: 'DGO 2 dispositivos', price: 15000, iconUrl: 'icons/dgo.png', features: this.featuresDgo2() },
    { name: 'DGO Win Sports +', price: 20000, iconUrl: 'icons/dgo.png', features: this.featuresDgoWin() }
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
      '1 Perfil.',
      '1 mes.',
      'Control de perfiles.',
      'Renovación de cuenta y perfil. *',
      'Acceso ilimitado a películas y series',
      'Descargas para ver sin conexión',
      'Calidad HD y Ultra HD',
      'Recomendaciones basadas en tu historial de visualización'
    ];
  }

  private featuresDisney(): string[] {
    return [
      '1 Perfil.',
      '1 mes.',
      'Control de perfiles.',
      'Renovación de cuenta y perfil. *',
      'Contenido de Disney, Pixar, Marvel, Star Wars',
      'Descargas ilimitadas en 10 dispositivos',
      'Calidad 4K UHD y HDR'
    ];
  }

  private featuresPrime(): string[] {
    return [
      '1 Perfil.',
      '1 mes.',
      'Control de perfiles.',
      'Calidad 4K Ultra HD',
      'Descargas disponibles'
    ];
  }

  private featuresMax(): string[] {
    return [
      '1 Perfil.',
      '1 mes.',
      'Control de perfiles.',
      'Renovación de cuenta y perfil. *',
      'Contenido de HBO, DC, Warner',
      'Calidad 4K Ultra HD',
      'Descargas offline',
      'Contenido sin anuncios'
    ];
  }

  private featuresCrunchyroll(): string[] {
    return [
      'Acceso a miles de episodios de anime',
      'Simulcasts al mismo tiempo que Japón',
      'Calidad HD y 4K',
      'Descargas para ver sin conexión'
    ];
  }

  private featuresParamount(): string[] {
    return [
      'Acceso a películas y series de Paramount',
      'Contenido exclusivo de CBS, MTV, Nickelodeon',
      'Calidad HD y 4K',
      'Descargas para ver sin conexión'
    ];
  }

  private featuresDgo1(): string[] {
    return [
      '1 Perfil.',
      '29 Días',
      'PLAN ORO'
    ];
  }

  private featuresDgo2(): string[] {
    return [
      '2 Perfil.',
      '29 Días',
      'PLAN ORO'
    ];
  }

  private featuresDgoWin(): string[] {
    return [
      '1 Perfil.',
      '29 Días',
      'Win sports +',
      'PLAN ORO'
    ];
  }
}