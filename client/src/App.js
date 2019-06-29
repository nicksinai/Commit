import React, { Fragment, useEffect } from 'react';
import { StripeProvider } from 'react-stripe-elements';
import CheckoutForm from './components/CheckoutForm';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import Landing from './components/Landing';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import PrivateRoute from './components/routing/PrivateRoute';
import './App.css';
// Redux
import { Provider } from 'react-redux';
import store from './store';
import setAuthToken from './utils/setAuthToken';
import { loadUser } from './actions/auth';
import NewCommitment from './components/NewCommitment';

if (localStorage.token) {
    setAuthToken(localStorage.token);
}

const App = () => {
    useEffect(() => {
        store.dispatch(loadUser());
    }, []);
    return (
        <Provider store={store}>
            <StripeProvider apiKey="pk_test_S8dLxRtLOIklyHOP7hf3Q3gA00LSUvfOwL">
                <Router>
                    <Fragment>
                        <h1>Commit</h1>
                        <Route exact path="/" component={Landing} />
                        <Switch>
                            <Route exact path="/signup" component={SignUp} />
                            <Route exact path="/login" component={Login} />
                            <PrivateRoute
                                exact
                                path="/dashboard"
                                component={Dashboard}
                            />
                            <PrivateRoute
                                exact
                                path="/new"
                                component={NewCommitment}
                            />
                            <PrivateRoute
                                exact
                                path="/payment"
                                component={CheckoutForm}
                            />
                        </Switch>
                    </Fragment>
                </Router>
            </StripeProvider>
        </Provider>
    );
};

export default App;
