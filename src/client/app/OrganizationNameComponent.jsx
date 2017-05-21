import React from 'react';
import Link from 'react-router';
import OrganizationMenuComponent from './OrganizationMenuComponent.jsx';


const buttonClassName = "btn btn-success btn-lg";

class OrganizationNameComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {nameValue : props.organizationName,
                  buttonRestClassName : buttonClassName,
                  buttonClickedClassName : "dragon-hidden"
    };
    this.updateNameValue = this.updateNameValue.bind(this);
    this.showClickedButtonState = this.showClickedButtonState.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render() {
    
    var organizationMenu = function() {return <OrganizationMenuComponent current="settings" /> }();
    
    
    return (

        <div className="row">
          {organizationMenu}
          <div className="col-sm-4">
          
          
            <form onSubmit={this.handleSubmit}>
                <h3>Organization Name</h3>
                
                <br/><br/>
                
                <input value={this.state.nameValue} onChange={this.updateNameValue} className="form-control input-lg" placeholder="name of organization"/>
                <br/>
              <input type="submit" className={this.state.buttonRestClassName} value="Save" />
              <div className={this.state.buttonClickedClassName}><i className='fa fa-circle-o-notch fa-spin'></i> Saving</div>
            </form>
          </div> 
          
          
          
          <div className="col-sm-4">
          </div>
        </div>



    );
  }




  showClickedButtonState(yes) {
    if (yes) {
          this.setState({ buttonRestClassName: "dragon-hidden" });
          this.setState({ buttonClickedClassName: buttonClassName });
    } else {
          this.setState({ buttonRestClassName: buttonClassName });
          this.setState({ buttonClickedClassName: "dragon-hidden" });
    }
  }
  
  updateNameValue(e) {
    this.setState({
      nameValue: e.target.value
    });
  }
  
  handleSubmit(e) {
    e.preventDefault();
    this.showClickedButtonState(true);
    var myThis = this;
    const nameValue = this.state.nameValue.trim();
    const userIdValue = this.props.userId;
    const organizationIdValue = this.props.organizationId;
    
    alert('need to add code to save name');
    myThis.showClickedButtonState(false); 
    
  }


}

export default OrganizationNameComponent;