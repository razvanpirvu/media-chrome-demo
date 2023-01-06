import React from 'react';
import reactToWebComponent from "react-to-webcomponent";
import ReactDom from "react-dom"
import "./styles.css"
import Dropdown from 'react-bootstrap/Dropdown';


const Greeting = ({ name }) => {
  const bitrateIcon = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bar-chart" viewBox="0 0 16 16">
  <path d="M4 11H2v3h2v-3zm5-4H7v7h2V7zm5-5v12h-2V2h2zm-2-1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1h-2zM6 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7zm-5 4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-3z"/>
  </svg>;



  return (
    <div>
      <div id="content"/>
      <div className="initials">
        <div>
          <div className="dropup">
            {/* <button className="dropbtn">{bitrateIcon}</button> */}
            <Dropdown  className="dropup-content list-group">
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              {bitrateIcon}
            </Dropdown.Toggle>
            <Dropdown.Menu id="bitrate-select">
            <Dropdown.Item>test</Dropdown.Item>
            </Dropdown.Menu>
              
            </Dropdown>
          </div>  
        </div> 
      </div>
    </div>
  )
}
  
const webComponent = reactToWebComponent(Greeting, React, ReactDom);


export default () => customElements.define("react-test", webComponent);
