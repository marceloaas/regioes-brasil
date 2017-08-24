import { DataService } from './data.service';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import * as ol from 'openlayers';

@Injectable()
export class MapService {

  raster: any;
  style: any;
  vector: any;
  vectorSource: any;
  view: any;
  map: any;

  constructor(private http: Http, private dataService: DataService) { }

  refreshMap(estado) {

    this.map.removeLayer(this.vector);

    this.vectorSource = new ol.source.Vector({
      url: `../assets/data/coordenadas/${estado}.json`,
      format: new ol.format.TopoJSON()
    });

    this.vector = new ol.layer.Vector({
      source: this.vectorSource,
      style: this.style
    });

    this.map.addLayer(this.vector);

  }

  centerMap(lonLat) {
    this.map.getView().setCenter(ol.proj.transform(lonLat, 'EPSG:4326', 'EPSG:3857'));
    this.map.getView().setZoom(5);
  }

  createMap(estado, lonLat) {

    this.style = new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(255, 255, 255, 0.6)'
      }),
      stroke: new ol.style.Stroke({
        color: '#319FD3',
        width: 1
      })
    });

    this.vectorSource = new ol.source.Vector({
      url: `../assets/data/coordenadas/${estado}.json`,
      format: new ol.format.TopoJSON(),
      overlaps: false,
    });

    this.vector = new ol.layer.Vector({
      source: this.vectorSource,
      style: this.style
    });

    this.view = new ol.View({
      projection: 'EPSG:3857',
      center: ol.proj.fromLonLat(lonLat),
      zoom: 8
    });

    this.map = new ol.Map({
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        })
        , this.vector
      ],
      target: 'map',
      view: this.view
    });

    return this.map;
  }

  unsetMunicipios(topoJSON, codigo_estado, municipios) {
    let geometries = topoJSON.objects[codigo_estado]['geometries'];

    // if (municipios != null) {
    //     let municipiosArr = [];

    //     $.each(JSON.parse(municipios), function(idx, obj) {
    //       municipiosArr.push(obj.codigo);
    //     });

    //   for(var i = geometries.length -1; i >= 0 ; i--){
    //     let cod = geometries[i].properties.cod;
    //     if($.inArray(cod.toString(), municipiosArr) < 0){
    //           geometries.splice(i, 1);
    //     }
    //   }
    // }
  }

}
