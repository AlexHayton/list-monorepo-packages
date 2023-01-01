/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import fs from 'node:fs';
import path from 'node:path';
import { globbySync, isDynamicPattern } from 'globby';
import loadJsonFile from 'load-json-file';
import { loadYamlFileSync } from 'load-yaml-file';
import type { PackageJson } from 'type-fest';

// Correct for Windows line endings
function joinPath(...paths: string[]): string {
  return path.join(...paths).replaceAll('\\', '/');
}

async function loadPackage(
  packagePath: string
): Promise<PackageJson | undefined> {
  const pkgJsonPath = path.join(packagePath, 'package.json');
  if (fs.existsSync(pkgJsonPath)) {
    return (await loadJsonFile(pkgJsonPath)) as PackageJson;
  }
}

function explodeGlob(glob: string, rootDirectory: string): string[] {
  const searchPath = joinPath(rootDirectory, glob);

  if (isDynamicPattern(glob)) {
    return globbySync(searchPath, {
      deep: 1,
      onlyDirectories: true,
    });
  }

  return [searchPath];
}

async function findPackages(packageSpecs: string[], rootDirectory: string) {
  const explodedPackageSpecs = packageSpecs.flatMap((glob): string[] =>
    explodeGlob(glob, rootDirectory)
  );
  console.log('explodedPackageSpecs', explodedPackageSpecs);
  const packages = await Promise.all(
    explodedPackageSpecs.map(async (location) => ({
      location,
      package: await loadPackage(location),
    }))
  );
  console.log('packages', packages);
  return packages
    .filter(({ location }) => !location.includes('/node_modules/'))
    .filter(({ package: { name } = { name: undefined } }) => name);
}

async function getPackages(directory: string) {
  const lernaJsonPath = path.join(directory, 'lerna.json');
  if (fs.existsSync(lernaJsonPath)) {
    const lernaJson = (await loadJsonFile(lernaJsonPath)) as any;
    if (!lernaJson?.useWorkspaces) {
      return findPackages(lernaJson.packages, directory);
    }
  }

  const pnpmYamlPath = path.join(directory, 'pnpm-workspace.yaml');
  if (fs.existsSync(pnpmYamlPath)) {
    const pnpmJson = (await loadYamlFileSync(pnpmYamlPath)) as any;
    if (pnpmJson?.packages) {
      return findPackages(pnpmJson.packages, directory);
    }
  }

  const pkgJsonPath = path.join(directory, 'package.json');
  if (fs.existsSync(pkgJsonPath)) {
    const pkgJson = (await loadJsonFile(pkgJsonPath)) as any;
    // eslint-disable-next-line prefer-destructuring
    let workspaces = pkgJson.workspaces;

    if (pkgJson.bolt) {
      workspaces = pkgJson.bolt.workspaces;
    }

    if (workspaces) {
      if (Array.isArray(workspaces)) {
        return findPackages(workspaces, directory);
      }

      if (Array.isArray(workspaces.packages)) {
        return findPackages(workspaces.packages, directory);
      }
    }
  }

  // Bail if we don't find any packages
  return [];
}

export default getPackages;
