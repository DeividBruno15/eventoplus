
interface GoogleMapWindow extends Window {
  google: {
    maps: {
      Map: any;
      Marker: any;
      InfoWindow: any;
      LatLngBounds: any;
      Geocoder: any;
      NavigationControl: any;
      Animation: {
        DROP: number;
      };
    }
  }
}

declare global {
  interface Window {
    google: {
      maps: {
        Map: any;
        Marker: any;
        LatLngBounds: any;
        InfoWindow: any;
        Geocoder: any;
        NavigationControl: any;
        Animation: {
          DROP: number;
        };
      }
    }
  }
}
