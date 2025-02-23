import importer from 'goblin-laboratory/widgets/importer/importer.js';

function requireContext(files) {
  function r(file) {
    return files[file]();
  }

  r.keys = () => Object.keys(files);

  return r;
}

// prettier-ignore
const config = {
  'styles': null,
  'widget': requireContext({
    './goblin-space-battle-viewer/widgets/space-root/widget.js': () => require('goblin-space-battle-viewer/widgets/space-root/widget.js'),
  }),
  'reducer': require.context('../../../../node_modules', true, /goblin-(?:space-battle-viewer|desktop|laboratory|gadgets)\/widgets\/[^/]+\/reducer\.js$/),
  'theme-context': requireContext({
    './goblin-space-battle-viewer/widgets/theme-context/index.js': () => require('goblin-space-battle-viewer/widgets/theme-context/index.js'),
  }),
  'compensator': null,
  'app-reducer': null
};

export default importer(config);
