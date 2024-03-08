import * as vscode from "vscode";
import { getWorkSpaceFolder } from "./common";
import * as path from "path";
import * as fs from "fs";

type IExportType = "verse" | "chapter" | "full";

interface IExportAudio {
  type: IExportType;
}

// function to prompt select dir
async function selectDirectory() {
  try {
    const options = {
      canSelectFolders: true,
      canSelectFiles: false,
      openLabel: "Select Export Directory",
    };

    const result = await vscode.window.showOpenDialog(options);

    if (result && result.length > 0) {
      const selectedDir = result[0].fsPath;
      return selectedDir;
    } else {
      return;
    }
  } catch (error) {
    console.error("Error selecting directory:", error);
    return;
  }
}

async function exportFilestoTargetPath(
  sourcePath: string,
  exportDirPath: string
) {
  try {
    // read all files from
    const files = await vscode.workspace.fs.readDirectory(
      vscode.Uri.parse(sourcePath)
    );

    for (const file of files) {
      const currentSource = path.join(sourcePath, file[0]);
      const currentDestination = path.join(exportDirPath, file[0]);

      //  === 2 is directory
      if (file[1] === 2) {
        // dir create dir in target path
        if (!fs.existsSync(currentDestination)) {
          await fs.mkdirSync(currentDestination, { recursive: true });
        }
        await exportFilestoTargetPath(currentSource, currentDestination);
      } else if (file[1] === 1) {
        // 1 == file
        // only copy with default at end for audio files
        if (file[0].endsWith(".json")) {
          fs.copyFileSync(currentSource, currentDestination);
        } else {
          // files other than json (expect audio files with .wav)
          const audioRegx = /_\d_default.wav$/;
          // if (file[0].endsWith("_default.wav")) {
          if (audioRegx.test(file[0])) {
            fs.copyFileSync(
              currentSource,
              currentDestination.replace(audioRegx, ".wav")
            );
          }
        }
      } else {
        throw new Error(`Error read file/dir ${file}`);
      }
    }
  } catch (err) {
    throw new Error(`Something went wrong : ${err}`);
  }
}

async function processExportingAudio(
  type: IExportType,
  text1Path: string,
  projectTargetPath: string,
  audioPath: string,
  metaDataJson: any,
  _projectName: string
) {
  try {
    // export for verse level default verse
    if (type === "verse") {
      // copy text1 to target
      if (fs.existsSync(text1Path)) {
        await vscode.workspace.fs.copy(
          vscode.Uri.parse(text1Path),
          vscode.Uri.parse(path.join(projectTargetPath, "text-1"))
        );
      } else {
        fs.mkdirSync(projectTargetPath);
      }

      // Copy Audios ingredients
      await exportFilestoTargetPath(
        audioPath,
        path.join(projectTargetPath, "audio", "ingredients")
      );

      // change revision in metadata before save
      console.log({ metaDataJson });

      const id = Object.keys(metaDataJson.identification.primary.scribe)[0];
      metaDataJson.identification.primary.scribe[id].revision = (
        parseInt(metaDataJson.identification.primary.scribe[id].revision) + 1
      ).toString();

      // update meta and write to target
      fs.writeFileSync(
        path.join(projectTargetPath, "metadata.json"),
        JSON.stringify(metaDataJson)
      );

      vscode.window.showInformationMessage(
        `Project ${_projectName} Exported Succesfully`
      );
    } else {
      console.log("Type not supported yet");
    }
  } catch (err) {
    // for any error if the target path exist delete it and throw failed export messge
    console.log("err xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx: ", err);

    if (projectTargetPath && fs.existsSync(projectTargetPath)) {
      await vscode.workspace.fs.delete(vscode.Uri.parse(projectTargetPath), {
        recursive: true,
      });
    }
    vscode.window.showErrorMessage(
      "Project Export Failed. Please check the folder have same content."
    );
  }
}

/**
 * function to export Audio
 * Common Function handle export based on type value
 */

export async function exportAudio({ type }: IExportAudio) {
  let projectTargetPath: string | null = null;

  // check for project workspace
  const workspaceFolder = await getWorkSpaceFolder();
  if (!workspaceFolder) {
    vscode.window.showErrorMessage(
      "Workspace not found. please check your Audio Proejct is opened"
    );
    return;
  }

  // Paths
  const metaPath = path.join(workspaceFolder, "metadata.json");
  const audioPath = path.join(workspaceFolder, "audio", "ingredients");
  const text1Path = path.join(workspaceFolder, "text-1");

  // check metadata
  const isMetaExist = await vscode.workspace.fs
    .stat(vscode.Uri.parse(metaPath))
    .then(
      () => true,
      () => false
    );

  if (!isMetaExist) {
    vscode.window.showErrorMessage(
      "Metadata not found in the project. Can not perform export. Please check the project."
    );
    return;
  }

  // read meta
  const metadataFile = await vscode.workspace.fs.readFile(
    vscode.Uri.parse(metaPath)
  );
  if (!metadataFile) {
    return vscode.window.showErrorMessage("Can not read Metadata");
  }
  const metaDataJson = JSON.parse(metadataFile.toString());

  const _projectName = metaDataJson.identification.name.en;

  // prompt to select Dir to export
  const exportDirPath = await selectDirectory();

  if (!exportDirPath) {
    vscode.window.showErrorMessage(
      "No Directory Selected. Export Process Cancelled"
    );
    return;
  }

  // create project Dir in target
  projectTargetPath = path.join(exportDirPath, _projectName);

  if (fs.existsSync(projectTargetPath)) {
    await vscode.window
      .showWarningMessage(
        `There is a folder exist with same Project Name : ${_projectName} in the selected Directory. Do you want to overwrite.`,
        { modal: true },
        "Overwrite"
      )
      .then(async (result) => {
        if (result === "Overwrite" && projectTargetPath) {
          // delete existing and proceed
          await vscode.workspace.fs.delete(
            vscode.Uri.parse(projectTargetPath),
            {
              recursive: true,
            }
          );

          await processExportingAudio(
            type,
            text1Path,
            projectTargetPath,
            audioPath,
            metaDataJson,
            _projectName
          );
        } else {
          console.log("cancel action .......................", result);
          vscode.window.showInformationMessage("Project Export Aborted");
          return;
        }
      });
  } else {
    // no duplicate project Dir
    await processExportingAudio(
      type,
      text1Path,
      projectTargetPath,
      audioPath,
      metaDataJson,
      _projectName
    );
  }
}
