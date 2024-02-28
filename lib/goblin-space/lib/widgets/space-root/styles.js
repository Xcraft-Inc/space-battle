export const propNames = ['status'];

export default function styles(theme, props) {
  const status = {
    fontSize: '60%',
  };

  if (props?.status === 'running') {
    status.color = 'green';
  } else {
    status.color = 'orange';
  }

  const space = {
    margin: '20px',
  };

  const ships = {
    display: 'grid',
    gridTemplateColumns: '25% 25% 25% 25%',
  };

  const ship = {
    padding: '10px',
    marginBottom: '15px',
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

  const small = {
    fontSize: '80%',
  };

  const large = {
    fontSize: '120%',
  };

  const goods = {
    border: '1px solid gray',
    padding: '5px',
    marginTop: '5px',
    fontFamily: 'monospace',
  };

  const total = {
    color: 'white',
  };

  const best = {};

  return {status, space, ships, ship, scores, small, large, goods, total, best};
}
