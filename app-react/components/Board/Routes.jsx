import React from 'react';
import Route from './Route';
import { ROUTES } from '../../config/routes';



export const Routes = () =>
  <g className="routes">
    {ROUTES.map((route, key) =>
      <Route key={key} route={route} />
    )}
  </g>;
