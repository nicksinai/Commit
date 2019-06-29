import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Map from './Map';

const NewCommitment = () => {
    const [formData, setFormData] = useState({
        days: null
    });
    return (
        <Fragment>
            <form>
                <input
                    name="days"
                    type="number"
                    required={true}
                    placeholder="Days per week"
                />{' '}
                <br />
                <input
                    name="weeks"
                    type="number"
                    required={true}
                    placeholder="Weeks in a row"
                />{' '}
                <br />
                <Map /> <br />
                <input
                    name="price"
                    type="number"
                    required={true}
                    placeholder="Price per failed week"
                />{' '}
                <br />
                <input
                    name="stripe"
                    type="number"
                    required={true}
                    placeholder="Stripe"
                />{' '}
                <br />
                <input name="submit" type="submit" value="Next" />
            </form>
        </Fragment>
    );
};

NewCommitment.propTypes = {};

export default NewCommitment;
