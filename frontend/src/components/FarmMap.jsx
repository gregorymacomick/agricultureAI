import { MapContainer, TileLayer, Marker } from "react-leaflet";

const FarmMap = ({ lat, lon }) => {

  if (!lat || !lon) return null;

  return (

    <MapContainer
      center={[lat, lon]}
      zoom={13}
      style={{ height: "300px", width: "100%" }}
    >

      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={[lat, lon]} />

    </MapContainer>

  );
};

export default FarmMap;