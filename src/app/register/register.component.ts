import { Component, OnInit } from '@angular/core';

import {Http} from '@angular/http';
import{FormBuilder,FormControl,FormGroup,Validators}from '@angular/forms';
import {HttpTestService}from '../http-test.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers:[FormBuilder,HttpTestService]

})
export class RegisterComponent implements OnInit {
  postData: any;
  private regform: FormGroup;
  constructor(private RegisterFb:FormBuilder,private _httpService:HttpTestService) {

   this.regform=this.RegisterFb.group({
    username:['',Validators.required],
    email:['',Validators.required],
    password1:['',Validators.required],
    password2:['',Validators.required]
  });
   }

  ngOnInit() {

  }


Register(){
  
  var details =this.regform.value;

  console.log(details);
   this._httpService.PostJson(details).subscribe(
    // data=>this.postData=data,
    // error=>alert(error),
   );

}

validateName(c:FormControl){
    //return {error:true};
    return null;
  }

}
