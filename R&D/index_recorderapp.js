const express = require('express');
const { spawn } = require('child_process');
const fs = require('fs');

const app = express();
const PORT = 4001;

let recordingProcess;
let outputFile = 'output.wav';
let outputFileIndex = 1;

app.use(express.static('public'));

app.get('/start', (req, res) => {
  if (!recordingProcess) {
    // Check if the output file exists
    while (fs.existsSync(outputFile)) {
      outputFileIndex++;
      outputFile = `output_${outputFileIndex}.wav`;
    }

    const cmd = 'ffmpeg';
    const args = [
      '-f',
      'alsa',
      '-i',
      'default',
      '-acodec',
      'pcm_s16le',
      '-ar',
      '44100',
      '-ac',
      '2',
      outputFile,
    ];

    recordingProcess = spawn(cmd, args);

    recordingProcess.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    recordingProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    recordingProcess.on('close', (code) => {
      console.log(`child process exit ${code}`);
      recordingProcess = null;
      outputFile = 'output.wav';
    });

    res.send('Recording started');
  } else {
    res.send('Recording in progress');
  }
});

app.get('/stop', (req, res) => {
  if (recordingProcess) {
    recordingProcess.kill('SIGINT');
    recordingProcess.on('exit', () => {
      res.send('Recording stopped');
      recordingProcess = null;
      outputFile = 'output.wav';
    });
  } else {
    res.send('No recording to stop');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
