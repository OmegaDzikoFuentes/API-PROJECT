import { csrfFetch } from "./csrf";
const SET_SPOTS = "spots/setSpots";
const SET_USER_SPOTS = "spots/setUserSpots";
const ADD_SPOT = "spots/addSpot";
const REMOVE_SPOT = "spots/removeSpot";

// Action Creators
const setSpots = (spots) => ({
  type: SET_SPOTS,
  payload: spots,
});

const setUserSpots = (spots) => ({
  type: SET_USER_SPOTS,
  payload: spots,
});

const addSpot = (spot) => ({
  type: ADD_SPOT,
  payload: spot,
});

const removeSpot = (spotId) => ({
  type: REMOVE_SPOT,
  payload: spotId,
});

export const getSpots = () => async (dispatch) => {
  const response = await csrfFetch("/api/spots");

  if (response.ok) {
    const { Spots } = await response.json();
    
    dispatch(setSpots(Spots)); // Ensure `setSpots` updates the store with the Owner details
  }
};


export const getUserSpots = () => async (dispatch) => {
  const response = await csrfFetch("/api/spots/current");
  const data = await response.json();
  dispatch(setUserSpots(data.Spots));
};

export const createSpot = (spotData) => async (dispatch) => {
  const response = await csrfFetch("/api/spots", {
    method: "POST",
    body: JSON.stringify(spotData),
  });

  const data = await response.json();

  if (response.ok) {
    dispatch(addSpot(data));
    return data;
  } else {
    return { errors: data.errors };
  }
};

export const updateSpot = (spotData) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotData.id}`, {
    method: "PUT",
    body: JSON.stringify(spotData),
  });

  const data = await response.json();
  if (response.ok) {
    dispatch(addSpot(data));
    return data;
  } else {
    return { errors: data.errors };
  }
};

export const deleteSpot = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`, { method: "DELETE" });

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
    default:
      return state;
  }
}
