import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { PaymentMethod } from '../../../models/payment-method';

@Component({
  selector: 'app-payment-modal',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './payment-modal.html',
  styleUrl: './payment-modal.css'
})
export class PaymentModal {

  // Recibe el total a pagar del componente padre
  @Input() totalToPay: number = 0;

  // Señal para mostrar el estado de copiado al usuario
  copyStatus = signal<string | null>(null);

  // Evento para notificar al padre que debe cerrar el modal
  @Output() close = new EventEmitter<void>();

  // Datos de los métodos de pago (pueden ser inyectados de un servicio real)
  paymentMethods: PaymentMethod[] = [
    { name: 'Bre-B o Nequi', qrUrl: 'qr/nequi.jpeg', number: '3125833369' }
  ];

  // Cerrar el modal
  onClose(): void {
    this.close.emit();
  }

  // MÉTODO DE COPIADO
  async copyToClipboard(textToCopy: string): Promise<void> {
    try {
      // 1. Usa la API del portapapeles
      await navigator.clipboard.writeText(textToCopy);
      
      // 2. Muestra la notificación de éxito
      this.copyStatus.set(`¡Copiado!`);
      
      // 3. Oculta la notificación después de 3 segundos
      setTimeout(() => {
        this.copyStatus.set(null);
      }, 3000);

    } catch (err) {
      console.error('Error al copiar el texto: ', err);
      this.copyStatus.set('Error al copiar.');
    }
  }
}
