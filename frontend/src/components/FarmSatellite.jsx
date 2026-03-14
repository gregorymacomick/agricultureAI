import React from "react";

const FarmSatellite = ({ lat, lon }) => {

  const mapUrl = `https://maps.google.com/maps?q=${lat},${lon}&t=k&z=15&output=embed`;

  return (
    <div style={{ marginTop: "30px" }}>
      <h3>🌍 Satellite Crop Monitoring</h3>

      <iframe
        title="satellite"
        src={mapUrl}
        width="100%"
        height="400"
        style={{ borderRadius: "12px", border: "none" }}
      />
    </div>
  );
};

export default FarmSatellite;