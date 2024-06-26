import { LanguageMetadataType } from '../types/language';
import { AudioProjectCreationDetails } from '../types/project';
import * as vscode from 'vscode';
import { LanguageCodes } from './languageCodes';
import packageInfo from '../../package.json';
import { v5 as uuidv5 } from 'uuid';
import { environment } from '../environment';
import moment from 'moment';
import { schemes } from './versification';
import { Bible } from '../types/versification';

import * as path from 'path';
import { storageKeys } from '../types/storage';
const md5 = require('md5');
/**
 * Function use vscode native input collection and get project details
 */
export async function promptAndCollectProjectDetails(): Promise<
  AudioProjectCreationDetails | undefined
> {
  // do not modify this value
  const projectFlavour: string = 'audioTranslation';

  // project name prompt
  const projectName = await vscode.window.showInputBox({
    prompt: 'Enter the Audio project name',
  });
  if (!projectName) {
    return;
  }

  // username prompt
  const userName = await vscode.window.showInputBox({
    prompt: 'Enter your username',
  });
  if (!userName) {
    return;
  }

  // auto abbrevation
  const suggestedAbbr = projectName
    .split(/\s+/)
    .reduce((initial, word) => initial + word[0], '');

  let abbreviation = await vscode.window.showInputBox({
    prompt:
      'Enter the project abbreviation. Leave as blank will take the suggession.',
    placeHolder: `Suggession is : ${suggestedAbbr}`,
  });

  if (!abbreviation) {
    abbreviation = suggestedAbbr;
  }

  // Target language quick picker ui (vs native)
  const languages = LanguageCodes;
  const targetLanguagePicker = await vscode.window.showQuickPick(
    languages.map(
      (lang: LanguageMetadataType) => `${lang.refName} (${lang.tag})`,
    ),
    {
      placeHolder: 'Select the target language',
    },
  );
  if (!targetLanguagePicker) {
    return;
  }

  const targetLanguage = languages.find(
    (lang: LanguageMetadataType) =>
      `${lang.refName} (${lang.tag})` === targetLanguagePicker,
  );
  if (!targetLanguage) {
    return;
  }

  // Select the scope
  const currentScope = await vscode.window.showQuickPick(
    ['Full Bible', 'Old Testament', 'New Testament'],
    { placeHolder: 'Select the scope of the project' },
  );

  if (!currentScope) {
    return;
  }

  // versification picker
  const versificationPicker = await vscode.window.showQuickPick(
    schemes.map(({ name }) => name.toUpperCase()),
    {
      placeHolder: 'Select one versification Scheme',
    },
  );

  if (!versificationPicker) {
    return;
  }

  // Select the versification
  const versification = schemes.find(
    ({ name }) => name === versificationPicker.toLowerCase(),
  );
  if (!versification) {
    return;
  }

  return {
    projectName,
    projectFlavour,
    userName,
    abbreviation,
    targetLanguage,
    versification,
    currentScope,
  };
}

/**
 *
 * Function to generate scope
 */
async function generateProjectScope(
  currentScope: string,
): Promise<{ [key: string]: any[] }> {
  // TODO : Currently allow all books in scope
  let selectedScope: { [key: string]: any } = {};
  switch (currentScope) {
    case 'Old Testament': {
      Bible.OT.forEach((book) => {
        selectedScope[book] = [];
      });
      break;
    }
    case 'New Testament': {
      Bible.NT.forEach((book) => {
        selectedScope[book] = [];
      });
      break;
    }
    case 'Full Bible': {
      Bible.OT.forEach((book) => {
        selectedScope[book] = [];
      });
      Bible.NT.forEach((book) => {
        selectedScope[book] = [];
      });
      break;
    }
  }

  return selectedScope;
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
  proejctInputs: AudioProjectCreationDetails,
  context: vscode.ExtensionContext,
): Promise<Object | undefined> {
  const {
    projectName,
    userName,
    abbreviation,
    targetLanguage,
    versification,
    currentScope,
  } = proejctInputs;

  // generate a project id
  const scribeId = await generateScribeId(projectName, userName);

  // generate project scope
  // TODO : Add provision later to select scopes
  const selectedScope = await generateProjectScope(currentScope);

  const newProjectMeta: any = {
    format: 'scripture burrito',
    meta: {
      version: '1.0.0',
      category: 'source',
      generator: {
        softwareName: 'Scribe Audio Extension',
        softwareVersion: packageInfo.version,
        userName: userName,
      },
      defaultLocale: 'en',
      dateCreated: new Date().toDateString(),
      comments: [''],
    },
    idAuthorities: {
      scribe: {
        id: 'http://www.scribe.bible',
        name: { en: 'Scribe Audio Extension' },
      },
    },
    identification: {
      primary: {
        scribe: {
          [scribeId]: {
            revision: '1',
            timestamp: moment().format(),
          },
        },
      },
      name: { en: projectName },
      description: { en: '' },
      abbreviation: { en: abbreviation },
    },
    languages: [
      {
        tag: targetLanguage.tag,
        name: targetLanguage.refName,
        scriptDirection: targetLanguage.direction,
      },
    ],
    type: {
      flavorType: {
        name: 'scripture',
        flavor: {
          name: 'audioTranslation',
          performance: ['singleVoice', 'reading'],
          formats: {
            format1: {
              compression: 'wav',
              trackConfiguration: '1/0 (Mono)',
              bitRate: 1152,
              bitDepth: 24,
              samplingRate: 48000,
            },
          },
        },
        currentScope: selectedScope,
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
    vscode.window.showErrorMessage('No workspace folder found.');
    return;
  }

  const WORKSPACE_FOLDER =
    vscode?.workspace?.workspaceFolders &&
    vscode?.workspace?.workspaceFolders[0];

  if (!WORKSPACE_FOLDER) {
    vscode.window.showErrorMessage('No workspace folder found.');
    return;
  }

  const projectMetadataPath = vscode.Uri.joinPath(
    WORKSPACE_FOLDER.uri,
    projectName,
    'metadata.json',
  );
  const audioContentDirPath = vscode.Uri.joinPath(
    WORKSPACE_FOLDER.uri,
    projectName,
    'audio',
    'ingredients',
  );
  const projectFileData = Buffer.from(
    JSON.stringify(newProjectMeta, null, 4),
    'utf8',
  );

  // do not create if no versification
  if (!versification?.file) {
    return;
  }

  const extensionPath = vscode.extensions.getExtension(
    `${packageInfo.publisher}.${packageInfo.name}`,
  )?.extensionPath as string;
  const versificationPath = path.join(
    extensionPath,
    'src',
    'lib',
    'versifications',
    versification.file,
  );

  // write files - metadata , folders , versification
  vscode.workspace.fs.writeFile(projectMetadataPath, projectFileData).then(() =>
    vscode.workspace.fs.createDirectory(audioContentDirPath).then(() => {
      // if dir created successfully, move versification json to project dir
      // TODO : Need to add a check some in meta later
      vscode.workspace.fs
        .copy(
          vscode.Uri.file(versificationPath),
          vscode.Uri.joinPath(audioContentDirPath, 'versification.json'),
        )
        .then(async () => {
          // Adding the versification in metadata
          const file = await vscode.workspace.fs.readFile(
            vscode.Uri.joinPath(audioContentDirPath, 'versification.json'),
          );

          const isFileExist = await vscode.workspace.fs
            .stat(
              vscode.Uri.joinPath(audioContentDirPath, 'versification.json'),
            )
            .then(
              (value) => value,
              () => false,
            );

          newProjectMeta.ingredients[
            path.join('audio', 'ingredients', 'versification.json')
          ] = {
            checksum: { md5: md5(file) },
            mimeType: 'application/json',
            size:
              isFileExist && typeof isFileExist !== 'boolean'
                ? isFileExist?.size
                : 0,
            role: 'x-versification',
          };

          const newProjectFileData = Buffer.from(
            JSON.stringify(newProjectMeta, null, 4),
            'utf8',
          );

          vscode.workspace.fs.writeFile(
            projectMetadataPath,
            newProjectFileData,
          );

          vscode.window.showInformationMessage(
            `Project created at ${WORKSPACE_FOLDER.uri}`,
          );
          // Storing theworkspace path globally
          context.workspaceState.update(
            storageKeys.workspaceDirectory,
            vscode.Uri.joinPath(WORKSPACE_FOLDER.uri, projectName),
          );

          // reload vscode workspace with new project path
          await vscode.commands.executeCommand(
            'vscode.openFolder',
            vscode.Uri.joinPath(WORKSPACE_FOLDER.uri, projectName),
            false,
          );
        });
    }),
  );

  return newProjectMeta;
}
