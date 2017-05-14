import { Config, CognitoIdentityCredentials } from "aws-sdk";
import { CognitoUserPool, CognitoUserAttribute, AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";
import React, {Component} from 'react';
import { Router, Route, Link, browserHistory } from 'react-router';
import SignInComponent from './SignInComponent.jsx';
import UserDropdownComponent from './UserDropdownComponent.jsx';
import OrganizationsComponent from './OrganizationsComponent.jsx';
import appconfig from "./appconfig";

var AWS = require("aws-sdk");
AWS.config.region = 'us-west-2';


const userPool = new CognitoUserPool({ UserPoolId: appconfig.UserPoolId, ClientId: appconfig.ClientId});
const AWSLogin = 'cognito-idp.' + appconfig.region + '.amazonaws.com/' + appconfig.UserPoolId;
const AWSIdentityPoolId = appconfig.IdentityPoolId;
var dragonfly = {};

class Main extends Component {

    constructor(props) {
        super(props);
        this.state = {email : '', 
                    userId : 'not found', 
                    organizations: 'not found',
                    organizationName: 'not found',
                    organizationId: 'not found'
        };
        this.handleLoadEmail = this.handleLoadEmail.bind(this);
        this.handleAuthenticate = this.handleAuthenticate.bind(this);
        this.handleSignOut = this.handleSignOut.bind(this);
        this.handleLoadAttributes = this.handleLoadAttributes.bind(this);
        this.handleLoadOrganizations = this.handleLoadOrganizations.bind(this);
        this.handleLoadOrganization = this.handleLoadOrganization.bind(this);
        this.dbPut = this.dbPut.bind(this);
        this.dbQuery = this.dbQuery.bind(this);
    }
    
    
    
    
    handleLoadEmail(email) {
        this.setState({email : email});
    }
    
    handleLoadOrganizations(result) {
        this.setState({organizations : result.Items});
    }
    
    handleLoadOrganization(organizationId, organizationName) {
        this.setState({organizationId : organizationId});
        this.setState({organizationName : organizationName});
    }
    
    
    
    
    
    
    
    handleAuthenticate(email, password, callback) {
        
        var myThis = this;
        var authenticationData = {Username : email, Password : password};
        var authenticationDetails = new AuthenticationDetails(authenticationData);
        var userData =  {Username : email, Pool : userPool };
        var cognitoUser = new CognitoUser(userData);

        
        cognitoUser.authenticateUser(authenticationDetails, {
              onSuccess: function (result) {
                  
                  
                  
                AWS.config.region = 'us-west-2';
                AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                        //AccountId: '698305963744',
                        //RoleArn: 'arn:aws:iam::698305963744:role/Cognito_dragonflyAuth_Role', 
                        IdentityPoolId : 'us-west-2:b6311e4b-9082-4058-883c-19d23e34802b',
                        Logins : { 'cognito-idp.us-west-2.amazonaws.com/us-west-2_N8urEcZBJ' : result.getIdToken().getJwtToken() }
                });
                  
                
                dragonfly.docClient = new AWS.DynamoDB.DocumentClient();
                dragonfly.cognitoUser = cognitoUser;
                myThis.handleLoadAttributes(callback);
              },
       
              onFailure: function(err) {
                  if (err.code === "UserNotConfirmedException") {
                    myThis.props.history.push('confirmregistration');
                  }
                  alert(err.message);
              }
          });
        
    }
    
    
    
    handleLoadAttributes(callback) {
        var myThis = this;
        dragonfly.cognitoUser.getUserAttributes(function(err, result) {
            if (err) {
                alert(err);
                callback();
                return;
            }
            if (result) {
                var userId = result[0].getValue();
                myThis.setState({ userId : userId });
                callback();
                
              
            }
        });
    } 
    
    
    dbPut(params, callback) {

        dragonfly.docClient.put(params, function(err, data) {
          
            if (err) {
                alert(JSON.stringify(err));
                callback();
            } else {
                callback(data);
            }
        });        
    }
    
    
    
    dbQuery(params, callback) {

        dragonfly.docClient.query(params, function(err, data) {
          
            if (err) {
                alert(JSON.stringify(err));
                callback(data);
            } else {
                callback(data);
            }
        });        
    }
    
    

    handleSignOut() {
        this.setState({email : ''});
        this.setState({userId : 'not found'});
        this.setState({organizations : 'not found'});
        this.setState({organizationName : 'not found'});
        this.setState({organizationId : 'not found'});
    }
    
    
    

    

    
    
    
    
    render(){
        
        
        const childrenWithProps = React.Children.map(this.props.children,
         (child) => React.cloneElement(child, {
           userId: this.state.userId,
           email: this.state.email,
           organizations: this.state.organizations,
           organizationId: this.state.organizationName,
           organizationName: this.state.organizationName,
           handleLoadEmail: this.handleLoadEmail,
           handleUserIdReceived: this.handleUserIdReceived,
           handleLoadOrganizations: this.handleLoadOrganizations,
           handleLoadOrganization: this.handleLoadOrganization,
           dbPut: this.dbPut,
           dbQuery: this.dbQuery
         })
        );
        
        var email = this.state.email;
        var userId = this.state.userId;  
        var organizations = this.state.organizations;
        var organizationName = this.state.organizationName;
        var handleSignOut = this.handleSignOut;
        var handleAuthenticate = this.handleAuthenticate;
        var handleLoadEmail = this.handleLoadEmail;
        var handleLoadOrganization = this.handleLoadOrganization;
        var dbQuery = this.dbQuery;
        var history = this.props.history;
        
        
        var rightnav = function() { return '' }();
        
        if (userId === 'not found') {
            rightnav = function() {return <SignInComponent handleLoadEmail={handleLoadEmail} handleAuthenticate={handleAuthenticate} email={email} history={history} /> }();
        } else {
            rightnav = function() {return <UserDropdownComponent handleSignOut={handleSignOut} email={email} history={history} /> }();
        }
        
        
        var organizationsRow = function() { return ''}();
        
        if (organizations !== 'not found') {
            organizationsRow = function() {return <OrganizationsComponent handleLoadOrganization={handleLoadOrganization} organizationName={organizationName}  organizations={organizations} userId={userId} history={history} /> }();
        }
        
        
        
        return(
            <div class="container-fluid">
                
                <div className="row dragon-navbar">
                  <div className="col-sm-6">
                    <img src="./images/insect-74x80.png" className="dragon-logo-img"/>
                    <div className="dragon-navbar-header">
                    <div className="dragon-navbar-dragonfly">Dragonfly
                        <span className="dragon-navbar-retention align-baseline">&nbsp;Retention</span>
                    </div>
                    </div>
                  </div>
                  <div className="col-sm-6">{rightnav}</div>
                </div>
                
                    {organizationsRow}
                    {childrenWithProps}
            </div>
        );
    }
}

export default Main