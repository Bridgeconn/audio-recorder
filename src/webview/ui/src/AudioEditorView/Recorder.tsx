import React from "react";
import Record from "../IconsComponents/Record";
import Stop from "../IconsComponents/Stop";
import { EditorToExtMSgType } from "../../../../types/editor";
import { vscode } from "../provider/vscodewebprovider";

interface IRecorderProps {
  selectedVerse: number;
}

function Recorder({ selectedVerse }: IRecorderProps) {
  const handleStartRecord = () => {
    console.log("Clicked Start record ....");
    vscode.postMessage({
      type: EditorToExtMSgType.startRecord,
      data: { verse: selectedVerse },
    });
  };

  const handleStopRecord = () => {
    console.log("Clicked Stop record ....");
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
        <Record classes="w-5 h-5 stroke-red-500 hover:stroke-red-700" />
      </button>

      <button
        className="cursor-pointer flex justify-center items-center"
        onClick={() => handleStopRecord()}
      >
        <Stop classes="w-5 h-5  stroke-red-500 hover:stroke-red-700" />
      </button>
    </div>
  );
}

export default Recorder;
