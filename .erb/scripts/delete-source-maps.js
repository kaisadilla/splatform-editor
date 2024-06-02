//import fs from 'fs';
//import path from 'path';
//import rimraf from 'rimraf';
//import webpackPaths from '../configs/webpack.paths';
//
//export default function deleteSourceMaps() {
//  if (fs.existsSync(webpackPaths.distMainPath))
//    rimraf.sync(path.join(webpackPaths.distMainPath, '*.js.map'));
//  if (fs.existsSync(webpackPaths.distRendererPath))
//    rimraf.sync(path.join(webpackPaths.distRendererPath, '*.js.map'));
//}

import fs from 'fs';
import path from 'path';
import glob from 'glob';
import webpackPaths from '../configs/webpack.paths';

export default function deleteSourceMaps() {
  const mainSourceMapsDir = path.join(webpackPaths.distMainPath, '*.js.map');
  const rendererSourceMapsDir = path.join(webpackPaths.distRendererPath, '*.js.map');

  const mainSourceMaps = glob.sync(mainSourceMapsDir);
  const rendererSourceMaps = glob.sync(rendererSourceMapsDir);

  mainSourceMaps.forEach((sourceMap) => fs.unlinkSync(sourceMap));
  rendererSourceMaps.forEach((sourceMap) => fs.unlinkSync(sourceMap));
}