import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import {MapsComponent} from './maps/maps.component'
import { AnnotateComponent } from './annotate/annotate.component';

export const rootRouterConfig: Routes = [
  {
    path:'angannotate',component:AnnotateComponent,
    children:[
      { path: 'maps', component: MapsComponent },
      { path: 'home', component: HomeComponent }
    ]
  }
    // { path: '', redirectTo: 'Login', pathMatch: 'full' },
    // { path: 'Login', component: LoginComponent },
    // { path: 'home', component: HomeComponent },
    // { path: 'maps', component: MapsComponent },
  ];
  

// export const rootRouterConfig: Routes = [
//   {
//     path:'angannotate',component:AnnotateComponent,
//     children:[
//       { path: 'maps', component: MapsComponent },
//     ]
//   }
//     // { path: '', redirectTo: 'Login', pathMatch: 'full' },
//     // { path: 'Login', component: LoginComponent },
//     // { path: 'home', component: HomeComponent },
//     // { path: 'maps', component: MapsComponent },
//   ];
  