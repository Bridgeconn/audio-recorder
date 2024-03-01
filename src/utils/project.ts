import { LanguageMetadataType } from "../types/language";
import { AudioProjectCreationDetails } from "../types/project";
import * as vscode from "vscode";
import { LanguageCodes } from "./languageCodes";
import packageInfo from "../../package.json";
import { v5 as uuidv5 } from "uuid";
import { environment } from "../environment";
import moment from "moment";
import { schemes } from "./versification";

import * as path from "path";

/**
 * Function use vscode native input collection and get project details
 */
export async function promptAndCollectProjectDetails(): Promise<
  AudioProjectCreationDetails | undefined
> {
  console.log("inside prompting ========= ");

  // do not modify this value
  const projectFlavour: string = "audioTranslation";

  // project name prompt
  const projectName = await vscode.window.showInputBox({
    prompt: "Enter the Audio project name",
  });
  if (!projectName) return;

  // username prompt
  const userName = await vscode.window.showInputBox({
    prompt: "Enter your username",
  });
  if (!userName) return;

  // auto abbrevation
  const suggestedAbbr = projectName
    .split(/\s+/)
    .reduce((initial, word) => initial + word[0], "");

  let abbreviation = await vscode.window.showInputBox({
    prompt:
      "Enter the project abbreviation. Leave as blank will take the suggession.",
    placeHolder: `Suggession is : ${suggestedAbbr}`,
  });

  if (!abbreviation) {
    abbreviation = suggestedAbbr;
  }

  // source language quick picker ui (vs native)
  const languages = LanguageCodes;
  const sourceLanguagePicker = await vscode.window.showQuickPick(
    languages.map(
      (lang: LanguageMetadataType) => `${lang.refName} (${lang.tag})`
    ),
    {
      placeHolder: "Select the source language",
    }
  );
  if (!sourceLanguagePicker) return;

  const sourceLanguage = languages.find(
    (lang: LanguageMetadataType) =>
      `${lang.refName} (${lang.tag})` === sourceLanguagePicker
  );
  if (!sourceLanguage) return;

  // Target language quick picker ui (vs native)
  const targetLanguagePicker = await vscode.window.showQuickPick(
    languages.map(
      (lang: LanguageMetadataType) => `${lang.refName} (${lang.tag})`
    ),
    {
      placeHolder: "Select the source language",
    }
  );
  if (!targetLanguagePicker) return;

  const targetLanguage = languages.find(
    (lang: LanguageMetadataType) =>
      `${lang.refName} (${lang.tag})` === targetLanguagePicker
  );
  if (!targetLanguage) return;

  // versification picker
  const versificationPicker = await vscode.window.showQuickPick(
    schemes.map(({ name }) => name),
    {
      placeHolder: "Select one versification Scheme",
    }
  );

  if (!versificationPicker) return;

  const versification = schemes.find(
    ({ name }) => name === versificationPicker
  );
  if (!targetLanguage) return;

  return {
    projectName,
    projectFlavour,
    userName,
    abbreviation,
    sourceLanguage,
    targetLanguage,
    versification,
  };
}

/**
 *
 * Function to generate scope
 */
async function generateProjectScope(): Promise<{ [key: string]: any[] }> {
  // TODO : Currently allow all books in scope
  const currentScope = {
    GEN : [],
    EXO : [],
    LEV : []
  };

  return currentScope;
}

// function to generate scribe Id uuid
async function generateScribeId(username: string, projectName: string) {
  const key = username + projectName + moment().format();
  const id = uuidv5(key, environment.UUIDTOKEN);
  return id;
}

/**
 * Function to create a new Audio project based on Scripture Burrito Standard
 * backward compatability with Scribe V1 standard
 * metadata should be compatable with V1 to ensure V1 project support here also
 */
export async function createNewAudioProject(
  proejctInputs: AudioProjectCreationDetails
): Promise<Object | undefined> {
  const {
    projectName,
    userName,
    abbreviation,
    sourceLanguage,
    targetLanguage,
    versification,
  } = proejctInputs;

  // generate a project id
  const scribeId = await generateScribeId(projectName, userName);

  // generate project scope
  // TODO : Add provision later to select scopes
  const currentScope = await generateProjectScope();

  console.log("in create audio project ==========>", scribeId, currentScope);

  const newProjectMeta: object = {
    format: "scripture burrito",
    projectName: projectName,
    meta: {
      version: "1.0.0",
      category: "source",
      generator: {
        softwareName: "Scribe Audio Extension",
        softwareVersion: packageInfo.version,
        userName: userName,
      },
      defaultLocale: "en",
      dateCreated: new Date().toDateString(),
      // normalization: "NFC",
      comments: [""],
    },
    idAuthorities: {
      scribe: {
        id: "http://www.scribe.bible",
        name: { en: "Scribe Audio Extension" },
      },
    },
    identification: {
      primary: {
        scribe: {
          [scribeId]: {
            revision: "1",
            timestamp: moment().format(),
          },
        },
      },
      name: { en: projectName },
      description: { en: "" },
      abbreviation: { en: abbreviation },
    },
    languages: [
      {
        tag: targetLanguage.tag,
        name: targetLanguage.refName,
        // TODO : need to add script direction in languagecode.ts
        scriptDirection: "ltr",
        type: "target",
      },
      {
        tag: sourceLanguage.tag,
        name: sourceLanguage.refName,
        // TODO : need to add script direction in languagecode.ts
        scriptDirection: "ltr",
        type: "source",
      },
    ],
    type: {
      flavorType: {
        name: "scripture",
        flavor: {
          name: "audioTranslation",
          performance: ["singleVoice", "drama"],
          // TODO : Need to update the type based on production audio
          formats: {
            format1: {
              compression: "wav",
              trackConfiguration: "1/0 (Mono)",
              bitRate: 64000,
              bitDepth: 16,
              samplingRate: 22050,
            },
          },
        },
        currentScope: currentScope,
      },
    },
    confidential: false,
    agencies: [],
    targetAreas: [],
    // TODO : Need to confirm this localised name data
    localizedNames: {},
    ingredients: {},
    // Todo : License also need to confirm
    copyright: {
      shortStatements: [],
    },
  };

  const workspaceFolder = vscode.workspace.workspaceFolders
    ? vscode.workspace.workspaceFolders[0].uri.fsPath
    : undefined;

  if (!workspaceFolder) {
    vscode.window.showErrorMessage("No workspace folder found.");
    return;
  }

  const WORKSPACE_FOLDER =
    vscode?.workspace?.workspaceFolders &&
    vscode?.workspace?.workspaceFolders[0];

  if (!WORKSPACE_FOLDER) {
    vscode.window.showErrorMessage("No workspace folder found.");
    return;
  }

  const projectMetadataPath = vscode.Uri.joinPath(
    WORKSPACE_FOLDER.uri,
    "metadata.json"
  );
  const audioContentDirPath = vscode.Uri.joinPath(
    WORKSPACE_FOLDER.uri,
    "audio",
    "ingredients"
  );
  const projectFileData = Buffer.from(
    JSON.stringify(newProjectMeta, null, 4),
    "utf8"
  );

  // do not create if no versification
  if (!versification?.file) return;

  console.log(
    "lib path : --------> ",
    vscode.Uri.file(`../lib/versifications/${versification.file}`),
    vscode.extensions.getExtension("scribe.scribe-audio")?.extensionPath
  );

  const extensionPath = vscode.extensions.getExtension(
    `${packageInfo.publisher}.${packageInfo.name}`
  )?.extensionPath as string;
  const versificationPath = path.join(
    extensionPath,
    "src",
    "lib",
    "versifications",
    versification.file
  );

  // write files - metadata , folders , versification
  vscode.workspace.fs.writeFile(projectMetadataPath, projectFileData).then(() =>
    vscode.workspace.fs.createDirectory(audioContentDirPath).then(() => {
      // if dir created successfully, move versification json to project dir
      // TODO : Need to add a check some in meta later
      vscode.workspace.fs
        .copy(
          vscode.Uri.file(versificationPath),
          vscode.Uri.joinPath(audioContentDirPath, "versification.json")
        )
        .then(() => {
          vscode.window.showInformationMessage(
            `Project created at ${WORKSPACE_FOLDER.uri}`
          );
        });
    })
  );

  return newProjectMeta;
}
