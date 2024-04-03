import React from 'react';

interface ITakeBtn {
  placeholder: string;
  text: string;
  onClick: (
    e: React.MouseEvent<HTMLElement>,
    take: string,
    doubleClk: boolean,
  ) => void;
}

function TakeBtn({ placeholder, text, onClick }: ITakeBtn) {
  return (
    <button
      className="cursor-pointer flex justify-center items-center border border-white rounded-full px-1 hover:border-green-500 text-xs"
      onClick={(e) => onClick(e, text, false)}
      onDoubleClick={(e) => onClick(e, text, true)}
      title={placeholder}
    >
      {text}
    </button>
  );
}

export default TakeBtn;
