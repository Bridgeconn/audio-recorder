// @ts-nocheck
const { spawn } = require('child_process');
export async function audioInputDevices() {
    console.log("Inside devices 2");

    let ffmpegDevices = spawn("ffmpeg", ["-list_devices", "true", "-f", "dshow", "-i", "dummy"]);
    console.log(ffmpegDevices);
    console.log("after devices");

    let result = "";

    ffmpegDevices.stdout.on("data", data => {
        console.log("out data ", data.toString());

        result += data.toString();
    });

    ffmpegDevices.stderr.on("data", data => {
        console.log("err data ", data.toString());

        result += data.toString();
    });
    console.log("result ", result);

    ffmpegDevices.on("close", code => {
        console.log("inside close", result);

        //parse the response
        let devices = "";
        try {

            let resultAudio = result.split("dshow");

            console.log("step 1", resultAudio, resultAudio.length);

            //Now audio devices
            // resultAudio = resultAudio.split('\n');
            resultAudio.shift();
            resultAudio.pop()
            console.log("step 2", resultAudio, resultAudio.length);

            let deviceLines = [];
            resultAudio.forEach((line, index) => {
                if (index % 2 == 0) deviceLines.push(line);
            });
            console.log("step 3", deviceLines);

            const audioDevices = deviceLines.filter((item) => item.includes('(audio)'));
            console.log("audio devices", audioDevices);
            let finalDevices = []
            audioDevices.forEach((line, index) => {
                const myRegexp = new RegExp("\"(.*)\"","gm")
                let result = myRegexp.exec(line)
                finalDevices.push(result[1])
                console.log("result audio", result[1]);
            },
            );
            console.log("finalDevices", finalDevices);
            console.log(finalDevices[0]);


        } catch (err) {
            console.log("error------>", err);

        }
        console.log("devices--->", devices)
        return devices;
    });
}