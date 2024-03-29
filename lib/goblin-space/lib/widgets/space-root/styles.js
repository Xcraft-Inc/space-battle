export const propNames = ['status'];

export default function styles(theme, props) {
  const status = {
    position: 'absolute',
    float: 'right',
    fontSize: '150%',
    right: '60px',
    top: '55px',
    fontVariant: 'small-caps',
  };

  if (props?.status === 'running') {
    status.color = '#8F4';
  } else {
    const blinker = {
      '0%': {opacity: 1},
      '50%': {opacity: 0},
    };
    status.color = 'orange';
    status.animationName = blinker;
    status.animationDuration = '1s';
    status.animationIterationCount = 'infinite';
  }

  const background = {
    backgroundColor: 'black',
    borderRadius: '16px',
    opacity: 0.85,
    boxShadow:
      '0 4px 12px 0 rgba(0, 0, 0, 0.6), 0 8px 20px 0 rgba(0, 0, 0, 0.6)',
  };

  const space = {
    margin: '20px',
    padding: '15px',
    minHeight: '280px',
    ...background,
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
    'left': '20px',
    'position': 'absolute',
    '& h2': {
      margin: 0,
    },
    '& th': {
      textAlign: 'left',
    },
    ...background,
    'padding': '15px',
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
    right: '20px',
    bottom: '20px',
    textAlign: 'right',
    padding: '15px',
    width: '220px',
    ...background,
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
