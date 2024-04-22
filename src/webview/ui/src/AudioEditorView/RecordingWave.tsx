import { useCallback, useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import React from 'react';
import RecordPlugin from 'wavesurfer.js/dist/plugins/record.esm.js';

interface IWaveformProps {}

function RecordingWave() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const recordRef = useRef<RecordPlugin | null>(null);
  const [availableAudioDevices, setAvailableAudioDevices] = useState<
    MediaDeviceInfo[]
  >([]);

  const createWaveSurfer = () => {
    // Create an instance of WaveSurfer
    if (wavesurfer.current) {
      wavesurfer.current.destroy();
    }
    wavesurfer.current = WaveSurfer.create({
      container: '#wav-container-recording',
      waveColor: 'rgb(247, 106, 13)',
      progressColor: 'rgb(221, 201, 24)',
    });

    // Initialize the Record plugin
    recordRef.current = wavesurfer.current.registerPlugin(
      RecordPlugin.create({
        scrollingWaveform: false,
        renderRecordedAudio: false,
      }),
    );

    // Mic selection
    RecordPlugin.getAvailableAudioDevices().then((devices) => {
      setAvailableAudioDevices(devices);
      devices.forEach((device) => {
        console.log('Avaialbe mic devices : ', device);
      });
    });

    recordRef.current.on('record-progress', (time) => {
      console.log('recording time : ', time);
    });
  };

  const startRecord = () => {
    if (
      recordRef.current !== null &&
      (recordRef.current.isRecording() || recordRef.current.isPaused())
    ) {
      recordRef.current.stopRecording();
      return;
    }

    // reset the wavesurfer instance

    // get selected device
    const deviceId = availableAudioDevices[0];
    recordRef.current !== null &&
      recordRef.current
        .startRecording({ deviceId })
        .then(() => {
          console.log('Start Recording ===========');
        })
        .catch((err) => {
          console.log(
            'ERROR IN STart Record ======================xxxxxxxxxxxxxxxxxxxxx',
          );
        });
  };

  useEffect(() => {
    createWaveSurfer();
    return () => {
      wavesurfer.current?.destroy();
    };
  }, []);

  return (
    <div className="flex items-center justify-between w-full gap-3">
      <div
        className="flex-1 relative h-6"
        ref={containerRef}
        id="wav-container-recording"
      />
      <button className="border border-red-500" onClick={startRecord}>
        startRecord
      </button>
    </div>
  );
}

export default RecordingWave;
