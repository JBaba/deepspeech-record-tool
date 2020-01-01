import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import { replaceAudio, SaveToDisk, getFileName } from "./RecordFunctions";
import RecordRTC from "recordrtc";
import { StereoAudioRecorder } from "recordrtc";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

class MyAppContent extends Component {
  constructor() {
    super();
    this.state = {
      value: "",
      file: null,
      recorder: null,
      microphone: null,
      readFullArticaleValue: "",
      readNextOne: null,
      splitValues: null,
      isRecording: false
    };
    // bind all the events
    this.handleChange = this.handleChange.bind(this);
    this.captureMicrophone = this.captureMicrophone.bind(this);
    this.startButtonClick = this.startButtonClick.bind(this);
    this.stopRecordingBtnClick = this.stopRecordingBtnClick.bind(this);
    this.releaseMicrophoneBtnClick = this.releaseMicrophoneBtnClick.bind(this);
    this.downloadBtnClick = this.downloadBtnClick.bind(this);
    this.onValueChange = this.onValueChange.bind(this);
    this.readNextValue = this.readNextValue.bind(this);
    this.onlySkipNext = this.onlySkipNext.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
    // local variables
    this.isEdge =
      navigator.userAgent.indexOf("Edge") !== -1 &&
      (!!navigator.msSaveOrOpenBlob || !!navigator.msSaveBlob);
    this.isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  }

  // When File is uploaded this event chanes the state and assigns files inside state
  // Then that value is used to upload file
  handleChange(event) {
    this.setState({ value: event.target.value, file: event.target.files[0] });
  }

  async captureMicrophone(callback) {
    // btnReleaseMicrophone.disabled = false;
    if (this.state.microphone) {
      this.setState({ microphone: this.state.microphone });
      // window.startRecordingBtn.click();
      return;
    }
    if (
      typeof navigator.mediaDevices === "undefined" ||
      !navigator.mediaDevices.getUserMedia
    ) {
      alert("This browser does not supports WebRTC getUserMedia API.");
      if (!!navigator.getUserMedia) {
        alert("This browser seems supporting deprecated getUserMedia API.");
      }
    }
    let stream = await navigator.mediaDevices.getUserMedia({
      audio: this.isEdge ? true : { echoCancellation: false }
    });
    this.setState({ microphone: stream });
    window.startRecordingBtn.click();
  }

  startButtonClick(e) {
    var audio = document.querySelector("audio");
    // this.disabled = true;
    // this.style.border = "";
    // this.style.fontSize = "";
    if (!this.state.microphone) {
      this.captureMicrophone();
      return;
    }
    replaceAudio();
    audio.muted = true;
    audio.srcObject = this.state.microphone;
    var options = {
      type: "audio",
      numberOfAudioChannels: this.isEdge ? 1 : 2,
      checkForInactiveTracks: true,
      bufferSize: 16384
    };
    if (this.isSafari || this.isEdge) {
      options.recorderType = StereoAudioRecorder;
    }
    if (
      navigator.platform &&
      navigator.platform
        .toString()
        .toLowerCase()
        .indexOf("win") === -1
    ) {
      options.sampleRate = 48000; // or 44100 or remove this line for default
    }
    if (this.isSafari) {
      options.sampleRate = 44100;
      options.bufferSize = 4096;
      options.numberOfAudioChannels = 2;
    }
    if (this.state.recorder) {
      this.state.recorder.destroy();
      this.setState({ recorder: null });
    }
    console.log("microphone");
    console.log(this.state.microphone);
    console.log("recorder is undefined");
    console.log(this.state.recorder);
    var recordRtc = RecordRTC(this.state.microphone, options);
    console.log(recordRtc);
    this.setState(
      prevState => {
        if (!prevState.recorder) prevState.recorder = recordRtc;
        else prevState.recorder = recordRtc;
        return prevState;
      },
      () => {
        console.log("Now recorder has value");
        console.log(this.state.recorder);
        this.state.recorder.startRecording();
      }
    );
  }

  async stopCallBack() {
    var audio = document.querySelector("audio");
    console.log("Blob:");
    console.log(this.state.recorder.getBlob());
    // replaceAudio(URL.createObjectURL(this.state.recorder.getBlob()));
    // // btnStartRecording.disabled = false;
    // setTimeout(function() {
    //   if (!audio.paused) return;
    //   setTimeout(function() {
    //     if (!audio.paused) return;
    //     audio.play();
    //   }, 1000);

    //   audio.play();
    // }, 300);
    // audio.play();
    // // btnDownloadRecording.disabled = false;
    // if (this.isSafari) {
    //   // click(btnReleaseMicrophone);
    // }
  }

  async stopRecordingBtnClick(e) {
    // this.disabled = true;
    // await this.state.recorder.stopRecording(() => {
    //   var blob = this.state.recorder.getBlob();
    //   console.log("call back blob.");
    //   console.log(blob);
    // });
    // await this.stopCallBack();
    this.state.recorder.stopRecording(() => {
      var audio = document.querySelector("audio");
      console.log("Blob:");
      console.log(this.state.recorder.getBlob());
      replaceAudio(URL.createObjectURL(this.state.recorder.getBlob()));
      // btnStartRecording.disabled = false;
      setTimeout(function() {
        if (!audio.paused) return;
        setTimeout(function() {
          if (!audio.paused) return;
          audio.play();
        }, 1000);

        audio.play();
      }, 300);
      audio.play();
      // btnDownloadRecording.disabled = false;
      if (this.isSafari) {
        // click(btnReleaseMicrophone);
      }
    });
  }

  async releaseMicrophoneBtnClick(e) {
    // this.disabled = true;
    // btnStartRecording.disabled = false;
    if (this.state.microphone) {
      this.state.microphone.stop();
      this.state.microphone = null;
    }
    if (this.state.recorder) {
      // click(btnStopRecording);
    }
  }

  async downloadBtnClick(e) {
    // this.disabled = true;
    if (!this.state.recorder || !this.state.recorder.getBlob()) return;
    if (this.isSafari) {
      this.state.recorder.getDataURL(function(dataURL) {
        SaveToDisk(dataURL, getFileName("mp3"));
      });
      return;
    }
    var blob = this.state.recorder.getBlob();
    var file = new File([blob], getFileName("mp3"), {
      type: "audio/mp3"
    });
    // invokeSaveAsDialog(file);
  }

  uploadFile(e) {
    if (!this.state.recorder || !this.state.recorder.getBlob()) return;
    let form = new FormData();
    var blob = this.state.recorder.getBlob();
    var file = new File([blob], getFileName("wav"), {
      type: "audio/wav"
    });
    form.append("fileBlob", file, "audio.wav");
    form.append("filetext", this.state.readNextOne);

    fetch(`/deepspeech/uploadAudioFile`, {
      method: "POST",
      body: form
    }).then(response => console.log(response.text()));
  }

  async readNextValue(e) {
    this.onlySkipNext(e);
    if (this.state.isRecording) {
      this.stopRecordingBtnClick(null);
      this.uploadFile();
      this.startButtonClick(null);
      // window.startRecordingBtn.click();
    } else {
      this.startButtonClick(null);
      // window.startRecordingBtn.click();
      await this.setState({ isRecording: true });
    }
  }

  async onlySkipNext(e) {
    if (!this.state.splitValues) {
      await this.setState({
        splitValues: this.state.readFullArticaleValue.trim().split(" ")
      });
    }
    var first5words = this.state.splitValues.splice(0, 5);
    console.log(first5words);
    var mergeFirst5words = "";
    var i;
    for (i = 0; i < first5words.length; i++) {
      mergeFirst5words += first5words[i].replace(/,|;|\.|:/g, "");
      mergeFirst5words += " ";
    }
    // replace newlines if present
    mergeFirst5words = mergeFirst5words.replace(/\n/g, " ");
    mergeFirst5words = mergeFirst5words.trim();
    this.setState({ readNextOne: mergeFirst5words });
  }

  onValueChange(e) {
    console.log(e.target.value);
    this.setState({ readFullArticaleValue: e.target.value });
  }

  render() {
    return (
      <div>
        <Grid container spacing={1} m={10}>
          <Grid item xs={12}>
            <Grid container justify="left" spacing={3}>
              <Grid key={0} item>
                <Button
                  // className={classes.root}
                  onClick={this.startButtonClick}
                  id="btn-start-recording-2"
                  ref={input => (window.startRecordingBtn = input)}
                  variant="contained"
                  color="primary"
                >
                  Start Recording
                </Button>
              </Grid>
              <Grid key={0} item>
                <Button
                  // className={classes.root}
                  onClick={this.stopRecordingBtnClick}
                  id="btn-stop-recording-2"
                  ref={input => (window.stopRecordingBtn = input)}
                  variant="contained"
                  color="primary"
                >
                  Stop Recording
                </Button>
              </Grid>
              <Grid key={0} item>
                <Button
                  // className={classes.root}
                  onClick={this.uploadFile}
                  id="btn-upload-recording-2"
                  ref={input => (window.uploadBtn = input)}
                  variant="contained"
                  color="primary"
                >
                  Upload
                </Button>
              </Grid>
              <Grid key={0} item>
                <Button
                  // className={classes.root}
                  onClick={this.releaseMicrophoneBtnClick}
                  id="btn-release-microphone-2"
                  ref={input => (window.releaseMicrophoneBtn = input)}
                  variant="contained"
                  color="primary"
                >
                  Release Microphone
                </Button>
              </Grid>
              <Grid key={0} item>
                <Button
                  // className={classes.root}
                  onClick={this.downloadBtnClick}
                  id="btn-download-recording-2"
                  ref={input => (window.downloadBtn = input)}
                  variant="contained"
                  color="primary"
                >
                  Download
                </Button>
              </Grid>
              <Grid key={0} item>
                <audio controls autoplay playsinline></audio>
              </Grid>
            </Grid>
          </Grid>
          {/* Upload File Section */}
          <Grid item xs={2}>
            <Button
              // className={classes.root}
              onClick={this.readNextValue}
              id="btn-start-recording-2"
              ref={input => (window.readNext = input)}
              variant="contained"
              color="primary"
            >
              Read Next Line
            </Button>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Button
              // className={classes.root}
              onClick={this.onlySkipNext}
              id="go-only-next"
              ref={input => (window.onlySkipNext = input)}
              variant="contained"
              color="primary"
            >
              Only Next
            </Button>
          </Grid>

          <Grid item xs={8}>
            <Grid key={1} item>
              <TextField
                fullWidth
                value={this.state.readNextOne}
                variant="filled"
                id="filled-multiline-flexible"
                // label="Multiline"
                multiline
                rowsMax="4"
                variant="filled"
                inputProps={{
                  style: { fontSize: 25 }
                }}
              />
            </Grid>
          </Grid>
          {/* Read Values From Thease Section */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="filled-multiline-static"
              label="Multiline"
              multiline
              rows="30"
              defaultValue="Default Value"
              variant="filled"
              value={this.state.readFullArticaleValue}
              onChange={this.onValueChange}
              inputProps={{
                style: { fontSize: 27 }
              }}
            />
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default MyAppContent;
