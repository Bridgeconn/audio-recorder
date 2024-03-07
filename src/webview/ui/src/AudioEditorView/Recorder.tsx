import React, { useState } from "react";
import Record from "../IconsComponents/Record";
import Stop from "../IconsComponents/Stop";
import { EditorToExtMSgType } from "../../../../types/editor";
import { vscode } from "../provider/vscodewebprovider";

interface IRecorderProps {
  selectedVerse: number;
}

function Recorder({ selectedVerse }: IRecorderProps) {
  const [recStarted, setRecStarted] = useState<boolean>(false);

  const handleStartRecord = () => {
    console.log("Clicked Start record ....");
    if (recStarted) return;
    setRecStarted(true);
    vscode.postMessage({
      type: EditorToExtMSgType.startRecord,
      data: { verse: selectedVerse },
    });
  };

  const handleStopRecord = () => {
    console.log("Clicked Stop record ....");
    if (!recStarted) return;
    setRecStarted(false);
    vscode.postMessage({
      type: EditorToExtMSgType.stopRecord,
      data: { verse: selectedVerse },
    });
  };

  return (
    <div className="flex gap-2 items-center">
      <button
        className="cursor-pointer flex justify-center items-center"
        onClick={() => handleStartRecord()}
      >
        <Record
          classes={`${
            recStarted && "animate-ping"
          } w-5 h-5 stroke-red-500 hover:stroke-red-700`}
        />
      </button>

      <button
        className={`${
          recStarted ? "cursor-pointer" : "pointer-events-none"
        } flex justify-center items-center`}
        onClick={() => handleStopRecord()}
      >
        <Stop classes="w-5 h-5  stroke-red-500 hover:stroke-red-700" />
      </button>
    </div>
  );
}

export default Recorder;
