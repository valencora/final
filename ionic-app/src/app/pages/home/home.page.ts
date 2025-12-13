import { Component, OnInit } from '@angular/core';
import { BlogService, Blog } from '../../services/blog.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  blogs: Blog[] = [];
  loading = false;

  constructor(
    private blogService: BlogService,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  async ngOnInit() {
    await this.login();
    await this.loadBlogs();
  }

  async login() {
    try {
      await firstValueFrom(this.blogService.login('admin', 'admin'));
    } catch (error) {
      // Falla silenciosamente - la app puede funcionar offline
      console.log('Login no disponible (modo offline)');
    }
  }

  async loadBlogs() {
    const loading = await this.loadingController.create({
      message: 'Cargando blogs...'
    });
    await loading.present();

    try {
      this.blogs = await firstValueFrom(this.blogService.getAllBlogs()) || [];
    } catch (error: any) {
      // El servicio ya intenta usar caché automáticamente
      // Si aún así falla, simplemente dejamos blogs vacío
      console.log('Error loading blogs, usando caché si está disponible');
    } finally {
      await loading.dismiss();
    }
  }

  async refresh(event: any) {
    await this.loadBlogs();
    event.target.complete();
  }
}

