import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";
import { useEffect } from "react";

const vscode = acquireVsCodeApi();

function App() {
  useEffect(() => {
    // listen for vscode.postmessage event from extension to webview here
    const handleExtensionPostMessages = (event: MessageEvent) => {
      console.log("listened event in Nav UI  : ", event);
      // add switch case to handle message types
    };

    // add listener for the event
    window.addEventListener("message", handleExtensionPostMessages);

    return () => {
      // clean up event listener
      window.removeEventListener("message", handleExtensionPostMessages);
    };
  }, []);

  // function handle post message
  const postMessage = (type: string, data: unknown) => {
    if (type && data) {
      vscode.postMessage({
        type: type,
        data: data,
      });
    }
  };

  return (
    <div className="text-green-500">
      <p>Navigation</p>
      <VSCodeButton onClick={() => postMessage("test-nav-btn", "Test string")}>
        Click Me Test button
      </VSCodeButton>
    </div>
  );
}

export default App;
