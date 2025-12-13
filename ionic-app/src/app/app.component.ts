import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private swUpdate: SwUpdate
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Verificar Service Worker
      if (this.swUpdate.isEnabled) {
        console.log('Service Worker está habilitado');
        
        // Verificar actualizaciones
        this.swUpdate.versionUpdates.subscribe(evt => {
          console.log('Service Worker update:', evt);
        });

        // Verificar si hay una nueva versión disponible
        this.swUpdate.checkForUpdate().then(() => {
          console.log('Service Worker: verificando actualizaciones...');
        });
      } else {
        console.log('Service Worker no está habilitado');
      }
    });
  }
}

