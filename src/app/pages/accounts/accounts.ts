import { Component, inject, Signal } from '@angular/core';
import { PriceAccount } from '../../models/price-account.model';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './accounts.html',
  styleUrl: './accounts.css'
})
export class Accounts {
  private dataService = inject(DataService);

  priceAccounts: Signal<PriceAccount[]> = this.dataService.priceAccountsSignal;
}
