import Map from 'es6-map';
import npmResolve from 'resolve';
import bowerResolve from 'resolve-bower';

let options = {};
let _map = [];

function find(resolver, file) {

  return new Promise((resolve) => {

    resolver(file, options, (err, res) => resolve(err ? file : res));

  });

}

find.npm = function(file) {

  return find(npmResolve, file);

};

find.bower = function(file) {

  return find(bowerResolve, file);

};

/**
 * Look for Sass files installed through npm
 * @return {Function}         Function to be used by node-sass importer
 */
export default function(opts) {

  options = opts || options;
  _map = arguments[1] || [];

  const aliases = new Map();

  return function(url, _, done) {

    if (aliases.has(url)) {

      _map.push(aliases.get(url));
      return done({ file: aliases.get(url) });

    }

    find.npm(url).then(find.bower).then((file) => {

      _map.push(file);
      aliases.set(url, file);
      done({ file });

    });

  };

}
