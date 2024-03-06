import * as vscode from "vscode";

export async function getAudioBlob(folderPath: vscode.Uri, chapter: number) {
  console.log("folderPath ````````````########## ", folderPath);

  const audioFiles = await vscode.workspace.fs.readDirectory(folderPath);
  console.log("audioFiles", audioFiles);
  const audios: Record<string, any> = {};
  // {
  //   1:{take1:,take2:,take3:,default:}
  //   2:{take1:,take2:,take3:,default:}
  // }
  audioFiles.forEach(async (file) => {
    const fileName = file[0];
    const url = fileName.split(".");
    const verseNum = url[0].split("_");
    console.log(verseNum);
    audios[verseNum[1]] = { ...audios[verseNum[1]] };
    if (verseNum[2]) {
      const take = `take${verseNum[2]}`;
      // setting the audio file path
      audios[verseNum[1]][take] = vscode.Uri.joinPath(folderPath, fileName);
      if (verseNum[3] === "default") {
        audios[verseNum[1]].default = take;
      }
    } else {
      // If found only one audio for the verse then making that audio as default one.
      // replace url with `${chapter}_${verseNum[1]}_1_default.mp3`
      audios[verseNum[1]].take1 = vscode.Uri.joinPath(
        folderPath,
        `${chapter}_${verseNum[1]}_1_default.${url[1]}`
      );
      audios[verseNum[1]].default = "take1";
      // TODO
      // fs.renameSync(path.join(filePath, chapterNum, verse), path.join(filePath, chapterNum, `${chapter}_${verseNum[1]}_1_default.mp3`));
    }
  });
  console.log("audios", audios);
  return audios;
}

export async function processTheChapter(
  book: string,
  chapter: number,
  usfmData: any,
  versifcationData: string[],
  projectDirectory: vscode.Uri
  // convertToAsWebViewUri: (url: vscode.Uri) => Promise<vscode.Uri | undefined>,
) {
  const folder = vscode.Uri.joinPath(
    projectDirectory,
    "audio",
    "ingredients",
    book,
    chapter.toString()
  );
  const audioFileExists = await vscode.workspace.fs.stat(folder).then(
    () => true,
    () => false
  );
  let audioData: Record<string, any> = {};
  if (audioFileExists) {
    audioData = await getAudioBlob(folder, chapter);
  }

  let bookContent = [];
  if (usfmData) {
    const chapterContent = usfmData.find((obj: any) => {
      return parseInt(obj.chapterNumber, 10) === chapter;
    });

    let contents: { verseNumber: number; verseText: string; audio: any }[] = [];
    let verses: { verseNumber: number; verseText: string; audio: any }[] = [];
    for (let v = 1; v <= chapterContent.contents.length; v += 1) {
      if (chapterContent.contents[v]?.verseNumber) {
        verses.push({
          verseNumber: parseInt(chapterContent.contents[v]?.verseNumber, 10),
          verseText: chapterContent.contents[v]?.verseText,
          // audio: '',
          audio: audioFileExists
            ? audioData[parseInt(chapterContent.contents[v]?.verseNumber, 10)]
            : "",
        });
      }
    }
    contents = contents.concat(verses);
    bookContent.push({
      chapterNumber: chapter,
      contents,
    });
  } else {
    let contents: { verseNumber: number; verseText: string; audio: any }[] = [];
    let verses: { verseNumber: number; verseText: string; audio: any }[] = [];
    for (let v = 1; v <= parseInt(versifcationData[chapter - 1], 10); v += 1) {
      verses.push({
        verseNumber: v,
        verseText: "",
        // audio: '',
        audio: audioFileExists ? audioData[v] : "",
      });
    }
    contents = contents.concat(verses);
    bookContent.push({
      chapterNumber: chapter,
      contents,
    });
  }

  return bookContent;
}
