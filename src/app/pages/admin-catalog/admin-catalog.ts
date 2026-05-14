import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

interface PlatformSummary {
  id: string;
  name: string;
  iconUrl: string;
}

@Component({
  selector: 'app-admin-catalog',
  imports: [CommonModule],
  templateUrl: './admin-catalog.html',
  styleUrl: './admin-catalog.css',
})
export class AdminCatalog {
private router = inject(Router);

  // Lista simplificada para el catálogo administrativo
  public platforms = signal<PlatformSummary[]>([
    { id: 'EI8ifVQtLHj1ovPZ0Kit', name: 'Netflix', iconUrl: 'icons/netflix.png' },
    { id: 'XkMLmz9MArX8kBjgGx1M', name: 'Disney+', iconUrl: 'icons/disney.png' },
    { id: 'f5FnE3aWnC4cg0nqWOxy', name: 'Prime Video', iconUrl: 'icons/primevideo.png' },
    { id: '80Ray05nWcP0YgXrtUnS', name: 'Max', iconUrl: 'icons/max.png' },
    { id: 'tjoYoZytl48ZPppWcxM6', name: 'DGO', iconUrl: 'icons/dgo.png' }
  ]);

  // Método para navegar a la gestión de perfiles
  viewProfiles(accountName: string, accountId: string) {
    this.router.navigate(['admin/accounts', accountName, 'reference', accountId, 'profiles']);
  }
}
