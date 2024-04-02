import {ApplicationConfig, importProvidersFrom, inject} from '@angular/core';
import {provideRouter, RouteReuseStrategy} from '@angular/router';

import {routes} from './app.routes';
import {IonicRouteStrategy, provideIonicAngular} from "@ionic/angular/standalone";
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import {Drivers} from '@ionic/storage';
import {IonicStorageModule} from "@ionic/storage-angular";
import {
    HttpInterceptorFn,
    provideHttpClient, withInterceptors,
} from '@angular/common/http';
import { from, switchMap } from 'rxjs';
import { USER_STORAGE_KEY } from 'src/app/services/constants';
import {Storage} from '@ionic/storage-angular';


export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const storage = inject(Storage);
    const tokenObs = from(storage.get(USER_STORAGE_KEY));

    return tokenObs.pipe(
        switchMap((token) => {
            if (token) {
                req = req.clone({
                    setHeaders: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            }

            return next(req);
        })
    );
};
export const appConfig: ApplicationConfig = {
    providers: [
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
        provideIonicAngular(),
        provideRouter(routes),
        provideHttpClient(withInterceptors([authInterceptor])),
        importProvidersFrom(
            IonicStorageModule.forRoot({
                driverOrder: [
                    CordovaSQLiteDriver._driver,
                    Drivers.IndexedDB,
                    Drivers.LocalStorage,
                ],
            })
        ),
    ],
};
