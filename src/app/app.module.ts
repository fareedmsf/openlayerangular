import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { rootRouterConfig } from './app.routes';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MdCardModule} from '@angular/material';
import {MdTabsModule} from '@angular/material';

import { HomeComponent } from './home/home.component';
import { HttpModule } from '@angular/http';
import { Ng2TableModule } from 'ng2-table/ng2-table';
//import { PaginationModule } from 'ngx-bootstrap/pagination';
import {HttpTestService}from './http-test.service';  
import { PaginationModule } from 'ngx-bootstrap';
import{ReactiveFormsModule}from '@angular/forms'
import { FormsModule }   from '@angular/forms';
import { RegisterComponent } from './register/register.component';
import { Table2Component } from './table2/table2.component';
import { MapsComponent } from './maps/maps.component';
import { AnnotateComponent } from './annotate/annotate.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    RegisterComponent,
    Table2Component,
    MapsComponent,
    AnnotateComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MdCardModule,
    MdTabsModule,
    Ng2TableModule,
    PaginationModule,
    PaginationModule,
    HttpModule,
    ReactiveFormsModule,
    FormsModule,
    PaginationModule.forRoot(),

  //  RouterModule.forRoot(rootRouterConfig, { useHash: true }),
    RouterModule.forRoot(rootRouterConfig, { }),



  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
