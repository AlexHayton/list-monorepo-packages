/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import getPackages from '.';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const LERNA_DIR = path.join('./fixture/lerna');
const YARN_DIR_1 = path.join('./fixture/yarn');
const YARN_DIR_2 = path.join('./fixture/yarn-2');
const BOLT_DIR = path.join('./fixture/bolt');
const PNPM_DIR = path.join('./fixture/pnpm');

describe('getPackages()', () => {
  test('lerna matches snapshot', async () => {
    expect(await getPackages(LERNA_DIR)).toMatchSnapshot();
  });

  test('yarn matches snapshot', async () => {
    expect(await getPackages(YARN_DIR_1)).toMatchSnapshot();
  });

  test('yarn 1.4.2+ matches snapshot', async () => {
    expect(await getPackages(YARN_DIR_2)).toMatchSnapshot();
  });

  test('bolt matches snapshot', async () => {
    expect(await getPackages(BOLT_DIR)).toMatchSnapshot();
  });

  test('pnpm matches snapshot', async () => {
    expect(await getPackages(PNPM_DIR)).toMatchSnapshot();
  });

  test('returns empty array when no packages', async () => {
    expect(await getPackages(__dirname)).toEqual([]);
  });
});
