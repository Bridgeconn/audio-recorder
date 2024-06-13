const { spawn } = require('child_process');
import * as vscode from 'vscode';
import * as os from 'os';
export const startRecord = (
  outputFilePath: string,
  book: string,
  chapter: number,
  verse: number,
  projectName: string,
  userName: string,
  mic: string
) => {
  // ffmpeg -f dshow -i audio="External Microphone (Synaptics Audio)" NAME1.wav
  console.log("Selected MIc", mic);

  const cmd = 'ffmpeg';
  let args
  if (os.platform() === 'linux') {
    console.log("In Linux");

    args = [
      '-f',
      'alsa', // TODO : this is alsa for linux -> need to fix later for wind and mac
      '-i',
      'default',
      '-acodec',
      'pcm_s24le', // PCM signed 24-bit little-endian
      '-ar',
      '48000',
      '-ac',
      '1',
      '-y', // overwrite file with same name
      '-metadata',
      `title=${book} ${chapter}:${verse}`,
      '-metadata',
      `artist=${userName}-Scribe Audio Extension`,
      '-metadata',
      `album=${projectName}`,
      '-metadata',
      `date=${new Date().getFullYear().toString()}`,
      outputFilePath,
    ];
  } else if (os.platform() === 'win32') {
    console.log("In windows");

    args = [
      '-f',
      'dshow',
      '-i',
      `audio=${mic}`,
      '-acodec',
      'pcm_s24le', // PCM signed 24-bit little-endian
      '-ar',
      '48000',
      '-ac',
      '1',
      '-y', // overwrite file with same name
      '-metadata',
      `title=${book} ${chapter}:${verse}`,
      '-metadata',
      `artist=${userName}-Scribe Audio Extension`,
      '-metadata',
      `album=${projectName}`,
      '-metadata',
      `date=${new Date().getFullYear().toString()}`,
      outputFilePath,
    ]
  }

  let recordingProcess = spawn(cmd, args);

  // This will show recodring progress data
  // recordingProcess.stdout.on("data", (data) => {
  //   console.log(`stdout: ${data}`);
  // });

  // recordingProcess.stderr.on("data", (data) => {
  //   console.error(`stderr: ${data}`);
  // });

  recordingProcess.on('close', (code: unknown) => {
    recordingProcess = null;
  });

  return recordingProcess;
};

/**
 * Stop Record Function
 */
export const stopRecord = (recordingProcess: any) => {
  if (recordingProcess) {
    recordingProcess.kill('SIGINT');
    recordingProcess.on('exit', () => {
      recordingProcess = null;
    });
  } else {
    console.error('No recording to stop');
  }
};
