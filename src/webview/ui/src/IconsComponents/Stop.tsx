import React from 'react';

interface IStopProps {
  classes: string;
}

const Stop: React.FC<IStopProps> = ({ classes }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      id="stop"
      className={classes}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 6H18V18H6V6Z"
        stroke="current"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default Stop;
