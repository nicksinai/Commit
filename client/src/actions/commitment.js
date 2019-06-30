import axios from 'axios';
import { GET_COMMITMENT } from './types';

// Create new commitment
export const createCommitment = (formData, history) => async dispatch => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const res = await axios.post('/api/commitment', formData, config);

        dispatch({
            type: GET_COMMITMENT,
            payload: res.data
        });

        history.push('/payment');
    } catch (err) {
        console.log(err);
    }
};
