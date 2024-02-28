// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { AudioPanel } from "./panels/AudioPanel";
import { getWorkSpaceFolder, openWorkspace } from "./utils/common";
import {
  createNewAudioProject,
  promptAndCollectProjectDetails,
} from "./utils/project";

import * as path from "path";

// get root path of opened workspace in vscode
const ROOT_PATH = getWorkSpaceFolder();

console.log("Root Path =========>", ROOT_PATH);

// prompt for select folder / get metadata from the opened dir
if (!ROOT_PATH) {
  vscode.window
    .showInformationMessage(
      "No Audio Burrito project found. You need to select a Audio Burrito project folder for your new project, or open an existing Audio Burrito project folder.",
      { modal: true },
      "Select a Folder"
    )
    .then(async (result) => {
      if (result === "Select a Folder") {
        const workspaceFolder = await openWorkspace();
        console.log("reached till here --------------", {
          workspaceFolder,
          result,
        });

        vscode.commands.executeCommand("scribe-audio.initNewAudioProject");
      } else {
        vscode.commands.executeCommand("workbench.action.quit");
      }
    });
} else {
  // TODO : FIx this ele part - not redirecting via code
  const metadataPath = path.join(ROOT_PATH, "metadata.json");
  (async () => {
    const metaUrl = await vscode.Uri.file(metadataPath);
    const metaFileStat = await vscode.workspace.fs.stat(metaUrl);
    console.log("in await ===> ", metaUrl, metaFileStat);
    console.log("in else path - where folder is opened ====> ", metadataPath);
    if (!vscode.workspace.fs.stat(vscode.Uri.file(metadataPath))) {
      vscode.commands.executeCommand("scribe-audio.initNewAudioProject");
    } else {
      console.log("Metadata exist in the opened folder ======");
    }
  })();
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // context.subscriptions.push(disposable);
  console.log('Congratulations, your extension "scribe-audio" is now active!');

  const helloCommand = vscode.commands.registerCommand(
    "scribe-audio.scribeaudio",
    () => {
      AudioPanel.render();
    }
  );

  context.subscriptions.push(helloCommand);

  /**
   * Register Project Init Command
   */
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "scribe-audio.initNewAudioProject",
      async () => {
        console.log("Called INIT Project ************** 2");

        // read workspace folder
        const workspaceFolder = vscode.workspace.workspaceFolders
          ? vscode.workspace.workspaceFolders[0]
          : undefined;
        if (!workspaceFolder) {
          const work = await getWorkSpaceFolder();
          console.log(
            "inside no space found meas 00000000000000000000000",
            work
          );

          vscode.window.showErrorMessage(
            "No workspace folder found. Please open a folder.",
            { modal: true }
          );
          return;
        }

        vscode.window.showInformationMessage(
          "Please wait.. Initialising New Audio Project"
        );
        console.log("after please wait ------------------");

        try {
          // function to prompt and collects inputs from user about the projects
          const projectDetails = await promptAndCollectProjectDetails();

          console.log("project details ------>", projectDetails);

          if (projectDetails) {
            const projectFilePath = await vscode.Uri.joinPath(
              workspaceFolder.uri,
              "metadata.json"
            );

            // check fs exist - for file exist check
            const fileExists = await vscode.workspace.fs
              .stat(projectFilePath)
              .then(
                () => true,
                () => false
              );

            console.log("file exist : ==> ", fileExists);

            // if metadata in the opened workspace path
            if (fileExists) {
              // read metadata file
              const metaDataFile = await vscode.workspace.fs.readFile(
                projectFilePath
              );
              const metaData = JSON.parse(metaDataFile.toString());
              // TODO : This can be modified later based on case sensitive
              const _existProjectName = metaData.identification.name.en;

              // prompt confirm for delete / overwrite the existing project in the same path
              const confirmDelete = await vscode.window.showInputBox({
                prompt: `A project named ${_existProjectName} already exists in the workspace. Type the project name to confirm deletion.`,
                placeHolder: "Project name",
              });
              if (confirmDelete !== _existProjectName) {
                vscode.window.showErrorMessage(
                  "Project name does not match. Project Creation Cancelled"
                );
                return;
              }
            }

            // all checks passed - create new project
            // TODO: type of METAData
            const newProjectMeta: any = await createNewAudioProject(
              projectDetails
            );

            console.log("new Projects meta ===>", projectDetails);

            vscode.window.showInformationMessage(
              `New project initialized: ${newProjectMeta?.meta.generator.userName}'s ${newProjectMeta?.identification.name.en}`
            );

            // reload vscode workspace if needed
          }
        } catch (err) {
          vscode.window.showErrorMessage(
            `Failed to initialize Audio project: ${err}`
          );
        }
      }
    )
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}
