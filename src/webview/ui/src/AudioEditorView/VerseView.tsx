import { IVerseData } from '../../../../types/editor';
import React from 'react';
import AudioToolBar from './AudioToolBar';
import Speaker from '../IconsComponents/Speaker';

interface IVerseView {
  verseData: IVerseData;
  selectedVerse: number | null;
  setSelectedVerse: React.Dispatch<React.SetStateAction<number | null>>;
  scriptDirection: 'ltr' | 'rtl' | undefined;
}

function VerseView({
  verseData,
  selectedVerse,
  setSelectedVerse,
  scriptDirection,
}: IVerseView) {
  return (
    <div
      className={`flex gap-2 items-center relative ${scriptDirection === 'rtl' && 'flex-row-reverse'}`}
    >
      {/* verse num */}
      {verseData.verseNumber > 0 && (
        <div className="p-2 w-6 h-6 rounded-full border border-gray-600 flex justify-center items-center">
          {verseData.verseNumber}
        </div>
      )}

      {/* content */}
      <div className="flex-1 flex flex-col">
        {/* verse content */}
        <div
          className={`border rounded-md w-full px-2 py-3 cursor-pointer min-h-10
          ${
            selectedVerse === verseData.verseNumber
              ? 'border-gray-100 '
              : 'border-gray-600'
          }`}
          onClick={() => setSelectedVerse(verseData.verseNumber)}
        >
          <div
            className={`flex gap-2 ${scriptDirection === 'rtl' && 'flex-row-reverse text-end'}`}
          >
            <div className="flex-1">{verseData.verseText}</div>

            {verseData.audio && verseData.audio?.default && (
              <div className="">
                <button className="flex justify-center items-center">
                  <Speaker classes="w-5 h-5 fill-green-500 stroke-green-500" />
                </button>
              </div>
            )}
          </div>
        </div>
        {/* toolbar */}
        {selectedVerse === verseData.verseNumber && (
          <AudioToolBar
            audioData={verseData?.audio}
            selectedVerse={selectedVerse}
          />
        )}
      </div>
    </div>
  );
}

export default VerseView;
