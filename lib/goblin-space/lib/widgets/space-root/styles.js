export default function styles() {
  const status = {
    fontSize: '60%',
  };

  const space = {
    margin: '20px',
  };

  const ships = {
    display: 'grid',
    gridTemplateColumns: '25% 25% 25% 25%',
  };

  const ship = {
    border: 1,
    borderColor: 'blue',
    padding: '5px',
  };

  const scores = {
    'minWidth': '50%',
    'bottom': '20px',
    'position': 'absolute',
    '& h2': {
      margin: 0,
    },
    '& th': {
      textAlign: 'left',
    },
  };

  return {status, space, ships, ship, scores};
}
