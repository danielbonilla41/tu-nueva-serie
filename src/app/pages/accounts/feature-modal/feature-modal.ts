import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PriceAccount } from '../../../models/price-account.model';

@Component({
  selector: 'app-feature-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './feature-modal.html',
  styleUrl: './feature-modal.css'
})
export class FeatureModal implements OnChanges {
  // Datos de la plataforma a mostrar
  @Input() platform: PriceAccount | null = null;

  // Evento para notificar al padre que el modal debe cerrarse
  @Output() close = new EventEmitter<void>();

  // Referencia al elemento <dialog> nativo en la plantilla
  @ViewChild('modalDialog') dialog!: ElementRef<HTMLDialogElement>;

  // Detecta cuando el Input 'platform' cambia
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['platform']) {
      if (this.platform) {
        // Si el Input es una plataforma, abrimos el modal
        this.dialog.nativeElement.showModal();
      } else if (this.dialog?.nativeElement.open) {
        // Si el Input es null (se cerró), cerramos el modal
        this.dialog.nativeElement.close();
      }
    }
  }

  // Manejador del botón de cerrar
  onClose(): void {
    // Emitir evento para que el componente padre establezca 'selectedPlatform = null'
    this.close.emit();
  }
}
