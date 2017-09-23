import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import {MapsComponent} from './maps/maps.component'
export const rootRouterConfig: Routes = [

  { path: '', redirectTo: 'Login', pathMatch: 'full' },
  { path: 'Login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'maps', component: MapsComponent },
];
