mapboxgl.accessToken = mapToken;
// console.log(hotel);
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v12", // style URL
  center: hotel.geometry.coordinates, // starting position [lng, lat]
  zoom: 10, // starting zoom
});
map.addControl(new mapboxgl.NavigationControl());
const marker2 = new mapboxgl.Marker({ color: "black" })
  .setLngLat(hotel.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup().setHTML(
      `<h3>${hotel.title}</h3><p>${hotel.location}</p>`
    )
  ) // add popup
  .addTo(map);
