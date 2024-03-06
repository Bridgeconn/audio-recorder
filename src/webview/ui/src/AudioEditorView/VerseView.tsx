import { IVerseData } from "../../../../types/editor";
import React from "react";
import AudioToolBar from "./AudioToolBar";
import Play from "../IconsComponents/Play";

interface IVerseView {
  verseData: IVerseData;
  selectedVerse: number | null;
  setSelectedVerse: React.Dispatch<React.SetStateAction<number | null>>;
}

function VerseView({ verseData, selectedVerse, setSelectedVerse }: IVerseView) {
  // const handlePlayAudio = (e, verseNum: number) => {
  // console.log("Play audio : ", verseNum, verseData.audio);
  // e.stopPropagation();
  // };

  return (
    <div className="flex gap-2 items-center relative">
      {/* verse num */}
      <div className="p-2 w-6 h-6 rounded-full border border-gray-600 flex justify-center items-center">
        {verseData.verseNumber}
      </div>

      {/* content */}
      <div className="flex-1 flex flex-col">
        {/* verse content */}
        <div
          className={`border rounded-md w-full px-2 py-3 cursor-pointer min-h-10
          ${
            selectedVerse === verseData.verseNumber
              ? "border-gray-100 "
              : "border-gray-600"
          }`}
          onClick={() => setSelectedVerse(verseData.verseNumber)}
        >
          <div className="flex gap-2">
            <div className="flex-1">{verseData.verseText}</div>

            {verseData.audio && verseData.audio?.default && (
              <div className="">
                <button
                  className="flex justify-center items-center"
                  // onClick={(e) => handlePlayAudio(e, verseData.verseNumber)}
                >
                  <Play classes="w-5 h-5  stroke-green-500" />
                </button>
              </div>
            )}
          </div>
        </div>
        {/* toolbar */}
        {selectedVerse === verseData.verseNumber && (
          <AudioToolBar audioData={verseData?.audio} />
        )}
      </div>
    </div>
  );
}

export default VerseView;
