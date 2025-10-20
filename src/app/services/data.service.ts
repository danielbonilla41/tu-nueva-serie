import { Injectable, signal, Signal} from '@angular/core';
import { PriceAccount } from '../models/price-account.model';

@Injectable({ providedIn: 'root' })
export class DataService {

  private staticData: PriceAccount[] = [
    { name: 'Netflix', price: 12900, numberProfiles: 4 },
    { name: 'Disney+ Premium', price: 7900, numberProfiles: 5 },
    { name: 'PrimeVideo', price: 4900, numberProfiles: 4 },
    { name: 'Max', price: 6900, numberProfiles: 5 }
  ];

  private _priceAccounts = signal<PriceAccount[]>(this.staticData);

  get priceAccountsSignal(): Signal<PriceAccount[]> {
    return this._priceAccounts;
  }

}