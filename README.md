<h1 align="center">Scribe Audio Extension 🎙</h1>

---

`Scribe Audio Extension` is to provide audio recording features in [Visual Studio Code](https://code.visualstudio.com/) and in [OpenVSX market place](https://open-vsx.org/). This extension allows users to record audio straight from the editor for translation purposes. This extension can create audio projects of [Scripture Burrito](https://docs.burrito.bible/en/latest/) standard.

![img](doc/AudioRecExtn.png)

### Main Features

---

- Audio recording by using system microphone 🎙
- Simple controls to
  - Record 🎤
  - Play ▶
  - Stop ⏹
  - Pause ⏸
  - Rewind ↺
  - Delete 🗑
  - Takes 
- Verse Level Export
- Full Project Export
- Record audio with multiple takes
- Import [USFM](https://ubsicap.github.io/usfm/) support
- [Scripture Burrito Standard](https://docs.burrito.bible/en/latest/)
- User Friendly Interface
- Ready to use for OBT

### System Prerequisites

---

- Node.js >= 18.17.0
- Visual Studio Code
- FFMPEG

  - Install ffmpeg using the below commands:-

    ```
    // For Ubuntu

    sudo apt install ffmpeg
    ```

    Windows and Mac

    - Check for Documentation
    - [FFMPEG official docs](https://www.ffmpeg.org/download.html)

### How to Contribute (We follow Fork and merge flow)

---

1. Fork this repository
2. Install dependencies with `yarn install`
3. Install dependencies with `yarn install` for webview (inside `cd src/webview/ui/`)
4. For building webview UI `yarn run build:all` or developing webview UI `yarn run watch`
5. `F5` or `debug` for running vscode host development window

### Future Enhancemnets

---

1. Export Feature
   - Chapter Level Export (with Timestamp csv / tsv)
   - Multi format export
2. Audio Conversion
3. Audio Split and Merge
4. Hot Keys Support
5. Auto Transcription

## Contributors

[//]: contributor-faces

<a href="https://github.com/vipinpaul"><img src="https://avatars.githubusercontent.com/u/37212471?s=48&v=4" title="Vipin Paul" width="50" height="50"></a>
<a href="https://github.com/sijumoncy"><img src="https://avatars.githubusercontent.com/u/72241997?s=64&v=4" title="Siju Moncy" width="50" height="50"></a>
<a href="https://github.com/Beenamol"><img src="https://avatars.githubusercontent.com/u/86401125?s=64&v=4" title="Beena Ashish" width="50" height="50"></a>
<a href="https://github.com/svishnu06"><img src="https://avatars.githubusercontent.com/u/24819164?v=4" title="Vishnu" width="50" height="50"></a>

**Enjoy!**
