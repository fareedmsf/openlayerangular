import {Injectable}from  '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {Headers}from'@angular/http';

@Injectable()
export class HttpTestService{
    
constructor(private _http: Http){}


getCurrentTime(){
return this._http.get('http://mitradevel.cshl.org/table/get').map(res=>res.json());
}


PostJson(forms){
var params = forms;
return this._http.post('http://mitradevel.cshl.org/table/rest-auth/registration/',params)//.map(res=>res.json());
}

loginpost(logindetails){
var params = logindetails;
return this._http.post('http://mitradevel.cshl.org/table/rest-auth/login/',params)
}


    //for polygons
getfirstpasspolygons(){
return this._http.get('http://mitradevel.cshl.org/nisslapi/getfirstpass/')
                 .map(res=>res.json());
}



postfeatures(forms){
var json =JSON.stringify(forms);
var params = json;
var headers =new Headers();     
headers.append('content-Type','application/x-www-form-urlencoded');
return this._http.post('http://mitradevel.cshl.org/nisslapi/getsavedata/',params,
{
   headers:headers

}).map(res=>res.json());
}

}