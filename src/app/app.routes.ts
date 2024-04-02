import { Routes } from '@angular/router';
import {AuthService} from "./services/auth.service";
import {inject} from "@angular/core";

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage),
    canActivate: [() => inject(AuthService).shouldLogIn()],
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'app',
    loadComponent: () => import('./pages/tabs/tabs.page').then( m => m.TabsPage),
    canActivate: [() => inject(AuthService).isLoggedIn()],
    children: [
      {
        path: 'todos',
        loadComponent: () => import('./pages/todos/todos.page').then( m => m.TodosPage)
      },
      {
        path: 'todos/:id',
        loadComponent: () => import('./pages/details/details.page').then( m => m.DetailsPage)
      },
      {
        path: 'account',
        loadComponent: () => import('./pages/account/account.page').then( m => m.AccountPage)
      },
      {
        path: '',
        redirectTo: 'todos',
        pathMatch: 'full'
      }
    ]
  },
];
