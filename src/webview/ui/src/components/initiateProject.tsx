import { VSCodeButton } from '@vscode/webview-ui-toolkit/react';
import { vscode } from '../provider/vscodewebprovider';
import { NavWebToExtMsgTypes } from '../../../../types/navigationView';

function InitiateProject() {
  const handleProjectbuttons = (type: 'create' | 'open') => {
    vscode.postMessage({
      type:
        type === 'create'
          ? NavWebToExtMsgTypes.createProject
          : NavWebToExtMsgTypes.openProject,
      data: null,
    });
  };

  return (
    <div className="p-2 w-full">
      <p>
        Welcome to the Scribe Audio Recorder! Please setup a new Audio project
        or open an existing project.
      </p>
      <div className="grid grid-cols-1 gap-5 my-5">
        <VSCodeButton
          className=""
          onClick={() => handleProjectbuttons('create')}
        >
          Create Audio Project
        </VSCodeButton>
        <VSCodeButton className="" onClick={() => handleProjectbuttons('open')}>
          Open Existing Project
        </VSCodeButton>
      </div>
    </div>
  );
}

export default InitiateProject;
