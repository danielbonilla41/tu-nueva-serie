import { Component, inject, computed, Signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DataService } from './core/services/data.service';
import { WhatsappFloat } from './shared/whatsapp-float/whatsapp-float';
import { Footer } from './shared/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, WhatsappFloat, Footer],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})

export class App {
  private dataService = inject(DataService);
  title = 'Tu Nueva Serie';

  // Signal para obtener el carrito
  cartItemsSignal: Signal<number> = computed(() =>
    this.dataService.shoppingCartSignal().length
  );

}