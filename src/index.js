import React from 'react';
import {render} from 'react-dom';
import { Container } from '@cerebral/react';
import App from './components/App/';
import controller from './controller';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

render(
  <Container controller={controller}>
    <App />
  </Container>, 
  document.getElementById('root')
);

registerServiceWorker();
