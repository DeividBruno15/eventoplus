
/// <reference types="google.maps" />

// Amplia a interface Window global para incluir a API do Google Maps
interface Window {
  google: typeof google;
}
