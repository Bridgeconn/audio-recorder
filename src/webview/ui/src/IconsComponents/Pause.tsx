import React from 'react';

interface IPauseProps {
  classes: string;
}

const Pause: React.FC<IPauseProps> = ({ classes }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      id="pause"
      viewBox="0 0 24 24"
      className={classes}
    >
      <path
        fill="current"
        d="M8 5a2 2 0 0 0-2 2v10a2 2 0 1 0 4 0V7a2 2 0 0 0-2-2zm8 0a2 2 0 0 0-2 2v10a2 2 0 1 0 4 0V7a2 2 0 0 0-2-2z"
      ></path>
    </svg>
  );
};

export default Pause;
