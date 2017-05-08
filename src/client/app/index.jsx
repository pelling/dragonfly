import React, { Component } from 'react';
import { render } from 'react-dom';
// Import routing components
import {Router, Route, IndexRoute, browserHistory} from 'react-router';
import Main from './Main.jsx';
import SignUpComponent from './SignUpComponent.jsx';
import ConfirmRegistrationComponent from './ConfirmRegistrationComponent.jsx';
import ResendCodeComponent from './ResendCodeComponent.jsx';
import SuccessCodeVerifiedComponent from './SuccessCodeVerifiedComponent.jsx';
import AccessAccountComponent from './AccessAccountComponent.jsx';
import CreateNewPasswordComponent from './CreateNewPasswordComponent.jsx';
import SuccessPasswordSavedComponent from './SuccessPasswordSavedComponent.jsx';
import OrganizationsComponent from './OrganizationsComponent.jsx';
import CreateOrganizationComponent from './CreateOrganizationComponent.jsx';
import ProfileComponent from './ProfileComponent.jsx';


render(
    <Router>
        <Route path="/" component={Main} history={browserHistory}>
            <IndexRoute component={SignUpComponent} />
            <Route path="" component={SignUpComponent}/>
            <Route path="signup" component={SignUpComponent} />
            <Route path="confirmregistration" component={ConfirmRegistrationComponent}/>
            <Route path="successcodeverified" component={SuccessCodeVerifiedComponent}/>
            <Route path="resendcode" component={ResendCodeComponent}/>
            <Route path="accessaccount" component={AccessAccountComponent}/>
            <Route path="createnewpassword" component={CreateNewPasswordComponent}/>
            <Route path="successpasswordsaved" component={SuccessPasswordSavedComponent}/>
            <Route path="organizations" component={OrganizationsComponent}/>
            <Route path="createorganization" component={CreateOrganizationComponent}/>
            <Route path="profile" component={ProfileComponent}/>
        </Route>
    </Router>,
    document.getElementById('container')
);