export const ROUTES = [
  {
    start: 'venezia', end: 'colosseo',
    type: 'green', parts: 1,
  },
  {
    start: 'termini', end: 'colosseo',
    type: 'blue', parts: 2,
    displace: {
      x1: -3.5, y1: -3.5,
      x2: -3.5, y2: 2,
    },
  },
  {
    start: 'termini', end: 'colosseo',
    type: 'wild', parts: 2,
    displace: {
      x1: 3.5, y1: -2,
      x2: 3.5, y2: 3.5,
    },
  },
  {
    start: 'termini', end: 'spagna',
    type: 'red', parts: 2,
    qx: 204, qy: 146,
  },
  {
    start: 'venezia', end: 'spagna',
    type: 'orange', parts: 1,
  },
  {
    start: 'spagna', end: 'ottaviano',
    type: 'wild', parts: 3,
    qx: 159, qy: 123,
    displace: {
      x1: 5, y1: 0,
      x2: -3.5, y2: -3.5,
      qx: 5, qy: -3,
    },
  },
  {
    start: 'spagna', end: 'ottaviano',
    type: 'red', parts: 3,
    qx: 159, qy: 123,
    displace: {
      x1: 0, y1: 6,
      x2: -3.5, y2: 3.5,
      qx: 4, qy: 4,
    },
  },
  {
    start: 'cipro', end: 'ottaviano',
    type: 'black', parts: 1,
  },
  {
    start: 'cipro', end: 'battistini',
    type: 'red', parts: 4,
    qx: 51, qy: 159,
  },
  {
    start: 'clodio-mazzini', end: 'ottaviano',
    type: 'purple', parts: 1,
  },
  {
    start: 'ottaviano', end: 'san-pietro',
    type: 'white', parts: 2,
  },
  {
    start: 'venezia', end: 'san-pietro',
    type: 'yellow', parts: 3,
    qx: 144, qy: 166,
  },
  {
    start: 'spagna', end: 'buenos-aires',
    type: 'white', parts: 2,
  },
  {
    start: 'vescovio', end: 'buenos-aires',
    type: 'orange', parts: 2,
  },
  {
    start: 'vescovio', end: 'jonio',
    type: 'black', parts: 3,
  },
  {
    start: 'jonio', end: 'talenti',
    type: 'green', parts: 2,
  },
  {
    start: 'talenti', end: 'ojetti',
    type: 'orange', parts: 2,
  },
  {
    start: 'jonio', end: 'conca-d-oro',
    type: 'wild', parts: 1,
  },
  {
    start: 'conca-d-oro', end: 'bologna',
    type: 'blue', parts: 4,
  },
  {
    start: 'termini', end: 'policlinico',
    type: 'purple', parts: 2,
  },
  {
    start: 'bologna', end: 'policlinico',
    type: 'yellow', parts: 1,
  },
  {
    start: 'bologna', end: 'tiburtina',
    type: 'wild', parts: 1,
  },
  {
    start: 'tiburtina', end: 'pietralata',
    type: 'purple', parts: 3,
  },
  {
    start: 'pietralata', end: 'rebibbia',
    type: 'blue', parts: 3,
  },
  {
    start: 'venezia', end: 'trastevere',
    type: 'orange', parts: 3,
  },
  {
    start: 'trastevere', end: 'roma-tre',
    type: 'white', parts: 2,
  },
  {
    start: 'roma-tre', end: 'eur-magliana',
    type: 'red', parts: 2,
  },
  {
    start: 'eur-magliana', end: 'agricoltura',
    type: 'purple', parts: 1,
  },
  {
    start: 'colosseo', end: 'piramide',
    type: 'black', parts: 2,
  },
  {
    start: 'piramide', end: 'basilica-s-paolo',
    type: 'yellow', parts: 3,
  },
  {
    start: 'basilica-s-paolo', end: 'eur-magliana',
    type: 'green', parts: 2,
  },
  {
    start: 'eur-magliana', end: 'laurentina',
    type: 'black', parts: 3,
  },
  {
    start: 'termini', end: 's-giovanni',
    type: 'red', parts: 3,
  },
  {
    start: 's-giovanni', end: 'ponte-lungo',
    type: 'wild', parts: 2,
  },
  {
    start: 'ponte-lungo', end: 'arco-di-travertino',
    type: 'blue', parts: 2,
  },
  {
    start: 'arco-di-travertino', end: 'numidio-quadrato',
    type: 'green', parts: 2,
  },
  {
    start: 'numidio-quadrato', end: 'subaugusta',
    type: 'purple', parts: 2,
  },
  {
    start: 'subaugusta', end: 'anagnina',
    type: 'red', parts: 3,
  },
  {
    start: 'colosseo', end: 's-giovanni',
    type: 'green', parts: 3,
  },
  {
    start: 's-giovanni', end: 'pigneto',
    type: 'orange', parts: 2,
  },
  {
    start: 'pigneto', end: 'parco-di-centocelle',
    type: 'white', parts: 4,
  },
  {
    start: 'parco-di-centocelle', end: 'grotte-celoni',
    type: 'black', parts: 6,
  },
  {
    start: 'grotte-celoni', end: 'pantano',
    type: 'green', parts: 4,
  },


  {
    start: 'cipro', end: 'san-pietro',
    type: 'wild', parts: 2,
  },
  {
    start: 'san-pietro', end: 'trastevere',
    type: 'blue', parts: 4,
  },
  {
    start: 'trastevere', end: 'piramide',
    type: 'wild', parts: 2,
  },
  {
    start: 'piramide', end: 'ponte-lungo',
    type: 'red', parts: 6,
  },
  {
    start: 'ponte-lungo', end: 'pigneto',
    type: 'yellow', parts: 2,
  },
  {
    start: 'tiburtina', end: 'pigneto',
    type: 'wild', parts: 3,
  },
  {
    start: 'spagna', end: 'vescovio',
    type: 'purple', parts: 6,
  },
  {
    start: 'conca-d-oro', end: 'tiburtina',
    type: 'white', parts: 6,
  },
/*  {
    start: '', end: '',
    type: '', parts: ,
  },
  {
    start: '', end: '',
    type: '', parts: ,
  },*/
];
