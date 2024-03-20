import React from 'react';

interface IPlayProps {
  classes: string;
}

const Play: React.FC<IPlayProps> = ({ classes }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      id="play"
      x="0"
      y="0"
      version="1.1"
      viewBox="0 0 29 29"
      className={classes}
    >
      <path d="M6.568 27.002c-.49 0-.98-.127-1.429-.383a2.857 2.857 0 0 1-1.461-2.512V4.892c0-1.053.546-1.992 1.461-2.512.914-.521 2-.51 2.905.029l16.142 9.608c.883.526 1.411 1.454 1.411 2.483s-.528 1.957-1.411 2.483L8.045 26.591a2.884 2.884 0 0 1-1.477.411zM6.572 4a.922.922 0 0 0-.445.119.873.873 0 0 0-.45.773v19.216c0 .467.314.696.45.773a.873.873 0 0 0 .895-.009l16.141-9.608c.392-.233.435-.612.435-.764s-.042-.531-.435-.764L7.021 4.128A.858.858 0 0 0 6.572 4z"></path>
    </svg>
  );
};

export default Play;
