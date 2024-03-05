import React from "react";

interface IStopProps {
  classes: string;
}

const Stop: React.FC<IStopProps> = ({ classes }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      data-name="Layer 1"
      viewBox="0 0 24 24"
      id="stop"
      className={classes}
    >
      <path d="m12,2.25C6.62,2.25,2.25,6.62,2.25,12s4.37,9.75,9.75,9.75,9.75-4.37,9.75-9.75S17.38,2.25,12,2.25Zm0,18c-4.55,0-8.25-3.7-8.25-8.25S7.45,3.75,12,3.75s8.25,3.7,8.25,8.25-3.7,8.25-8.25,8.25Z"></path>
      <path d="m14,8.25h-4c-.96,0-1.75.79-1.75,1.75v4c0,.96.79,1.75,1.75,1.75h4c.96,0,1.75-.79,1.75-1.75v-4c0-.96-.79-1.75-1.75-1.75Zm.25,5.75c0,.14-.11.25-.25.25h-4c-.14,0-.25-.11-.25-.25v-4c0-.14.11-.25.25-.25h4c.14,0,.25.11.25.25v4Z"></path>
    </svg>
  );
};

export default Stop;
