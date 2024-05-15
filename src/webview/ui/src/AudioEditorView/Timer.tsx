import { useEffect, useState } from 'react';

function Timer({ isRunning }: { isRunning: boolean }) {
  const [time, setTime] = useState(0);
  useEffect(() => {
    let intervalId: ReturnType<typeof setTimeout>;
    if (isRunning) {
      // setting time from 0 to 1 every 10 milisecond using javascript setInterval method
      intervalId = setInterval(() => setTime(time + 1), 10);
    }
    return () => clearInterval(intervalId);
  }, [isRunning, time]);
  // playTime is the total time of audio & time is recording time
  // Minutes calculation
  const minutes = Math.floor((time % 360000) / 6000);

  // Seconds calculation
  const seconds = Math.floor((time % 6000) / 100);

  // Milliseconds calculation
  const milliseconds = time % 100;
  return (
    <div className="flex items-center justify-end w-full gap-3">
      <div>
        {minutes.toString().padStart(2, '0')}:
        {seconds.toString().padStart(2, '0')}:
        {milliseconds.toString().padStart(2, '0')}
      </div>
    </div>
  );
}

export default Timer;
