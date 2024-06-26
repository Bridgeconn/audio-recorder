import { useEffect, useState } from 'react';
import { ExttoEditorWebMsgTypes, IAudioData } from '../../../../types/editor';
import Delete from '../IconsComponents/Delete';
import Pause from '../IconsComponents/Pause';
import Play from '../IconsComponents/Play';
import Rewind from '../IconsComponents/Rewind';
import Waveform from './Waveform';
import Recorder from './Recorder';
import { vscode } from '../provider/vscodewebprovider';
import { EditorToExtMSgType } from '../../../../types/editor';
import TakeButton from '../components/buttons/takeBtn';
import Timer from './Timer';
interface IAudioToolBarProps {
  audioData: IAudioData | undefined;
  selectedVerse: number;
}

function AudioToolBar({ audioData, selectedVerse }: IAudioToolBarProps) {
  const [control, setControl] = useState('');
  const [selectedTake, setSelectedTake] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  // use effect to find the default take number and set in selectedTake
  useEffect(() => {
    if (audioData && audioData.default) {
      // auto selection of efault audio take on initial render
      setSelectedTake(audioData.default[4]);
    } else {
      // if no recorder audio for verse , kept take 1 as initial
      setSelectedTake('1');
    }

    const handleExtensionPostMessages = (event: MessageEvent) => {
      const { type, data } = event.data;
      switch (type) {
        case ExttoEditorWebMsgTypes.RecordingFlag: {
          // on record stop
          if (!data.recordingFlag) {
            setSelectedTake(data.take.replace('_default', ''));
          }
          // processed vesification data from workspace dir
          setIsRecording(data.recordingFlag);
          break;
        }

        default:
          break;
      }
    };

    // add listener for the event
    window.addEventListener('message', handleExtensionPostMessages);

    return () => {
      // clean up event listener
      window.removeEventListener('message', handleExtensionPostMessages);
    };
  }, []);

  const handleDelete = () => {
    // To check whether current take is default or not & update the take
    let currentTake = selectedTake;
    if (audioData?.default?.includes(selectedTake)) {
      currentTake = `${selectedTake}_default`;
    }
    vscode.postMessage({
      type: EditorToExtMSgType.deleteAudio,
      data: { verse: selectedVerse, take: currentTake },
    });
  };

  const handleTakeClick = (
    e: React.MouseEvent<HTMLElement>,
    take: '1' | '2' | '3',
    doubleClk: boolean = false,
  ) => {
    if (doubleClk) {
      if (audioData && audioData[`take${take}`]) {
        vscode.postMessage({
          type: EditorToExtMSgType.defaultChange,
          data: {
            verse: selectedVerse,
            take: take,
            defaultAudio: audioData.default,
          },
        });
      }
    } else {
      if (!audioData) {
        setSelectedTake(`${take}_default`);
      } else {
        setSelectedTake(take);
      }
    }
  };

  return (
    <div
      className="w-[99%] h-7 border border-gray-600 my-1 px-2 py-1 -bottom-10 right-0 self-center
        bg-[var(--vscode-textSeparator-foreground)] flex gap-5 items-center"
    >
      {/* Waves */}
      <div className="flex-1">
        {audioData?.default && !isRecording && (
          <Waveform
            url={
              audioData[
                `take${selectedTake}` as unknown as 'take1' | 'take2' | 'take3'
              ] as string
            }
            control={control}
            setControl={setControl}
          />
        )}
        {isRecording && <Timer isRunning={isRecording} />}
      </div>

      {/* Buttons */}
      <div className="flex gap-2 items-center">
        <Recorder
          selectedVerse={selectedVerse}
          take={selectedTake}
          audioPresence={
            !!audioData?.[
              `take${selectedTake}` as unknown as 'take1' | 'take2' | 'take3'
            ]
          }
        />

        {control === 'play' ? (
          <button
            className={`${audioData?.[`take${selectedTake}` as unknown as 'take1' | 'take2' | 'take3'] ? 'cursor-pointer' : 'pointer-events-none'}  flex justify-center items-center`}
            onClick={() => setControl('pause')}
            title="Pause"
          >
            <Pause classes="w-6 h-6 fill-blue-500 hover:fill-blue-600" />
          </button>
        ) : (
          <button
            className={`${audioData?.[`take${selectedTake}` as unknown as 'take1' | 'take2' | 'take3'] ? 'cursor-pointer' : 'pointer-events-none'}  flex justify-center items-center`}
            onClick={() => setControl('play')}
            title="Play"
          >
            <Play
              classes={`w-5 h-5 ${audioData?.[`take${selectedTake}` as unknown as 'take1' | 'take2' | 'take3'] ? 'stroke-green-400 hover:stroke-green-600' : 'stroke-gray-500 hover:stroke-gray-600 '}`}
            />
          </button>
        )}

        <button
          className={`${audioData?.[`take${selectedTake}` as unknown as 'take1' | 'take2' | 'take3'] ? 'cursor-pointer' : 'pointer-events-none'}  flex justify-center items-center`}
          onClick={() => setControl('rewind')}
          title="Rewind"
        >
          <Rewind
            classes={`w-4 h-4 ${audioData?.[`take${selectedTake}` as unknown as 'take1' | 'take2' | 'take3'] ? 'stroke-green-400 hover:stroke-green-600' : 'stroke-gray-500 hover:stroke-gray-600 '}`}
          />
        </button>

        <button
          className={`${audioData?.[`take${selectedTake}` as unknown as 'take1' | 'take2' | 'take3'] ? 'cursor-pointer' : 'pointer-events-none'}  flex justify-center items-center`}
          onClick={() => handleDelete()}
          title="Delete"
        >
          <Delete
            classes={`w-5 h-5 ${audioData?.[`take${selectedTake}` as unknown as 'take1' | 'take2' | 'take3'] ? 'stroke-blue-500 hover:stroke-red-600' : 'stroke-gray-500 hover:stroke-gray-600 '}`}
          />
        </button>
      </div>

      {/* takes */}
      <div className="flex gap-2 items-center">
        <TakeButton
          text="A"
          placeholder="Take A"
          value="1"
          selectedTake={selectedTake}
          onClick={handleTakeClick}
          defaulted={audioData?.default === 'take1'}
          recorded={audioData?.take1 ? true : false}
        />
        <TakeButton
          text="B"
          placeholder="Take B"
          value="2"
          selectedTake={selectedTake}
          onClick={handleTakeClick}
          defaulted={audioData?.default === 'take2'}
          recorded={audioData?.take2 ? true : false}
        />
        <TakeButton
          text="C"
          placeholder="Take C"
          value="3"
          selectedTake={selectedTake}
          onClick={handleTakeClick}
          defaulted={audioData?.default === 'take3'}
          recorded={audioData?.take3 ? true : false}
        />
      </div>
    </div>
  );
}

export default AudioToolBar;
