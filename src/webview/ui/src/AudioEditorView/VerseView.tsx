import { IVerseData } from "../../../../types/editor";
import React from "react";
import AudioToolBar from "./AudioToolBar";

interface IVerseView {
  chapterData: IVerseData;
  selectedVerse: number | null;
  setSelectedVerse: React.Dispatch<React.SetStateAction<number | null>>;
}

function VerseView({
  chapterData,
  selectedVerse,
  setSelectedVerse,
}: IVerseView) {
  return (
    <div className="flex gap-2 items-center relative">
      {/* verse num */}
      <div className="p-2 w-6 h-6 rounded-full border border-gray-600 flex justify-center items-center">
        {chapterData.verseNumber}
      </div>

      {/* content */}
      <div className="flex-1 flex flex-col">
        {/* verse content */}
        <div
          className={`border rounded-md w-full px-2 py-3 cursor-pointer min-h-10
          ${
            selectedVerse === chapterData.verseNumber
              ? "border-gray-100 "
              : "border-gray-600"
          }`}
          onClick={() => setSelectedVerse(chapterData.verseNumber)}
        >
          <p>{chapterData.verseText}</p>
        </div>
        {/* toolbar */}
        {selectedVerse === chapterData.verseNumber && <AudioToolBar />}
      </div>
    </div>
  );
}

export default VerseView;
