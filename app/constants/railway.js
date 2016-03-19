export const STATIONS = [
  {
    name: 'Termini',
    slug: 'termini',
    x: 50, y: 50,
  },
  {
    name: 'Cavour',
    slug: 'cavour',
    x: 150, y: 80,
  },
  {
    name: 'Colosseo',
    slug: 'colosseo',
    x: 200, y: 30,
  },
  {
    name: 'Circo Massimo',
    slug: 'circo-massimo',
    x: 230, y: 80,
  },
];

export const ROUTES = [
  {
    start: 'termini',
    end: 'cavour',
    color: 'red',
    parts: 4,
    qx: 110, qy: 50,
    displace: {
      x1: -4, y1: -4.5,
      x2: 4, y2: 0,
      qx: 0, qy: -4.5,
    },
  },
  {
    start: 'termini',
    end: 'cavour',
    color: 'orange',
    parts: 4,
    qx: 110, qy: 50,
    displace: {
      x1: -3, y1: 4.5,
      x2: 3, y2: 9,
      qx: -4, qy: 4,
    },
  },
  {
    start: 'cavour',
    end: 'colosseo',
    color: 'blue',
    parts: 2,
  },
  {
    start: 'cavour',
    end: 'circo-massimo',
    color: 'jolly',
    parts: 3,
    dx: -4.5, dy: -4.5,
    displace: {
      x1: -4.5, y1: -4.5,
      x2: 4.5, y2: -4.5,
    },
  },
  {
    start: 'cavour',
    end: 'circo-massimo',
    color: 'jolly',
    parts: 3,
    displace: {
      x1: -4.5, y1: 4.5,
      x2: 4.5, y2: 4.5,
    },
  },
];
