import {enableProdMode} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {AppComponent} from './app/app.component';
import {environment} from './environments/environment';
import {appConfig} from "./app/app.config";
import {defineCustomElements} from "@ionic/pwa-elements/loader";

if (environment.production) {
  enableProdMode();
}
bootstrapApplication(AppComponent, appConfig);

defineCustomElements(window);

