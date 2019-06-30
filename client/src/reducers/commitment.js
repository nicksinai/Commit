import { GET_COMMITMENT } from '../actions/types';

const initialState = {
    commitment: null,
    loading: true
};

export default function(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case GET_COMMITMENT:
            return {
                ...state,
                commitment: payload,
                loading: false
            };
        default:
            return state;
    }
}
