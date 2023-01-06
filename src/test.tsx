import React from 'react';
import reactToWebComponent from 'convert-react-to-web-component';

const ReactApp = () => <div>Hello, world</div>;

reactToWebComponent(ReactApp);