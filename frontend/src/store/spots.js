import { csrfFetch } from "./csrf";

const SET_SPOTS = "spots/setSpots";
const SET_USER_SPOTS = "spots/setUserSpots";
const ADD_SPOT = "spots/addSpot";
const REMOVE_SPOT = "spots/removeSpot";

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
  const data = await response.json();
  dispatch(setSpots(data.Spots));
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
    dispatch(addSpot(data)); // Update the spot in the store
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


const initialState = [];


export default function spotsReducer(state = initialState, action) {
  switch (action.type) {
    case SET_SPOTS:
      return [...action.payload];

    case SET_USER_SPOTS:
      return [...action.payload];

    case ADD_SPOT:
      return [...state, action.payload];

    case REMOVE_SPOT:
      return state.filter((spot) => spot.id !== action.payload);

    default:
      return state;
  }
}
