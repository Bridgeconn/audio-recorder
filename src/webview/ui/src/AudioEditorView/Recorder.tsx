import { useState } from 'react';
import Record from '../IconsComponents/Record';
import Stop from '../IconsComponents/Stop';
import { EditorToExtMSgType } from '../../../../types/editor';
import { vscode } from '../provider/vscodewebprovider';

interface IRecorderProps {
  selectedVerse: number;
  take: string;
  audioPresence: boolean;
}

function Recorder({ selectedVerse, take, audioPresence }: IRecorderProps) {
  const [recStarted, setRecStarted] = useState<boolean>(false);

  const handleStartRecord = () => {
    if (recStarted) return;
    setRecStarted(true);
    vscode.postMessage({
      type: EditorToExtMSgType.startRecord,
      data: { verse: selectedVerse, take: take },
    });
  };

  const handleStopRecord = () => {
    if (!recStarted) return;
    setRecStarted(false);
    vscode.postMessage({
      type: EditorToExtMSgType.stopRecord,
      data: { verse: selectedVerse, take: take },
    });
  };

  return (
    <div className="flex gap-2 items-center">
      {recStarted ? (
        <button
          className={`${
            recStarted ? 'cursor-pointer' : 'pointer-events-none'
          } flex justify-center items-center`}
          onClick={() => handleStopRecord()}
          title="Stop"
        >
          <Stop classes="w-6 h-6 stroke-red-500 hover:stroke-red-700" />
        </button>
      ) : (
        <button
          className={`${audioPresence ? 'pointer-events-none' : 'cursor-pointer '} flex justify-center items-center`}
          onClick={() => handleStartRecord()}
          title="Record"
        >
          <Record
            classes={`${recStarted && 'animate-ping'} 
            ${audioPresence ? 'fill-gray-500 hover:fill-gray-500 pointer-events-none' : 'fill-red-500 hover:fill-red-700'}
            w-4 h-4 `}
          />
        </button>
      )}
    </div>
  );
}

export default Recorder;
