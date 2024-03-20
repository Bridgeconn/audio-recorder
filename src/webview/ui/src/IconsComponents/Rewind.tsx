import React from 'react';

interface IRewindProps {
  classes: string;
}

const Rewind: React.FC<IRewindProps> = ({ classes }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      id="refresh"
      className={classes}
    >
      <path d="M9,9H4A1,1,0,0,1,3,8V3A1,1,0,0,1,5,3V7H9A1,1,0,0,1,9,9Z"></path>
      <path d="M12,22A10,10,0,0,1,2,12a1,1,0,0,1,2,0,8,8,0,1,0,.89-3.67,1,1,0,0,1-1.78-.92A10,10,0,1,1,12,22Z"></path>
    </svg>
  );
};

export default Rewind;
