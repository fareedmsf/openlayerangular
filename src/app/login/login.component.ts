import { Component, OnInit } from '@angular/core';
// import {MdTabsModule} from '@angular/material';
import {Http} from '@angular/http';
// import { FormsModule }   from '@angular/forms';
import{FormBuilder,FormControl,FormGroup,Validators}from '@angular/forms';

import {HttpTestService}from '../http-test.service';

import{Router}from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers:[FormBuilder,HttpTestService]

})
export class LoginComponent implements OnInit {
  
  private loginform: FormGroup;
  logeddata:any;
 
  constructor(private LoginFb:FormBuilder,private _httpService:HttpTestService,private _router:Router){ 
   this.loginform =this.LoginFb.group({
   username:['',[Validators.required,this.validateName]],
   password:['',Validators.minLength[4]],
   email:['',Validators.required]
      
    })
  }

  ngOnInit() {
  }


  Login(){

     var logindetails =this.loginform.value;
     console.log(logindetails);
     this._httpService.loginpost(logindetails).subscribe(
      (data)=>{this.logeddata=data,
        this._router.navigate(['/home'])
      },
      (err)=>this.logeddata=err
      
    );
}

  validateName(d:FormControl){
    //return {error:true};
    return null;
  }

}
