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
    x: 210, y: 80,
  },
];

export const ROUTES = [
  {
    start: 'termini',
    end: 'cavour',
    color: 'red',
    parts: 4, double: true,
    qx: 115, qy: 40,
  },
  {
    start: 'cavour',
    end: 'colosseo',
    color: 'blue',
    parts: 3,
  },
  {
    start: 'cavour',
    end: 'circo-massimo',
    color: 'jolly',
    parts: 2, double: true,
  },
];
