export default function LocationActions({ latitude, longitude }) {
  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);

  if (!lat || !lng) return null;

  //  SIMPLE & RELIABLE GOOGLE MAP LINK
  const mapLink = `https://www.google.com/maps?q=${lat},${lng}`;

  return (
    <div>
      {/*  VIEW LOCATION BUTTON */}
      <div>
        <a
          href={mapLink}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-3 rounded-xl text-white text-sm bg-[#2460B9]"
        >
         View Location
        </a>
      </div>
    </div>
  );
}
