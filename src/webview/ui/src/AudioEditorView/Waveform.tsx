import { useCallback, useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';

interface IWaveformProps {
  url: string;
  control: string;
}

function Waveform({ url, control }: IWaveformProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);

  /**
   * fetch audio data and load wave
   */
  function fetchAudioFile(audioPath: string) {
    fetch(audioPath)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => {
        const blob = new Blob([arrayBuffer]);
        const url = URL.createObjectURL(blob);

        wavesurfer.current = WaveSurfer.create({
          container: '#wav-container',
          waveColor: 'rgb(200, 0, 200)',
          progressColor: '#0073E5',
          cursorColor: 'OrangeRed',
          height: 'auto',
          hideScrollbar: true,
          interact: true,
          backend: 'MediaElement',
        });

        // wavesurfer.current?.load("https://www.mfiles.co.uk/mp3-downloads/brahms-st-anthony-chorale-theme-two-pianos.mp3");
        //vscode :  https://file%2B.vscode-resource.vscode-cdn.net/home/siju/Music/Empty%20-%20new%20audio/audio/ingredients/GEN/1/1_1_1_default.mp3
        wavesurfer.current?.load(url);
      });
  }

  // initial load audio
  useEffect(() => {
    fetchAudioFile(url);
  }, [url]);

  const onPlay = useCallback(() => {
    wavesurfer.current && wavesurfer.current.play();
  }, [wavesurfer]);

  const onPause = useCallback(() => {
    wavesurfer.current && wavesurfer.current.pause();
  }, [wavesurfer]);

  const onRewind = useCallback(() => {
    wavesurfer.current && wavesurfer.current.stop();
  }, [wavesurfer]);

  useEffect(() => {
    switch (control) {
      case 'play': {
        onPlay();
        break;
      }
      case 'pause': {
        onPause();
        break;
      }
      case 'rewind': {
        onRewind();
        break;
      }
      default:
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [control]);

  return (
    <>
      <div
        className="w-full relative h-6"
        ref={containerRef}
        id="wav-container"
      />
    </>
  );
}

export default Waveform;
