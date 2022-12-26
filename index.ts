import fs from 'fs';
import path from 'path';
import { globby } from 'globby';
import { JsonValue, loadJsonFile } from 'load-json-file';

async function loadPackage(packagePath): Promise<JsonValue | undefined> {
  const pkgJsonPath = path.join(packagePath, 'package.json');
  if (fs.existsSync(pkgJsonPath)) {
    return await loadJsonFile(pkgJsonPath);
  }
}

async function findPackages(packageSpecs, rootDirectory) {
  return packageSpecs
    .reduce(
      (pkgDirs, pkgGlob) => [
        ...pkgDirs,
        ...((await globby.hasMagic(pkgGlob))
          ? globby.sync(path.join(rootDirectory, pkgGlob), {
              nodir: false,
            })
          : [path.join(rootDirectory, pkgGlob)]),
      ],
      []
    )
    .map((location) => ({ location, package: loadPackage(location) }))
    .filter(({ location }) => !location.includes('/node_modules/'))
    .filter(({ package: { name } = {} }) => name);
}

async function getPackages(directory) {
  const lernaJsonPath = path.join(directory, 'lerna.json');
  if (fs.existsSync(lernaJsonPath)) {
    const lernaJson = await loadJsonFile(lernaJsonPath);
    if (!lernaJson?.useWorkspaces) {
      return findPackages(lernaJson.packages, directory);
    }
  }

  const pkgJsonPath = path.join(directory, 'package.json');
  if (fs.existsSync(pkgJsonPath)) {
    const pkgJson = await loadJsonFile(pkgJsonPath);
    let workspaces = pkgJson.workspaces;

    if (pkgJson.bolt) {
      workspaces = pkgJson.bolt.workspaces;
    }

    if (workspaces) {
      if (Array.isArray(workspaces)) {
        return findPackages(workspaces, directory);
      } else if (Array.isArray(workspaces.packages)) {
        return findPackages(workspaces.packages, directory);
      }
    }
  }

  // Bail if we don't find any packages
  return [];
}

module.exports = getPackages;
exports.default = getPackages;
