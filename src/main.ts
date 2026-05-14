import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app'; // Asegúrate de que tu componente principal se llame App o AppComponent
import { appConfig } from './app/app.config';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));