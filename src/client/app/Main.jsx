import { Config, CognitoIdentityCredentials } from "aws-sdk";
import { CognitoUserPool, CognitoUserAttribute, AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";
import React, {Component} from 'react';
import { Router, Route, Link, browserHistory } from 'react-router';
import SignInComponent from './SignInComponent.jsx';
import UserDropdownComponent from './UserDropdownComponent.jsx';
import appconfig from "./appconfig";

var AWS = require("aws-sdk");
AWS.config.region = 'us-west-2';


const userPool = new CognitoUserPool({ UserPoolId: appconfig.UserPoolId, ClientId: appconfig.ClientId});
const AWSLogin = 'cognito-idp.' + appconfig.region + '.amazonaws.com/' + appconfig.UserPoolId;
const AWSIdentityPoolId = appconfig.IdentityPoolId;


class Main extends Component {

    constructor(props) {
        super(props);
        this.state = {email : '', user : 'not found', token : 'not found', cognitoAuthenticated : null};
        this.handleLoadEmail = this.handleLoadEmail.bind(this);
        this.handleAuthenticate = this.handleAuthenticate.bind(this);
        this.handleUserReceived = this.handleUserReceived.bind(this);
        this.handleTokenReceived = this.handleTokenReceived.bind(this);
        this.handleLoadAttributes = this.handleLoadAttributes.bind(this);
        this.handleTest = this.handleTest.bind(this);
    }
    
    
    
    
    handleTest(params, callback) {
        var myThis = this;
        
        var cognitoUser = userPool.getCurrentUser();
        if (cognitoUser != null) {
            cognitoUser.getSession(function(err, session) {
                if (err) {
                   alert(err);
                    return;
                }
                alert('session validity: ' + session.isValid());
    
                AWS.config.region = 'us-west-2';
                AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                        //AccountId: '698305963744',
                        //RoleArn: 'arn:aws:iam::698305963744:role/Cognito_dragonflyAuth_Role', 
                        IdentityPoolId : 'us-west-2:b6311e4b-9082-4058-883c-19d23e34802b',
                        Logins : { 'cognito-idp.us-west-2.amazonaws.com/us-west-2_N8urEcZBJ' : session.getIdToken().getJwtToken() }
                });
                
                
                
                
                
                cognitoUser.getUserAttributes(function(err, result) {
                    if (err) {
                        alert(err);
                        return;
                    }
                    for (var i = 0; i < result.length; i++) {
                        alert('attribute ' + result[i].getName() + ' has value ' + result[i].getValue());
                    }
                });
                
                
                myThis.dynamoDBputParams(params, callback);
                
                
                
                
                
                
                //AWS.config.update = new AWS.CognitoIdentityCredentials({
                        //AccountId: '698305963744',
                        //IdentityPoolId : 'us-west-2:b6311e4b-9082-4058-883c-19d23e34802b',
                        //RoleArn: 'arn:aws:iam::698305963744:role/Cognito_dragonflyAuth_Role',               
                        
                        //Logins : { 'cognito-idp.us-west-2.amazonaws.com/us-west-2_N8urEcZBJ' : token  }
                //});

    
                // Instantiate aws sdk service objects now that the credentials have been updated.
                // example: var s3 = new AWS.S3();
    
            });
        }  
    }
    
    
    
    
    handleLoadEmail(email) {
        this.setState({email : email});
    }
    
    
    
    
    
    
    
    handleAuthenticate(email, password, callback) {
        
        var myThis = this;
        var authenticationData = {Username : email, Password : password};
        var authenticationDetails = new AuthenticationDetails(authenticationData);
        var userData =  {Username : email, Pool : userPool };
        var cognitoUser = new CognitoUser(userData);

        
        cognitoUser.authenticateUser(authenticationDetails, {
              onSuccess: function (result) {
                    myThis.handleTokenReceived(result);
                    myThis.setState({ cognitoAuthenticated : cognitoUser });
                    callback();
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
        var cognitoUser = myThis.state.cognitoAuthenticated;
        cognitoUser.getUserAttributes(function(err, result) {
            if (err) {
                alert(err);
                callback();
                return;
            }
            if (result) {
                alert(JSON.stringify(result));
                callback();
                
              
            }
        });
    } 
    
    
    dynamoDBputParams(params, callback) {

        var myThis = this;
        
        alert("I'm inside the dynamoDBputParams function");

        var docClient = new AWS.DynamoDB.DocumentClient();
        docClient.put(params, function(err, data) {
          
            if (err) {
                alert(JSON.stringify(err));
                callback();
            } else {
                alert(JSON.stringify(data));
                callback();
            }
        });        
    }
    
    

    handleUserReceived(cognitoUser) {
        this.setState({user : cognitoUser});
    }
    
    
    
    
    handleTokenReceived(token) {
        try{
        
        this.setState({token : token});
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                        IdentityPoolId : 'us-west-2:b6311e4b-9082-4058-883c-19d23e34802b', // your identity pool id here
                        Logins : {
                            'cognito-idp.us-west-2.amazonaws.com/us-west-2_N8urEcZBJ' : token
                        }
                    })
        
        } catch(e) {
            alert("ERROR loading token = " + JSON.stringify(e.message));
        }
    }
    

    
    
    
    
    render(){
        
        
        const childrenWithProps = React.Children.map(this.props.children,
         (child) => React.cloneElement(child, {
           user: this.state.user,
           handleLoadEmail: this.handleLoadEmail,
           handleUserReceived: this.handleUserReceived,
           handleTest: this.handleTest
         })
        );
        
        var email = this.state.user.username;
        var token = this.state.token;  
        var handleUserReceived = this.handleUserReceived;
        var handleAuthenticate = this.handleAuthenticate;
        var handleTokenReceived = this.handleTokenReceived;
        var handleLoadEmail = this.handleLoadEmail;
        var history = this.props.history;
        var rightnav = function() { return '' }();
        
        if (token === 'not found') {
            rightnav = function() {return <SignInComponent handleLoadEmail={handleLoadEmail} handleAuthenticate={handleAuthenticate} email={email} history={history} /> }();
        } else {
            rightnav = function() {return <UserDropdownComponent handleUserReceived={handleUserReceived} handleTokenReceived={handleTokenReceived} email={email} history={history} /> }();
        }
        
        
        
        return(
            <div class="container-fluid">
                
                <div className="row dragon-navbar">
                  <div className="col-sm-6">
                    <img className="dragon-logo-img" src="images/dr-logo-white-213x50.png"/>
                  </div>
                  <div className="col-sm-6">{rightnav}</div>
                </div>
                
                
                    {childrenWithProps}
            </div>
        );
    }
}

export default Main