import {expect, describe, test} from 'vitest';
import {FFMpeg, FFProbe} from '../../lib/service/bin';
import path from 'node:path';

const INPUT = path.join(__dirname, 'asset', './v.mp4');

describe('Testing bin service', () => {
  test('test', async () => {
    const args = [
      '-v', 'error',
      '-show_entries', 'format=duration',
      '-of', 'default=noprint_wrappers=1:nokey=1',
      INPUT
    ];
    console.log(INPUT);
    const result = await new FFProbe().run(args).catch(console.error)
    console.log(result);
  })
})