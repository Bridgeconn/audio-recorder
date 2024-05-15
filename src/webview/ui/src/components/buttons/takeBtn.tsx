import React from 'react';

interface ITakeBtn {
  placeholder: string;
  text: string;
  value: '1' | '2' | '3';
  defaulted: boolean;
  recorded: boolean;
  selectedTake: string;
  onClick: (
    e: React.MouseEvent<HTMLElement>,
    take: '1' | '2' | '3',
    doubleClk: boolean,
  ) => void;
}

function TakeBtn({
  placeholder,
  text,
  value,
  selectedTake,
  defaulted,
  recorded,
  onClick,
}: ITakeBtn) {
  return (
    <button
      className={`cursor-pointer flex justify-center items-center border rounded-full px-1 hover:border-green-500 text-xs  ${defaulted ? 'bg-green-500' : recorded ? 'bg-blue-500' : ''} ${selectedTake[0] === value ? 'border-yellow-500 border-2' : 'border-white'}`}
      onClick={(e) => onClick(e, value, false)}
      onDoubleClick={(e) => onClick(e, value, true)}
      title={placeholder}
    >
      {text}
    </button>
  );
}

export default TakeBtn;
