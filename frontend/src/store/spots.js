import { csrfFetch } from "./csrf";

const SET_SPOTS = "spots/setSpots";
const SET_USER_SPOTS = "spots/setUserSpots";
const ADD_SPOT = "spots/addSpot";
const UPDATE_SPOT = "spots/updateSpot";
const REMOVE_SPOT = "spots/removeSpot";
const ADD_SPOT_IMAGE = "spots/addSpotImage";
const SET_SPOT_DETAILS = "spots/setSpotDetails";

// Action Creators
const setSpots = (spots) => ({
  type: SET_SPOTS,
  payload: spots,
});

const setUserSpots = (spots) => ({
  type: SET_USER_SPOTS,
  payload: spots,
});

// Action Creator for loading spot details
const setSpotDetails = (spot) => ({
  type: SET_SPOT_DETAILS,
  payload: spot,
});

const addSpot = (spot) => ({
  type: ADD_SPOT,
  payload: spot,
});

const update = (spot) => ({
  type: UPDATE_SPOT,
  payload: spot
});

const removeSpot = (spotId) => ({
  type: REMOVE_SPOT,
  payload: spotId,
});

const addImage = (image, spotId) => ({
  type: ADD_SPOT_IMAGE,
  payload: { image, spotId },
});

// Thunks
export const getSpots = () => async (dispatch) => {
  const response = await csrfFetch("/api/spots");

  if (response.ok) {
    const { Spots } = await response.json();
    dispatch(setSpots(Spots));
  }
};

export const getUserSpots = () => async (dispatch) => {
  const response = await csrfFetch("/api/spots/current");

  if (response.ok) {
    const { Spots } = await response.json();
    dispatch(setUserSpots(Spots));
  }
};

export const getSpotById = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`);
  const spot = await response.json();
  console.log('this is the owner having spot!!ooooooooooooooo', spot)
  if (response.ok) {


    dispatch(setSpotDetails(spot));
    return spot;
  }
};

export const addSpotImage = (imageData, spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/images`, {
    method: "POST",
    body: JSON.stringify({
      url: imageData.url,
      preview: imageData.preview
  }),
  });

  if (response.ok) {
    const image = await response.json();
    dispatch(addImage(image, spotId));
    return image;
  }
};

export const createSpot = (spotData, imageUrls) => async (dispatch) => {
  const response = await csrfFetch("/api/spots", {
    method: "POST",
    body: JSON.stringify(spotData),
  });

  if (response.ok) {
    const newSpot = await response.json(); // The new spot is returned here

    // Ensure SpotImages is initialized as an empty array if not already
    newSpot.SpotImages = newSpot.SpotImages || [];

    // Add images to the SpotImages array of the new spot
    if (imageUrls?.length > 0) {
      await Promise.all(
        imageUrls.map(async (url, index) => {
          const imageResponse = await csrfFetch(`/api/spots/${newSpot.id}/images`, {
            method: "POST",
            body: JSON.stringify({ url, preview: index === 0 }),
          });

          if (imageResponse.ok) {
            const image = await imageResponse.json();
            newSpot.SpotImages.push(image); // Push each image into the SpotImages array
          }
        })
      );
    }



    dispatch(addSpot(newSpot)); // Update Redux store with the new spot
    return newSpot;
  } else {
    const errorData = await response.json();
    return { errors: errorData.errors };
  }
};



export const updateSpot = (spotData) => async (dispatch, getState) => {
  const { id, images, ...restData } = spotData;

  const response = await csrfFetch(`/api/spots/${id}`, {
    method: "PUT",
    body: JSON.stringify(restData),
  });

  if (response.ok) {
    const updatedSpot = await response.json();

    // Remove old images
    const currentSpot = getState().spots.byId[id];
    if (currentSpot?.SpotImages?.length > 0) {
      await Promise.all(
        currentSpot.SpotImages.map((image) =>
          csrfFetch(`/api/spot-images/${image.id}`, { method: "DELETE" })
        )
      );
    }

    // Add new images
    if (images?.length > 0) {
      await Promise.all(
        images.map((url, index) =>
          dispatch(
            addSpotImage({ url, preview: index === 0 }, updatedSpot.id)
          )
        )
      );
    }

    dispatch(update(updatedSpot));
    return updatedSpot;
  } else {
    const errors = await response.json();
    return { errors: errors.errors };
  }
};


export const deleteSpot = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: "DELETE",
  });

  if (response.ok) {
    dispatch(removeSpot(spotId));
  }
};

// Initial State
const initialState = {
  byId: {}, // Object containing spots keyed by ID
  allIds: [], // Array of all spot IDs for easy iteration
};

// Reducer
export default function spotsReducer(state = initialState, action) {
  switch (action.type) {
    case SET_SPOTS: {
      const spotsById = {};
      const spotIds = [];
      action.payload.forEach((spot) => {
        spotsById[spot.id] = spot;
        spotIds.push(spot.id);
      });
      return { allIds: spotIds, byId: spotsById };
    }
    case SET_USER_SPOTS: {
      const userSpotsById = {};
      action.payload.forEach((spot) => {
        userSpotsById[spot.id] = spot;
      });
      return { ...state, byId: { ...state.byId, ...userSpotsById } };
    }
    case ADD_SPOT: {
      const newSpot = action.payload;
      return {
        ...state,
        byId: { ...state.byId, [newSpot.id]: newSpot },
        allIds: [...state.allIds, newSpot.id],
      };
    }
    case REMOVE_SPOT: {
      const newState = { ...state };
      delete newState.byId[action.payload];
      newState.allIds = newState.allIds.filter((id) => id !== action.payload);
      return newState;
    }
    case SET_SPOT_DETAILS: {
      const spot = action.payload; // Full spot object, which includes the Owner
      return {
      ...state,
      byId: {
      ...state.byId,
      [spot.id]: spot, // Add/update the spot (with Owner included) in the byId object
      },
      allIds: state.allIds.includes(spot.id) ? state.allIds : [...state.allIds, spot.id], // Adds the spot ID to allIds if not already present
      };
      }
    case ADD_SPOT_IMAGE: {
      const { image, spotId } = action.payload;
      const updatedSpot = {
        ...state.byId[spotId],
        SpotImages: [...(state.byId[spotId]?.SpotImages || []), image],
      };
      return {
        ...state,
        byId: { ...state.byId, [spotId]: updatedSpot },
      };

    }
    default:
      return state;
  }
}
