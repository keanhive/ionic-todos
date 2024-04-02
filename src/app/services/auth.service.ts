import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {API_URL, USER_STORAGE_KEY} from "./constants";
import {BehaviorSubject, filter, map, Observable, switchMap} from 'rxjs';
import {jwtDecode} from "jwt-decode";
import {Storage} from '@ionic/storage-angular';
import {Router, UrlTree} from "@angular/router";

export interface UserData {
    token: string;
    id: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private user: BehaviorSubject<UserData | null | undefined> =
        new BehaviorSubject<UserData | null | undefined>(undefined);
    private httpClient = inject(HttpClient)

    constructor(private storage: Storage) {
        this.initStorage();
        this.loadUser();
    }

    async initStorage() {
      await this.storage.create();
    }

    async loadUser() {
        const data = await this.storage.get(USER_STORAGE_KEY);

        if (data) {
            const decoded: any = jwtDecode(data);
            const userData = {
                token: data,
                id: decoded.sub,
            };
            this.user.next(userData);
        } else {
            this.user.next(null);
        }
    }

    register(email: string, password: string) {
        return this.httpClient.post(`${API_URL}/users`, {email, password})
            .pipe(
                switchMap((user) => {
                    return this.login(email, password);
                })
            );
    }

    login(email: string, password: string) {
        return this.httpClient.post(`${API_URL}/auth`, {email, password})
            .pipe(
                map((res: any) => {
                    this.storage.set(USER_STORAGE_KEY, res.token);

                    const decoded: any = jwtDecode(res.token);
                    const userData = {
                        token: res.token,
                        id: decoded.sub,
                    };

                    this.user.next(userData);
                    return userData;
                })
            );
    }

    async signOut() {
        await this.storage.remove(USER_STORAGE_KEY);
        this.user.next(null);
    }

    getCurrentUser() {
        return this.user.asObservable();
    }

    getCurrentUserId() {
        return this.user.getValue()!.id;
    }

    isLoggedIn(): Observable<boolean | UrlTree> {
        const router = inject(Router);

        return this.getCurrentUser().pipe(
            filter((user) => user !== undefined),
            map((isAuthenticated) => {
                if (isAuthenticated) {
                    return true;
                } else {
                    return router.createUrlTree(['/']);
                }
            })
        );
    }

    shouldLogIn(): Observable<boolean | UrlTree> {
        const router = inject(Router);

        return this.getCurrentUser().pipe(
            filter((user) => user !== undefined),
            map((isAuthenticated) => {
                if (isAuthenticated) {
                    return router.createUrlTree(['/app']);
                } else {
                    return true;
                }
            })
        );
    }
}
