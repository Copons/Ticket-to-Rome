import React from 'react';
import { ROUTES } from '../../config/routes';
import { STATIONS } from '../../config/stations';


export const Routes = () =>
  <g className="routes">
    {ROUTES.map((route, i) => {
      const stations = {
        start: STATIONS.find(s => s.slug === route.start),
        end: STATIONS.find(s => s.slug === route.end),
      };
      return (
        <path
          key={i}
          className={`route unclaimed ${route.type}`}
          start={route.start}
          end={route.end}
          d={`M ${stations.start.x} ${stations.start.y} L ${stations.end.x} ${stations.end.y}`}
          strokeDasharray={routeDashArray(route, stations)}
        />
      );
    })}
  </g>;




function routeLength (p0, p1) {
  return Math.sqrt(Math.pow(p1.x - p0.x, 2) + Math.pow(p1.y - p0.y, 2));
}

function routeDashArray (route, stations) {
  const routeLen = routeLength(stations.start, stations.end);
  const offset = 6;
  const gap = 1.5;
  const pathLen = routeLen - offset * 2 - (route.parts - 1) * gap;
  const dashes = [0, 6];
  for (let i = 0; i < route.parts; i++) {
    dashes.push(pathLen / route.parts);
    if (i !== route.parts - 1) {
      dashes.push(gap);
    }
  }
  dashes.push(offset);
  return dashes.join(', ');
}
