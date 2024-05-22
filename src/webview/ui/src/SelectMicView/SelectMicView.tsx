import {
  VSCodeButton,
  VSCodeDropdown,
  VSCodeOption,
} from '@vscode/webview-ui-toolkit/react';
import React, { useEffect, useState } from 'react';
import {
  NavWebToExtMsgTypes,
  ExttoNavWebMsgTypes,
} from '../../../../types/navigationView';
import { vscode } from '../provider/vscodewebprovider';

function App() {
  const [devices, setDevices] = useState(['mic', 'blue', 'red', 'audio']);
  const [mic, setMic] = useState('');
  const [trigger, setTrigger] = useState(true);
  const [platform, setPlatform] = useState();

  useEffect(() => {
    if (platform !== 'linux' && mic) {
      vscode.postMessage({
        type: NavWebToExtMsgTypes.selectedMic,
        data: mic,
      });
    }
  }, [mic, platform]);

  useEffect(() => {
    console.log('triggers');

    // listen for vscode.postmessage event from extension to webview here
    // if (devices.length === 0) {
    // postMessage(NavWebToExtMsgTypes.FetchVersification, '');
    vscode.postMessage({
      type: NavWebToExtMsgTypes.getDevices,
      data: null,
    });
    // }

    const handleExtensionPostMessages = (event: MessageEvent) => {
      const { type, data } = event.data;
      switch (type) {
        case ExttoNavWebMsgTypes.MicData: {
          console.log('front end', data);

          // processed vesification data from workspace dir
          setDevices(data.devices);
          setPlatform(data.platform);
          break;
        }

        default:
          break;
      }
    };

    // add listener for the event
    window.addEventListener('message', handleExtensionPostMessages);

    return () => {
      // clean up event listener
      window.removeEventListener('message', handleExtensionPostMessages);
    };
  }, [trigger]);

  const handleChapterSelect = (bookId: string, chapter: number) => {
    // postMessage(NavWebToExtMsgTypes.BCSelection, { bookId, chapter });
    vscode.postMessage({
      type: NavWebToExtMsgTypes.getDevices,
      data: { bookId, chapter },
    });
  };

  return (
    <div className="">
      <div className="flex justify-between w-full">
        Filter Resources
        <VSCodeDropdown className="w-1/2">
          {devices.map((device) => (
            <VSCodeOption onClick={() => setMic(device)}>{device}</VSCodeOption>
          ))}
        </VSCodeDropdown>
      </div>
      <VSCodeButton onClick={() => setTrigger(!trigger)}>Refresh</VSCodeButton>
    </div>
  );
}

export default App;
