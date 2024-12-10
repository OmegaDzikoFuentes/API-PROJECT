import { csrfFetch } from "./csrf";

const SET_REVIEWS = "reviews/setReviews";
const ADD_REVIEW = "reviews/addReview";
const REMOVE_REVIEW = "reviews/removeReview";


export const setReviews = ({ spotId, reviews }) => ({
  type: SET_REVIEWS,
  payload: { spotId, reviews },
});

export const addReview = ({ spotId, review }) => ({
  type: ADD_REVIEW,
  payload: { spotId, review },
});

export const removeReview = ({ spotId, reviewId }) => ({
  type: REMOVE_REVIEW,
  payload: { spotId, reviewId },
});


export const getReviews = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`);

  if (response.ok) {
    const data = await response.json();
    const reviews = Array.isArray(data.Reviews) ? data.Reviews : [];
    dispatch(setReviews({ spotId, reviews }));
  }
};

export const createReview = (spotId, reviewData) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: "POST",
    body: JSON.stringify({
      review: reviewData.review,
      stars: Number(reviewData.stars),
    }),
  });

  if (response.ok) {
    const data = await response.json();
    const reviewWithUser = {
      ...data,
      User: {
        firstName: data.User.firstName,
        lastName: data.User.lastName,
      },
    };
    dispatch(addReview({ spotId, review: reviewWithUser }));
    return data;
  } else {
    const errors = await response.json();
    return { errors };
  }
};


export const deleteReview = (spotId, reviewId) => async (dispatch) => {
  const response = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: "DELETE",
  });

  if (response.ok) {
    dispatch(removeReview({ spotId, reviewId }));
  }
};


const initialState = {};

export default function reviewsReducer(state = initialState, action) {
  switch (action.type) {
    case SET_REVIEWS: {
      const { spotId, reviews } = action.payload;
      return {
        ...state,
        [spotId]: reviews,
      };
    }
    case ADD_REVIEW: {
      const { spotId, review } = action.payload;
      return {
        ...state,
        [spotId]: [...(state[spotId] || []), review],
      };
    }
    case REMOVE_REVIEW: {
      const { spotId, reviewId } = action.payload;
      return {
        ...state,
        [spotId]: state[spotId]?.filter((review) => review.id !== reviewId) || [],
      };
    }
    default:
      return state;
  }
}
