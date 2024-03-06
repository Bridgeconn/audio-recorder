import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import WaveSurfer from "wavesurfer.js";

interface IWaveformProps {
  url: string;
  playPause: boolean;
}

function Waveform({ url, playPause }: IWaveformProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);

  // state holds audio data - later use if needed
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>("");

  /**
   * fetch audio data and load wave
   */
  function fetchAudioFile(audioPath:string) {
    fetch(audioPath)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => {
        console.log({ arrayBuffer });
        // const blob = new Blob([arrayBuffer], { type: "audio/mpeg" });
        const blob = new Blob([arrayBuffer]);
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob)
        setAudioUrl(url);
        // const audio = new Audio(url)
        // audio.play()

        wavesurfer.current = WaveSurfer.create({
          container: "#wav-container",
          waveColor: "rgb(200, 0, 200)",
          progressColor: "#0073E5",
          cursorColor: "OrangeRed",
          height: 100,
          hideScrollbar: true,
          interact: true,
          backend: "MediaElement",
          // plugins: [
          //   microphone,
          // ],
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

  const onPlayPause = useCallback(() => {
    console.log("click play pause ======");

    wavesurfer.current && wavesurfer.current.playPause();
  }, [wavesurfer]);

  useEffect(() => {
    onPlayPause();
  }, [playPause]);

  return (
    <>
      <div
        className="w-full"
        ref={containerRef}
        id="wav-container"
      />
    </>
  );
}

export default Waveform;
