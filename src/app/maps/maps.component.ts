import {Component,OnInit} from '@angular/core';
declare var ol: any;
//import {TableData} from '../data';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {Headers}from'@angular/http';
import{ HttpTestService } from'../http-test.service';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css'],
  providers:[HttpTestService]
})
export class MapsComponent implements OnInit {
  postData: string;
  getData: any;
  // userForm: any;
  // postData: string;
  // datas:any;
 //ol: any;
  draw_type : any;
  draw:any;
  source:any;
  map:any;
  vector :any;
  raster : any;
  extent:any;
  projection :any;
  guard_layer:any;
  source_edit:any;
  vector_edit:any;
  jsondata:Array<any>;
  vector_data:any;
  total_detections:any;
  vector_deletions:any;
  select:any;
  features_length:any;
   

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

      

  constructor(private _httpService: HttpTestService){
      this.vector_edit = new ol.layer.Vector({
      source: this.source_edit,
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

    }


  

  ngOnInit(){
    this.getpolygons()
    //this.jsondata=TableData;
    
    this.extent=[0,-554,554,0];
    this. projection = new ol.proj.Projection({
        code: '',
        units: 'pixels',
        extent: this.extent
      });


    //Guard layer to display the limit
    this.guard_layer = new ol.layer.Vector({
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
    this.guard_layer.set('name','guardlayer')
    var feat;
    feat = new ol.Feature(new ol.geom.Polygon([[[21,-21],[554-21,-21],[554-21,21-554],[21,21-554],[21,-21]]]));
    feat.set('name','guard');
    this.guard_layer.getSource().addFeature(feat);
    /////////

    //Layer to show image
    this.raster=new ol.layer.Image({
          source:new ol.source.ImageStatic({
            //attributions:'© <a href="http://xkcd.com/license.html">xkcd</a>',
            url:'http://mouse.brainarchitecture.org/webapps/adore-djatoka/resolver?url_ver=Z39.88-2004&rft_id=MouseBrain/433094&svc_id=info:lanl-repo/svc/getRegion&svc_val_fmt=info:ofi/fmt:kev:mtx:jpeg2000&svc.format=image/jpeg&svc.level=8&svc.rotate=0&svc.region=9728,15360,554,554&svc.crange=0-255,0-255,0-255&svc.gamma=1',
            projection:this.projection,
            imageExtent:this.extent
          })
        })
    /////

    // Layer to draw new polygons
    this.source_edit = new ol.source.Vector({
               wrapX: false,
               features: (new ol.format.GeoJSON()).readFeatures({'type': 'FeatureCollection', 'features': []})
               });
   
    this.vector_edit = new ol.layer.Vector({
      source: this.source_edit,
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

    
    ////

    //Fist pass data layer
    this.vector_data = new ol.layer.Vector({
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

 
     

  //  console.log(TableData);
 
  //mouse positions
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
    
     //delete layer
       this.vector_deletions = new ol.layer.Vector({
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


     
    //select 
      this.select = new ol.interaction.Select( { 
           wrapX: false, 
           filter: function(feature,layer) {
               if(layer.get('name')=='guardlayer')
                   return false;
               return true;
           }
       });

    



  //Map containing all the layers 
  this.map=new ol.Map({
        interactions: ol.interaction.defaults().extend([this.select]),
        controls: ol.control.defaults({
         attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
           collapsible: false
         })
       }).extend([mousePositionControl]),
        layers:[ this.raster,this.guard_layer,this.vector_deletions ,this.vector_data,this.vector_edit],
        target:'map',
        view:new ol.View({
          projection:this.projection,
          center:ol.extent.getCenter(this.extent),
          zoom:1,
          maxZoom:4,
        })
    })

  this.map.removeInteraction(this.select);

  
  
  this.vector_edit.on('change',function(){
  //this.updatecount();
    //this.features_length=this.vector_edit.getSource().getFeatures().length;

  });

  console.log(this.map);
  this.map.on('click',function(evt){
               var map = evt.map;
               console.log(map);
               if (evt.dragging) return;
                  // if (intSelect.value!='Delete') return;
                console.log(evt);
                
                 var pixel = map.getEventPixel(evt.originalEvent);
                   var feature = map.forEachFeatureAtPixel(pixel, 
                       function(feature, layer) { 
                          var layername = layer.get('name');
                           if(layername=='guardlayer')
                               return undefined;
                           return feature;
                       });
           //        if (feature!== undefined) 
         //              deleteFeature(feature);
       //updatecounts();
                       this.vector_edit.getSource().removeFeature(feature);
                       console.log(feature);
         });





}

  

// global so we can remove it later
// Draw and select interaction
addInteraction(devicevalue="Point") {
    var value;
    value = devicevalue;
   
    if (value !== 'None') {
      this.draw = new ol.interaction.Draw({
        source:this.source_edit,
        type: value,
        style:this.draw_style ///** @type {ol.geom.GeometryType} */ (typeSelect.value)
        
          });
          this.map.addInteraction(this.draw);
        }
      } 

//Events  
onChangeGeometry(deviceValue) {
    this.draw_type = deviceValue; 
    console.log(deviceValue);
  this.addInteraction(deviceValue);
    
}

onchangeMode(mode){
  console.log(mode);
  if (mode == "draw"){
     this.map.removeInteraction(this.select);
     this.addInteraction();
    }
  if (mode == "view"){
    this.map.removeInteraction(this.draw);
    this.map.removeInteraction(this.select);
    
    }
  if (mode == "delete"){
     this.map.removeInteraction(this.draw);
      this.map.addInteraction(this.select);
  }
    
}

getFeature(){
    var features;
    
    features = this.vector_edit.getSource().getFeatures();
    
    console.log(features);
    //var del_feat_id = [];
    var added_features = [];
    // for ( var i in features){
    //      del_feat_id.push(features_del[i].getId());
    //    }

    for( var i in features){
         added_features.push(new ol.format.GeoJSON().writeFeature(features[i]));
       }
    var post_features = {'added_polygons':added_features};
     this._httpService.postfeatures(post_features).subscribe(
    data=>this.postData=JSON.stringify(data),
    error=>alert(error),
   );
 this.features_length=this.vector_edit.getSource().getFeatures().lenght;
}

//onchange vector_edit lenght



  getpolygons(){
     console.log("in");
    this._httpService.getfirstpasspolygons().subscribe(
    data=>{this.getData=data;
      this.add_polygon_feature(data);
    console.log(data);
   },
     error=>alert(error),
  );
}

add_polygon_feature(getData)
{
   // Add features to the vector_data -- Firstpass
   var polygons = {"type":"FeatureCollection","features":this.getData[0].firstpass};
   var deleted_ids=this.getData[0].deletedids
   var json_data = (new ol.format.GeoJSON()).readFeatures(polygons);
   for (var i in json_data){
      this.vector_data.getSource().addFeature(json_data[i]);
    }

   ///////////
    this.total_detections=this.vector_data.getSource().getFeatures().length;

}
  

}