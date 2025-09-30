mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map',                       // container ID
    center: listing.geoLocation.coordinates,     // starting position [lng, lat]. Note that lat must be set between -90 and 90
zoom: 10                                    // starting zoom
});

// marker for the listing location
const marker = new mapboxgl.Marker({ color: 'red' }) // Customize marker color if desired
    .setLngLat(listing.geoLocation.coordinates) // Set marker at the listing's coordinates
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(`<h4>${listing.title}, ${listing.location}</h4><p>Exact Location will be provided after booking</p>`)
    )
    .addTo(map);