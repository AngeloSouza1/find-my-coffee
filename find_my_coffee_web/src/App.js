import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import EstablishmentsService from './services/establishment_service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import './App.css';

function App() {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCafe, setSelectedCafe] = useState(null);
  const { REACT_APP_GOOGLE_API_KEY } = process.env;

  useEffect(() => {
    setCurrentLocation();
  }, []);

  async function setCurrentLocation() {
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      console.log('User location:', position.coords.latitude, position.coords.longitude);
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
      loadCoffeeShops(position.coords.latitude, position.coords.longitude);
    } catch (error) {
      console.error('Error getting user location:', error);
      setLoading(false);
    }
  }

  async function loadCoffeeShops(latitude, longitude) {
    try {
      console.log('Loading coffee shops:', latitude, longitude);
      const response = await EstablishmentsService.index(latitude, longitude);
      setLocations(response.data.results);
      setLoading(false);
    } catch (error) {
      console.error('Error loading coffee shops:', error);
      setLoading(false);
    }
  }

  function handleCafeClick(cafe) {
    setSelectedCafe(cafe);
  }

  if (!latitude || !longitude) {
    return <div>Aguardando permissão para acessar localização...</div>;
  }

  return (
    <LoadScript googleMapsApiKey={REACT_APP_GOOGLE_API_KEY}>
      <GoogleMap
        mapContainerStyle={{ height: '100vh', width: '100%' }}
        zoom={16}
        center={{ lat: latitude, lng: longitude }}
      >
        {loading ? null : (
          <Marker
            icon={{
              url: '/images/my-location-pin.png',
              scaledSize: new window.google.maps.Size(35, 35),
            }}
            title="Seu Local"
            position={{ lat: latitude, lng: longitude }}
          />
        )}

        {locations.map((cafe, index) => (
          <Marker
            key={index}
            icon={{
              url: '/images/coffee-pin.png',
              scaledSize: new window.google.maps.Size(30, 30),
            }}
            title={cafe.name}
            position={{
              lat: cafe.geometry.location.lat,
              lng: cafe.geometry.location.lng,
            }}
            onClick={() => handleCafeClick(cafe)}
          />
        ))}
      </GoogleMap>

      {selectedCafe && (
        <div className="banner">
          <div className="cafe-details">
            <div className="close-button" onClick={() => setSelectedCafe(null)}>
              <FontAwesomeIcon icon={faTimes} />
            </div>
        
            {selectedCafe.photos && selectedCafe.photos.length > 0 && (
              <img src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${selectedCafe.photos[0].photo_reference}&key=${REACT_APP_GOOGLE_API_KEY}`} alt="Cafe" />
            )}

            <h3>{selectedCafe.name}</h3>
            <p>Horário de funcionamento: {selectedCafe.opening_hours ? (selectedCafe.opening_hours.open_now ? 'Aberto agora' : 'Fechado') : 'Não especificado'}</p>
            <p>Endereço: {selectedCafe.formatted_address}</p>
            
          
          </div>
        </div>
      )}
    </LoadScript>
  );
}

export default App;
