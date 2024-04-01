/**
 *
 * @param durationInSeconds number  - number of seconds
 * @param outputOb boolean - whethere the output need to be a formated string like M:S:milli / object
 * @returns
 */
export function formatAudioDuration(
  durationInSeconds: number,
  outputOb = false,
) {
  // Calculate minutes, seconds, and milliseconds
  const minutes = Math.floor(durationInSeconds / 60);
  const seconds = Math.floor(durationInSeconds % 60);
  const milliseconds = Math.floor(
    (durationInSeconds - Math.floor(durationInSeconds)) * 100,
  );

  // Convert single digit values to double digit strings
  const minutesStr = (minutes < 10 ? '0' : '') + minutes;
  const secondsStr = (seconds < 10 ? '0' : '') + seconds;
  const millisecondsStr = (milliseconds < 10 ? '0' : '') + milliseconds;

  // Return formatted duration
  if (outputOb) {
    return { minute: minutesStr, seconds: secondsStr, milli: millisecondsStr };
  }
  return minutesStr + ':' + secondsStr + ':' + millisecondsStr;
}
