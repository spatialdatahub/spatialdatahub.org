// CUSTOM MAP FUNCTIONS

// toggle map scrollability
const scrollWheelToggle = map => {
  map.scrollWheelZoom.enabled()
    ? map.scrollWheelZoom.disable()
    : map.scrollWheelZoom.enable()
}

// CUSTOM OTHER FUNCTIONS

// toggle active / inactive links in list
