import { expect, describe, test } from 'vitest';
import { FFMpeg, FFProbe } from '../../lib/service/bin';
import path from 'node:path';
import { VideoDurationCommand, CutVideoCommand } from '../../lib/commands';

const INPUT = path.join(__dirname, '../', 'asset', './v.mp4');

describe('testing commands', () => {
  test('video duration command works correctly', async () => {
    try {
      const v = await new VideoDurationCommand(new FFProbe()).exec({ input: INPUT });
    } catch (err) {
      console.log(err)
    }
  })

  test('video cut command works correctly', async () => {
    try {
      const ARGS = [
        "-y",
        "-i",
        "/Users/admin/Documents/project/ffmpeg/tests/asset/v.mp4",
        "-ss",
        "00:00:03",
        "-t",
        "00:00:01",
        "-progress",
        "pipe:1",
        "test.mp4",
      ]
      const v = await new CutVideoCommand(new FFMpeg()).exec({ input: INPUT, duration: '00:00:01', start: '00:00:03', output: 'test.mp4' });
    } catch (err) {
      console.log(err)
    }
  })
})