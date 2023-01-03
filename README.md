# `list-monorepo-packages`

[![CircleCI](https://dl.circleci.com/status-badge/img/gh/AlexHayton/list-monorepo-packages/tree/main.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/AlexHayton/list-monorepo-packages/tree/main)
[![Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![npm](https://img.shields.io/npm/v/list-monorepo-packages.svg?style=flat-square)](https://npmjs.org/list-monorepo-packages)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)

## Forked from https://github.com/azz/get-monorepo-packages

Get a list of packages from a monorepo. Upgraded to latest dependencies, modern ESM support (as at 2023-01-01) and adds Typescript and PNPM support.

Supports:

- [Lerna](https://github.com/lerna/lerna)
- [Yarn workspaces](https://yarnpkg.com/lang/en/docs/workspaces/)
- [Bolt](http://boltpkg.com/)
- [PNPM](https://pnpm.io/)

## Install

```bash
npm install --save list-monorepo-packages
```

## Usage

```js
import listPackages from 'list-monorepo-packages';
await getPackages('/path/to/root');
```

Returns an array of objects containing:

- `location` - The relative path to the package.
- `package` - The `package.json` file for the package.
