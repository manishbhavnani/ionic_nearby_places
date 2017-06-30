import { Component , ViewChild ,ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation ,GeolocationOptions ,Geoposition ,PositionError } from '@ionic-native/geolocation';


declare var google;
@Component({
  selector: 'map-view',
  templateUrl: 'mapview.html'
})
export class MapView {

options : GeolocationOptions;
currentPos : Geoposition;
@ViewChild('map') mapElement: ElementRef;
map: any;
public currentLocation;

  constructor(public navCtrl: NavController,private geolocation : Geolocation) {}


    getUserPosition(){
        this.options = {
        enableHighAccuracy : false
                    };
    this.geolocation.getCurrentPosition(this.options).then((pos : Geoposition) => {
        this.currentPos = pos;     
        console.log(pos);
        this.addMap(pos.coords.latitude,pos.coords.longitude);

    },(err : PositionError)=>{
        console.log("error : " + err.message);
    ;
    })
    }
    ionViewDidEnter(){
    this.getUserPosition();}   

    addMap(lat,long){
        let latLng = new google.maps.LatLng(lat, long);
        this.currentLocation=latLng ;
        let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.addMarker();

}


    addMarker(){
    let marker = new google.maps.Marker({
    map: this.map,
    animation: google.maps.Animation.DROP,
    position: this.map.getCenter()
    });

    let content = "<p>This is your current position !</p>";          
    let infoWindow = new google.maps.InfoWindow({
    content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
    infoWindow.open(this.map, marker);
    });

}
searchLocation(ev:any)
        {
            var request = {
            location: this.currentLocation,
            radius: '5000',
            types: ev.target.value
        };

   var service = new google.maps.places.PlacesService(this.map);

    service.nearbySearch(request, function(results, status) {
     if (status == google.maps.places.PlacesServiceStatus.OK) {
       for (var i = 0; i < results.length; i++) {
         var place = results[i];
        console.log(place.geometry.location);
         var marker = new google.maps.Marker({
           map: this.map,
           position: place.geometry.location
         });
       }
     }
   });
 
}





}
