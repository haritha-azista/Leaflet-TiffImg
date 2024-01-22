import React, { useEffect} from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import GeoRasterLayer from 'georaster-layer-for-leaflet';
import parseGeoRaster from 'georaster'
import img from './Ai 2.tif';
const TiffImageOverlay = () => {
  function MyComponent() {
    const map = useMap();
    useEffect(() => {
      console.log('map center:', map.getCenter());
      let tiffUrl = img;
      fetch(tiffUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to load GeoTIFF image. Status: ${response.status}`);
          }
          console.log(response);
          return response.arrayBuffer();

        })
        .then((georaster) => {
          parseGeoRaster(georaster)
            .then((georaster) => {
              console.log('georaster:', georaster);

              if (!georaster || !georaster.values) {
                throw new Error('Invalid or empty GeoTIFF data.');
              }

              var layer = new GeoRasterLayer({
                georaster: georaster,
                opacity: 0.9,
                resolution: 256,
                byteOrder: 'auto',
              });

              layer.addTo(map);
              map.fitBounds(layer.getBounds());
            })
            .catch((parseError) => {
              console.error('Error parsing GeoTIFF:', parseError);
            });
        })

    }, [map]);
    return null;
  }
  return (
    <div>
      <MapContainer
        center={[51.505, -0.09]}
        zoom={9}
        style={{ height: '500px', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
       
        <MyComponent />
      </MapContainer>
    </div>
  );
};

export default TiffImageOverlay;