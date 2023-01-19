"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const L = __importStar(require("leaflet"));
const form = document.querySelector("form");
const addressInput = document.getElementById("address");
const moreBtn = document.getElementById("more");
function searchAddressHandler(event) {
    event.preventDefault();
    let enteredAddress = addressInput.value;
    axios_1.default
        .get(`https://nominatim.openstreetmap.org/search?q=${encodeURI(enteredAddress)}&format=json`)
        .then((response) => {
        if (response.status !== 200) {
            throw new Error("Could not fetch location!");
        }
        const { lat, lon } = response.data[0];
        const map = L.map("map").setView([+lat, +lon], 16);
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);
        L.circle([+lat, +lon], {
            color: "red",
            fillColor: "#f03",
            fillOpacity: 0.5,
            radius: 500,
        }).addTo(map);
        L.marker([+lat, +lon]).addTo(map);
        const popup = L.popup();
        function onMapClick(e) {
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
    form.style.display = "none";
    moreBtn.style.display = "block";
}
form.addEventListener("submit", searchAddressHandler);
moreBtn.addEventListener("click", () => {
    location.reload();
});
//# sourceMappingURL=app.js.map