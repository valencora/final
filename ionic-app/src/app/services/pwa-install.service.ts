import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PwaInstallService {
  private installPrompt: any = null;
  private canInstall$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() {
    this.setupBeforeInstallPrompt();
  }

  private setupBeforeInstallPrompt(): void {
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      // Prevenir el prompt automático
      e.preventDefault();
      // Guardar el evento para usarlo después
      this.installPrompt = e;
      this.canInstall$.next(true);
      console.log('PWA instalable - prompt guardado');
    });

    // Detectar si ya está instalada
    window.addEventListener('appinstalled', () => {
      console.log('PWA instalada');
      this.installPrompt = null;
      this.canInstall$.next(false);
    });
  }

  get canInstall(): Observable<boolean> {
    return this.canInstall$.asObservable();
  }

  get isInstallable(): boolean {
    return this.installPrompt !== null;
  }

  async install(): Promise<boolean> {
    if (!this.installPrompt) {
      console.log('No hay prompt de instalación disponible');
      return false;
    }

    try {
      // Mostrar el prompt de instalación
      this.installPrompt.prompt();
      
      // Esperar a que el usuario responda
      const { outcome } = await this.installPrompt.userChoice;
      
      console.log(`Usuario eligió: ${outcome}`);
      
      // Limpiar el prompt
      this.installPrompt = null;
      this.canInstall$.next(false);
      
      return outcome === 'accepted';
    } catch (error) {
      console.error('Error al instalar PWA:', error);
      return false;
    }
  }
}

