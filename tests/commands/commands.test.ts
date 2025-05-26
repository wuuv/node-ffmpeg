import {expect, describe, test} from 'vitest';
import {FFMpeg, FFProbe} from '../../lib/service/bin';
import path from 'node:path';
import {VideoDurationCommand} from '../../lib/commands';

const INPUT = path.join(__dirname, '../', 'asset', './v.mp4');

describe('testing commands', () => {
  test('video duration commands works correctly', async () => {
    try {
      const v = await new VideoDurationCommand(new FFProbe()).exec({input: INPUT});
    } catch (err) {
      console.log(err)
    }
  })
})