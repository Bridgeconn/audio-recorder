//sudo apt install ffmpeg
//npm install fluent-ffmpeg

const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

// silenceDuration
const silenceDurationStart = 2;
const silenceDurationEnd = 2;

const inputFolder = 'inputwav';
const outputFolder = 'outputwav';

const TempSilentAudio = (duration, outputFilePath) => {
  return new Promise((resolve, reject) => {
    ffmpeg()
      .input('aevalsrc=0')
      .inputOptions('-t', duration)
      .inputFormat('lavfi')
      .output(outputFilePath)
      .on('end', resolve)
      .on('error', reject)
      .run();
  });
};

const mergeWAVFiles = async () => {
  const files = fs
    .readdirSync(inputFolder)
    .filter((file) => file.endsWith('.wav'));
  console.log(files);
  const output = path.join(outputFolder, 'outputSilent.wav');

  const tempSilentStart = path.join(outputFolder, 'silent_start.wav');
  const tempSilentEnd = path.join(outputFolder, 'silent_end.wav');
  await Promise.all([
    TempSilentAudio(silenceDurationStart, tempSilentStart),
    TempSilentAudio(silenceDurationEnd, tempSilentEnd),
  ]);

  let ffmpegE = ffmpeg();
  ffmpegE.input(tempSilentStart);
  files.forEach((file) => {
    const inputFilePath = path.join(inputFolder, file);
    ffmpegE.input(inputFilePath);
  });

  ffmpegE.input(tempSilentEnd);

  // metadata
  ffmpegE
    .outputOption('-metadata', 'title= record')
    .outputOption('-metadata', 'artist=bcs')
    .outputOption('-metadata', 'album=bcs')

    .on('error', (err) => {
      console.error('Error: ' + err.message);
    })

    .on('end', () => {
      console.log('Merging finished');

      fs.unlinkSync(tempSilentStart);
      fs.unlinkSync(tempSilentEnd);
    })
    .mergeToFile(output, outputFolder);
};

mergeWAVFiles();
