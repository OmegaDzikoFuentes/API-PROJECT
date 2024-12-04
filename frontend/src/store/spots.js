import { csrfFetch } from './csrf';

const SET_SPOTS = 'spots/setSpots';

const setSpots = (spots) => ({
    type: SET_SPOTS,
    spots,
});

export const getSpots = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots');
    const data = await response.json();
    console.log("xxxxxxxxxx data", data)
    dispatch(setSpots(data.Spots));
  };

const initialState = [];

export default function spotsReducer(state = initialState, action) {
    switch (action.type) {
        case SET_SPOTS:
            return [ ...action.spots ];
        default:
            return state;
    }
}
