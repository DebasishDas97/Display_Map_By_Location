import axios from "axios";
import * as L from 'leaflet';


interface Data {
  lat: string;
  lon: string;
}

const form = document.querySelector("form")!;
const addressInput = document.getElementById("address")! as HTMLInputElement;
const moreBtn = document.getElementById("more")! as HTMLButtonElement;

type GoogleGeocodingResponse = Data[];

function searchAddressHandler(event: Event) {
  event.preventDefault();
  let enteredAddress = addressInput.value;

  axios
    .get<GoogleGeocodingResponse>(
      `https://nominatim.openstreetmap.org/search?q=${encodeURI(
        enteredAddress
      )}&format=json`
    )
    .then((response) => {
      if (response.status !== 200) {
        throw new Error("Could not fetch location!");
      }
      const { lat, lon } = response.data[0];

      const map = L.map("map").setView([+lat, +lon], 16);

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      L.circle([+lat, +lon], {
        color: "red",
        fillColor: "#f03",
        fillOpacity: 0.5,
        radius: 500,
      }).addTo(map);

      L.marker([+lat, +lon]).addTo(map);

      const popup = L.popup();

      function onMapClick(e: L.LeafletMouseEvent) {
        popup
          .setLatLng(e.latlng)
          .setContent("You clicked the map at " + e.latlng.toString())
          .openOn(map);
        L.marker(e.latlng).addTo(map);
      }

      map.on("click", onMapClick);
    })

    .catch((err) => {
      alert(err.message);
    });
    form.style.display = "none"
    moreBtn.style.display = "block"
}

form.addEventListener("submit", searchAddressHandler);
moreBtn.addEventListener("click", () => {
  location.reload()
})

//done