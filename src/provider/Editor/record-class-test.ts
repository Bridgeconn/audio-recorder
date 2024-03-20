// //  -------------------------------- working Js code ----------------------
// // const mic = require("mic");
// // var fs = require("fs");

// // const micInstance = mic({
// //   rate: "48000",
// //   channels: "2",
// //   device: 'hw:0,0',
// //   debug: true,
// //   exitOnSilence: 10,
// // });
// // const micInputStream = micInstance.getAudioStream();

// // const outputFileStream = fs.WriteStream("output.wav");

// // micInputStream.pipe(outputFileStream);

// // let totalDataReceived = 0; // total data received in bytes

// // micInputStream.on("data", function (data) {
// //   totalDataReceived += data.length;
// //   console.log("Received Input Stream: " + data.length);
// //   console.log("Total data received: " + totalDataReceived);
// // });

// // micInputStream.on("error", function (err) {
// //   console.log("Error in Input Stream: " + err);
// // });

// // micInstance.start();

// // setTimeout(function () {
// //   micInstance.stop();
// // }, 5000);
// //  -------------------------------- working Js code till here  ----------------------

// /**
//  * Class Implementaton Recorder -- THIS CODE IS NOT WORKING ---------------
//  */

// const mic = require('mic');
// import * as fs from 'fs';
// import * as vscode from 'vscode';

// class Recorder {
//   private micInstance: any;
//   private micInputStream: NodeJS.ReadableStream | null;
//   private outputFileStream: fs.WriteStream | null;
//   private totalDataReceived: number;

//   constructor() {
//     this.micInstance = mic({
//       rate: '48000',
//       channels: '2',
//       device: 'hw:0,0',
//       debug: true,
//       exitOnSilence: 10,
//     });
//     this.micInputStream = null;
//     this.outputFileStream = null;
//     this.totalDataReceived = 0;

//     this.setupMicInputStream();
//   }

//   private setupMicInputStream(): void {
//     this.micInputStream = this.micInstance.getAudioStream();
//     this.setupEventListeners();
//     this.micInstance.start();
//   }

//   private setupEventListeners(): void {
//     if (this.micInputStream) {
//       this.micInputStream.on('data', (data: Buffer) => {
//         this.totalDataReceived += data.length;
//         console.log('Received Input Stream: ' + data.length);
//         console.log('Total data received: ' + this.totalDataReceived);
//       });

//       this.micInputStream.on('error', (err: Error) => {
//         console.log('Error in Input Stream: ' + err);
//       });
//     }
//   }

//   startRecording(outputFilePath: string): void {
//     if (this.micInputStream) {
//       this.outputFileStream = fs.createWriteStream(outputFilePath);
//       this.micInputStream.pipe(this.outputFileStream);
//       console.log('Recording started.');
//     } else {
//       console.log('Cannot start recording: No input stream available.');
//     }
//   }

//   stopRecording(): void {
//     if (this.outputFileStream) {
//       this.micInputStream?.unpipe(this.outputFileStream);
//       this.outputFileStream.close();
//       this.micInstance.stop();
//       this.outputFileStream = null;
//       console.log('Recording stopped.');
//     } else {
//       console.log('No recording to stop.');
//     }
//   }
// }

// export default Recorder;
