import {Component,OnInit} from '@angular/core';
import * as ol from 'openlayers';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {Headers}from'@angular/http';
import{ HttpTestService } from'../http-test.service';
import { HostListener } from "@angular/core";


var map;
var raster;
var guard_layer;
var vector_data;
var vector_edit;
var draw_style;
var select;
var draw;
var first_pass_length;
var vector_deletions;


@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css'],
  providers:[HttpTestService]
})
export class MapsComponent implements OnInit {
  drawtype =false;
  response=false;
  total_detections:any;
  drawn_features:any;
  deleted_features:any;
  response_Msg:any;
  //centerfocus= '../assets/img/centerfocus.png';
 
  getData:any;
  constructor(private _httpService: HttpTestService){
  
  }
  
  ngOnInit(){
    // console.log(map);  
      //Map containing all the layers
    // select =  
    //  var extent= [0,-554,554,0]; 
  var extent_view=[0,-1.1*554,1.1*554,0];
  var projection = new ol.proj.Projection({
        code: '',
        units: 'pixels',
        extent: [0,-554,554,0]
      });

   raster=new ol.layer.Image({
          source:new ol.source.ImageStatic({
            //attributions:'© <a href="http://xkcd.com/license.html">xkcd</a>',
            url:'http://mouse.brainarchitecture.org/webapps/adore-djatoka/resolver?url_ver=Z39.88-2004&rft_id=MouseBrain/433094&svc_id=info:lanl-repo/svc/getRegion&svc_val_fmt=info:ofi/fmt:kev:mtx:jpeg2000&svc.format=image/jpeg&svc.level=8&svc.rotate=0&svc.region=9728,15360,554,554&svc.crange=0-255,0-255,0-255&svc.gamma=1',
            projection:projection,
            imageExtent:[0,-554,554,0]
      })
   })

   guard_layer = new ol.layer.Vector({
      source : new ol.source.Vector({
      format: new ol.format.GeoJSON()}),
      style: new ol.style.Style({
        fill: new ol.style.Fill({
          color: 'rgba(255, 255, 255, 0)'
        }),
        stroke: new ol.style.Stroke({
          color: '#00000',
          width: 4,
          lineDash :[5,5] 
        })
      })
    });


    guard_layer.set('name','guardlayer')
    var feat;
    feat = new ol.Feature(new ol.geom.Polygon([[[21,-21],[554-21,-21],[554-21,21-554],[21,21-554],[21,-21]]]));
    feat.set('name','guard');
    guard_layer.getSource().addFeature(feat);


    var source_edit = new ol.source.Vector({
      wrapX: false,
      features: (new ol.format.GeoJSON()).readFeatures({'type': 'FeatureCollection', 'features': []})
    });


    vector_edit = new ol.layer.Vector({
            source: source_edit,
            style: new ol.style.Style({
              fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0)'
              }),
              stroke: new ol.style.Stroke({
                color: '#00ff00',
                width: 2
              }),
              image: new ol.style.Circle({
                radius: 7,
                fill: null,
                stroke: new ol.style.Stroke({
                  color: '#000000',
                  width: 2
                }),
              })
            })
     });

    vector_data = new ol.layer.Vector({
        source : new ol.source.Vector({
        wrapX: false,
        }),
        style: new ol.style.Style({
          fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0)'
            
          }),
          stroke: new ol.style.Stroke({
            color: '#000000',
            width: 2
          }),
          image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
              color: '#ffcc33'
            })
          })
       })
      });

  

  vector_edit = new ol.layer.Vector({
      source: source_edit,
      style: new ol.style.Style({
        fill: new ol.style.Fill({
          color: 'rgba(255, 255, 255, 0)'
        }),
        stroke: new ol.style.Stroke({
          color: '#00ff00',
          width: 2
        }),
        image: new ol.style.Circle({
          radius: 7,
          fill: null,
          stroke: new ol.style.Stroke({
            color: '#000000',
            width: 2
          }),
        })
      })
    });


    vector_deletions = new ol.layer.Vector({
         source: new ol.source.Vector({wrapX:false}),
         visible:false,
          style: new ol.style.Style({
     fill: new ol.style.Fill({
       color: 'rgba(255, 255, 255, 0)'
            }),
        stroke: new ol.style.Stroke({
          color: '#ff0000',
           width: 2
         }),
         image: new ol.style.Circle({
           radius: 7,
           fill: new ol.style.Fill({
             color: '#ff0000'
           })
         })
       })
     });

    
    draw_style = new ol.style.Style({
        fill: new ol.style.Fill({
          color: 'rgba(255, 255, 255, 0)'
        }),
        stroke: new ol.style.Stroke({
          color: '#ff00ff',
          width: 2
        }),
        image: new ol.style.Circle({
          radius: 4,
          fill : new ol.style.Fill({
            color : 'rgba(0,0,255,1)' 
        }),
          stroke: new ol.style.Stroke({
             color: '#0000ff',
             width: 2
          })
      }),
      });


    //   //mouse positions
  var mousePositionControl = new ol.control.MousePosition({
       coordinateFormat: ol.coordinate.createStringXY(4),
       projection: 'EPSG:4326',
       // comment the following two lines to have the mouse position
       // be placed within the map.
       className: 'custom-mouse-position',
     //  target: document.getElementById('mouse-position'),
        target:(<HTMLInputElement>document.getElementById('mouse_positions')),
       undefinedHTML: '&nbsp;'
     });


    //select 
  select = new ol.interaction.Select( { 
           wrapX: false, 
           filter: function(feature,layer) {
               if(layer.get('name')=='guardlayer')
                   return false;
               return true;
           }
    });



  
    
  map=new ol.Map({
        interactions: ol.interaction.defaults().extend([select]),
        controls: ol.control.defaults({
         attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
           collapsible: false
         })
       }).extend([mousePositionControl]),
        layers:[raster,guard_layer,vector_deletions,vector_data,vector_edit],
        target:'map',
        view:new ol.View({
          projection:projection,
          center:ol.extent.getCenter([0,-554,554,0]),
          zoom:1,
          maxZoom:4,
          minZoom:1,
          extent:[0,-1.1*554,1.1*554,0],
        })
    })

   map.removeInteraction(select);
    
   this.getpolygons();
  
  this.maponclick();
  this.vectoredit_on();
    
  }

  vectoredit_on(){
    var this_ = this;
    function up_count (this_){
      this_.updateCounts()};

    vector_edit.on('change',function(){
      console.log("changeing");
      up_count(this_);
    
    })
  }


maponclick(){

    var this_ = this;
    function up_count (this_){
      this_.updateCounts()};

      map.on('click', function(evt) {
    //  if (evt.dragging) return;
    //  if (intSelect.value!='Delete') return;
    var selectvalue=(<HTMLInputElement>document.getElementById('modetype')).value;
       if (evt.dragging) return;
       if (selectvalue!='delete') return;  


    var pixel = map.getEventPixel(evt.originalEvent);
    var feature = map.forEachFeatureAtPixel(pixel,
        function(feature, layer) {
            var layername = layer.get('name');
            if(layername=='guardlayer')
                return undefined;
            return feature;
        });
    if (feature!== undefined){
      
      var featureid = feature.getId();
      //var firstpass = vector_data.getSource().getFeatures();
      //var featurearr= vector_edit.getSource().getFeatures();
      var featureprops = feature.getProperties();

      if(featureid==undefined || featureid > first_pass_length)
        {
          if(featureprops.hasOwnProperty('name') && featureprops.name=='guard')
            return;
          vector_edit.getSource().removeFeature(feature);        
        }
      else 
        {    
            vector_data.getSource().removeFeature(feature);
            vector_deletions.getSource().addFeature(feature);
        }

      }
        up_count(this_);
  });
  
}


getpolygons(){
   this._httpService.getfirstpasspolygons().subscribe(
     data=>{this.getData=data;
     this.add_polygon_feature(data);
     console.log(data);
  },
    error=>alert(error),
 ); 
  
}

add_polygon_feature(getData){
  //Add features to the vector_data -- Firstpass

  console.log(getData[0].firstpass);
  var json_data;
  var temp_json=getData[0].firstpass;
  var temp_draw =getData[0].drawnfeat;
  var draw_data;
  var deleted_ids= getData[0].deletedids;

  // This is to add firstpass data to the vector_data layer. The addition is done based on considering the deleted
  // ids. If the id is present in deleted id list then the polygon is added to the delete layer.
  if(temp_json.length!=0)
    json_data = (new ol.format.GeoJSON()).readFeatures( getData[0].firstpass);
  else
    json_data=(new ol.format.GeoJSON()).readFeatures({'type': 'FeatureCollection', 'features': []});

    for (var i in json_data){ 
      if (deleted_ids.indexOf(json_data[i].getId()) !=-1){
        vector_deletions.getSource().addFeature(json_data[i]);
      }
      else{
        vector_data.getSource().addFeature(json_data[i]);
      }
    }
  
  // This is to add the polygons drawn by the user. 
  if(temp_draw.length!=0)
   draw_data = (new ol.format.GeoJSON()).readFeatures(getData[0].drawnfeat);
  else
    draw_data=(new ol.format.GeoJSON()).readFeatures({'type': 'FeatureCollection', 'features': []})

    vector_edit.getSource().addFeatures(draw_data);
  /*
    for (var i in draw_data){
      vector_edit.getSource().addFeature(draw_data[i]);
    }
    */
  this.updateCounts();

}

addInteraction(devicevalue) {

 // var devicevalue = (<HTMLInputElement>document.getElementById('modetype')).value;
  // var value;
  if (devicevalue !== 'None') {
        console.log('In');
        draw = new ol.interaction.Draw({
          source:vector_edit.getSource(),
          type: devicevalue,
          style:draw_style,   
      });
        map.addInteraction(draw);
     }
} 

//Events  
onChangeGeometry(deviceValue) {
  this.addInteraction(deviceValue);  
}

onchangeMode(mode){
  console.log(mode);
  if (mode == "draw"){
     map.removeInteraction(select);
     this.drawtype =true;
    //  this.addInteraction("Point");
    }
  if (mode == "view"){
    map.removeInteraction(draw);
    map.removeInteraction(select);
    this.drawtype =false;
    
    }
  if (mode == "delete"){
     map.removeInteraction(draw);
    map.addInteraction(select);
    this.drawtype =false;
  }
    
}



groundtruth(event){
  console.log("ground");
  if(event.target.checked){
    vector_data.setVisible(true);
  }
  else{
    vector_data.setVisible(false);
  }

}

userdraw(event){
console.log("userdrw")
  if(event.target.checked){
    vector_edit.setVisible(true);
  }
  else{
    vector_edit.setVisible(false);
  }
}

userdel(event){
console.log("userdel")
if(event.target.checked){
    vector_deletions.setVisible(true);
  }
  else{
    vector_deletions.setVisible(false);
  }

}

@HostListener('window:keydown',['$event'])
eventHandler(event:KeyboardEvent){
  var pressedkey = event.code;
  console.log(pressedkey);
  if (pressedkey == 'Escape'){  
    map.removeInteraction(select);
    var device_state=(<HTMLInputElement>document.getElementById('modetype')).value;
    var draw_state = (<HTMLInputElement>document.getElementById('type')).value;
    if(device_state=='draw') 
      {
        map.removeInteraction(draw);
        this.addInteraction(draw_state);
      }
    } 

  }

    setDefault(){
      map.getView().setZoom(1);
      map.getView().setCenter([554/2,-554/2]);
    }

    updateCounts(){
       this.total_detections=vector_data.getSource().getFeatures().length;
       this.drawn_features=vector_edit.getSource().getFeatures().length;
       this.deleted_features=vector_deletions.getSource().getFeatures().length;
    }


    postFeature(){
     this.response=true;
     this.response_Msg="Saving";
     var features_new = vector_edit.getSource().getFeatures();
     var  features_del = vector_deletions.getSource().getFeatures();
     var del_feat_id = [];   
     var added_features = [];
     var post_data;
     for ( var i in features_del){
      del_feat_id.push(features_del[i].getId());
    }
  
    for( var i in features_new){
      var temp_features = new ol.format.GeoJSON().writeFeature(features_new[i]);
      added_features.push(JSON.parse(temp_features));
    }
    var final_features;
    final_features = {'type':'FeatureCollection','features':added_features};

    console.log(del_feat_id);
    console.log(added_features);
    post_data={"deletedids":del_feat_id,"drawnfeat":JSON.stringify(final_features)};

    this._httpService.postfeatures(post_data).subscribe(
      (response)=>{
       var status = response.json()[0];
       if (status == "Success"){
          this.response_Msg="Saved"
          this.response=false;
       }
      }
    );
   }

  } 

      

     
 
    
