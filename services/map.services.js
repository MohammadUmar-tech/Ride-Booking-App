import axios from "axios";
export const getAddressCoordinate  = async (address) => {
  if (!address) {
    throw new Error("Address is Required");
  }

  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search`,
      {
        params: {
          q: address,
          format: "json",
          limit: 1,
        },
        headers: {
          "User-Agent": "clone-app/1.0",
        },
      },
    );

    if (response.data.length === 0) {
      throw new Error("Address not found");
    }

    const location = response.data[0];
    return {
      ltd: parseFloat(location.lat),
      lng: parseFloat(location.lon),
    //   lat: parseFloat(location.lat),
    //   lon: parseFloat(location.lon),
      display_name: location.display_name,
    };
  } catch (error) {
    console.log("Geocoding Error:", error.message);
    throw new Error(error.response?.data?.error || "Failed to get coordinates");
  }
};

export const getDistanceTime = async (origin, destination) => {
  if (!origin ||!destination) {
    throw new Error("Origin and destination are required");
  }
  const originCoords = await getAddressCoordinate(origin);
  const destinationCoords = await getAddressCoordinate(destination);
  const url = `https://router.project-osrm.org/route/v1/driving/${originCoords.lng},${originCoords.ltd};${destinationCoords.lng},${destinationCoords.ltd}?overview=false`;
  const response = await axios.get(url);
  if (response.data.code!== "Ok") {
    throw new Error("No routes found");
  }
  const route = response.data.routes[0];
  return {
    distance: {
      text: `${(route.distance / 1000).toFixed(1)} km`,
      value: route.distance,
    },
    duration: {
      text: `${Math.round(route.duration / 60)} mins`,
      value: route.duration,
    }
  };
};


export const getAutoCompleteSuggestions = async (input) => {
    if (!input) {
        throw new Error('query is required');
    }


    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(input)}&format=json&addressdetails=1&limit=5`;

    try {
        const response = await axios.get(url, {
            headers: {
                "User-Agent": "uber-clone-app/1.0" 
            }
        });

        if (response.data && response.data.length > 0) {
            return response.data.map(place => place.display_name).filter(value => value);
        } else {
            return [];
        }
    } catch (err) {
        console.error(err.message);
        throw new Error('Unable to fetch suggestions');
    }
}