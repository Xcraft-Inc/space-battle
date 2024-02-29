export const propNames = ['status'];

export default function styles(theme, props) {
  const status = {
    position: 'absolute',
    float: 'right',
    fontSize: '150%',
    right: '30px',
    top: '23px',
    fontVariant: 'small-caps',
  };

  if (props?.status === 'running') {
    status.color = '#0F0';
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
    lineHeight: 1.4,
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
    padding: '8px',
    marginTop: '5px',
    fontFamily: 'Ubuntu Mono',
  };

  const total = {
    color: 'white',
  };

  const chrono = {
    position: 'absolute',
    float: 'right',
    right: '100px',
    bottom: '80px',
    textAlign: 'right',
  };

  const timer = {
    fontSize: '280%',
  };

  return {
    status,
    space,
    ships,
    ship,
    scores,
    small,
    large,
    goods,
    total,
    chrono,
    timer,
  };
}
