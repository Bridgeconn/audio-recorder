//sudo apt install ffmpeg
//npm install fluent-ffmpeg

const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

function convertWavToMp3(inputDir, outputDir) {
  console.log('Conversion started...');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  //bitrate and sample rate

  const bitrate = 128;
  const sampleRate = 44100;

  fs.readdir(inputDir, (err, files) => {
    if (err) {
      console.error('Error reading input folder:', err);
      return;
    }

    files.forEach((file) => {
      const inputFilePath = path.join(inputDir, file);
      const outputFilePath = path.join(
        outputDir,
        `${path.basename(file, path.extname(file))}.mp3`,
      );

      // WAV to MP3
      ffmpeg(inputFilePath)
        .audioBitrate(bitrate)
        .audioFrequency(sampleRate)
        .output(outputFilePath)
        .outputOption(
          '-metadata',
          `title=${path.basename(file, path.extname(file))}`,
        )
        .outputOption('-metadata', 'artist=Artist name')
        .outputOption('-metadata', 'album=Album name')

        .on('end', () => {
          console.log(`[ ${file} ] - conversion completed `);
          console.log(`dir location  /${outputDir} `);
        })
        .on('error', (err) => {
          console.error(`Error converting ${outputFilePath}:`, err);
        })
        .run();
    });
  });
}

const inputDir = 'outputwav';
const outputDir = 'mp3OutDir';
convertWavToMp3(inputDir, outputDir);
