import { Component, EventEmitter, signal } from '@angular/core';
import { PaymentMethod } from '../../models/payment-method';
@Component({
  selector: 'app-means-payment',
  imports: [],
  templateUrl: './means-payment.html',
  styleUrl: './means-payment.css'
})
export class MeansPayment {

  close = new EventEmitter<void>();

  paymentMethods: PaymentMethod[] = [
    { name: 'Bre-B o Nequi', qrUrl: 'qr/nequi.jpeg', number: '3125833369' }
  ];

  // Señal para mostrar el estado de copiado al usuario
  copyStatus = signal<string | null>(null);

  ngOnInit(): void {
    window.scrollTo(0, 0);
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

  // Cerrar el modal
  onClose(): void {
    this.close.emit();
  }
}
