const Fa = require('goblin_theme_fa').default;

import LatoRegularWoff from './fonts/lato-v14-latin-regular.woff';
import LatoRegularWoff2 from './fonts/lato-v14-latin-regular.woff2';

Fa();

function getFonts(theme) {
  return `
    @font-face {
      font-family: 'Lato';
      font-style: normal;
      font-weight: 400;
      src:
        url('${LatoRegularWoff2}') format('woff2'), /* Chrome 26+, Opera 23+, Firefox 39+ */
        url('${LatoRegularWoff}') format('woff'); /* Chrome 6+, Firefox 3.6+, IE 9+, Safari 5.1+ */
    }
  `;
}

function getGlobalStyles(theme) {
  if (!theme) {
    console.warn('Theme is undefined in globalStyles');
  }

  return {
    '*': {
      boxSizing: 'border-box',
    },

    ':root': {
      backgroundColor: '#222',
    },

    '.root': {
      color: '#999', // The color needs to be redefined in specific app.
      fontFamily: theme.typo.font,
      margin: 0,
      padding: 0,
      userSelect: 'none',
    },

    'input': {
      fontFamily: 'inherit',
    },

    'button': {
      fontFamily: 'inherit',
    },

    'p': {
      display: 'block',
      lineHeight: '1em',
      padding: 0,
      margin: 0,
    },

    'h1': {
      fontSize: '26px',
      fontWeight: 'normal',
    },

    'h2': {
      fontsize: '22px',
    },

    'h3': {
      'fontSize': '18px',
      'fontWeight': 'bold',
      'opacity': 0.6,
      'margin-block-end': '0.6em',
      'margin-block-start': '1.2em',
    },

    '::-webkit-scrollbar': {
      width: '11px',
      backgroundColor: 'rgba(248,241,248,0.05)',
      borderRadius: '10px',
      border: '1px solid transparent',
      backgroundClip: 'padding-box',
    },
    '::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(255,255,255,0.25)',
      borderRadius: ' 10px',
      border: '2px solid transparent',
      backgroundClip: 'padding-box',
    },
    '::-webkit-scrollbar-thumb:hover': {
      border: 'none',
    },
    '::-webkit-scrollbar-corner': {
      backgroundColor: 'transparent',
    },
  };
}

export default {
  getFonts,
  getGlobalStyles,
  builders: {
    default: require('goblin-theme').defaultBuilders,
  },
};
