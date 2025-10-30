import { Component } from '@angular/core';

@Component({
  selector: 'app-whatsapp-float',
  imports: [],
  templateUrl: './whatsapp-float.html',
  styleUrl: './whatsapp-float.css'
})
export class WhatsappFloat {
phoneNumber = '573209911030';
  message = 'Hola! Necesito ayuda con mi pedido.';

  // URL generada para la redirección
  whatsappUrl = `https://wa.me/${this.phoneNumber}?text=${encodeURIComponent(this.message)}`;
}
