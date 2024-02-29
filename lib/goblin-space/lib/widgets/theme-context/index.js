const Fa = require('goblin_theme_fa').default;

import UbuntuLight from './fonts/Ubuntu-Light.ttf';
import UbuntuMonoRegular from './fonts/UbuntuMono-Regular.ttf';
import background from './space.png';

Fa();

function getFonts(theme) {
  return `
    @font-face {
      font-family: 'Ubuntu';
      font-style: normal;
      font-weight: 400;
      src: url('${UbuntuLight}')
    }

    @font-face {
      font-family: 'Ubuntu Mono';
      font-style: normal;
      font-weight: 400;
      src: url('${UbuntuMonoRegular}')
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
      backgroundImage: `url(${background})`,
      backgroundSize: '100vw auto',
    },

    '.root': {
      color: '#BBB', // The color needs to be redefined in specific app.
      fontFamily: 'Ubuntu',
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
      'opacity': 0.8,
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
