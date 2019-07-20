import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { CardElement, injectStripe, Elements } from 'react-stripe-elements';
import axios from 'axios';

class _CardForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { complete: false };
        this.submit = this.submit.bind(this);
    }

    async submit(ev) {
        try {
            let { token } = await this.props.stripe.createToken();
            // TODO: MAKE AXIOS CALL TO CREATE STRIPE CUSTOMER
            // // If success return a redirect to Summary Page
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            const body = JSON.stringify({ stripeToken: token.id });
            const res = await axios.put('api/users/stripeId', body, config);
            if (res.status === 200) this.setState({ complete: true });
        } catch (err) {
            console.log(err);
        }
    }

    render() {
        if (this.state.complete) return <Redirect to="/dashboard" />;

        return (
            <div className="checkout">
                <CardElement />
                <button onClick={this.submit}>Set Payment Method</button>
            </div>
        );
    }
}
const CardForm = injectStripe(_CardForm);

class CheckoutForm extends Component {
    render() {
        return (
            <div className="checkout">
                <Elements>
                    <CardForm />
                </Elements>
            </div>
        );
    }
}

export default CheckoutForm;
