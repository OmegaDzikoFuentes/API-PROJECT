import { csrfFetch } from './csrf';

const SET_SPOTS = 'spots/setSpots';

const ADD_SPOT = 'spots/addSpot';

const setSpots = (spots) => ({
    type: SET_SPOTS,
    payload: spots,
});

const addSpot = (spot) => ({
    type: ADD_SPOT,
    payload: spot,
});

export const getSpots = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots');
    const data = await response.json();
    dispatch(setSpots(data.Spots));
  };

  export const createSpot = (spotData) => async (dispatch) => {
    const response = await csrfFetch('/api/spots', {
        method: 'POST',
        header: { 'Content-Type': 'application/json' },
        body: JSON.stringify(spotData),
    });

    const data = await response.json();

    if (response.ok) {
        dispatch(addSpot(data));
        return data;
    } else {
        return  { errors: data.errors };
    }
  }

const initialState = [];

export default function spotsReducer(state = initialState, action) {
    switch (action.type) {
        case SET_SPOTS:
            return [ ...action.payload ];
        case ADD_SPOT:
            return [ ...state, action.payload ];
        default:
            return state;
    }
}
