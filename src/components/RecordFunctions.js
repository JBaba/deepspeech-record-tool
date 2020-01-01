export function replaceAudio(src) {
  console.log("src:");
  console.log(src);
  var audio = document.querySelector("audio");
  var newAudio = document.createElement("audio");
  newAudio.controls = true;
  newAudio.autoplay = true;
  if (src) {
    newAudio.src = src;
  }

  var parentNode = audio.parentNode;
  parentNode.innerHTML = "";
  parentNode.appendChild(newAudio);
  audio = newAudio;
}

export function stopRecordingCallback(recorder, isSafari) {
  var audio = document.querySelector("audio");
  replaceAudio(URL.createObjectURL(recorder.getBlob()));
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
  if (isSafari) {
    // click(btnReleaseMicrophone);
  }
}

// function click(el) {
//   el.disabled = false; // make sure that element is not disabled
//   var evt = document.createEvent("Event");
//   evt.initEvent("click", true, true);
//   el.dispatchEvent(evt);
// }

export function getRandomString() {
  if (
    window.crypto &&
    window.crypto.getRandomValues &&
    navigator.userAgent.indexOf("Safari") === -1
  ) {
    var a = window.crypto.getRandomValues(new Uint32Array(3)),
      token = "";
    for (var i = 0, l = a.length; i < l; i++) {
      token += a[i].toString(36);
    }
    return token;
  } else {
    return (Math.random() * new Date().getTime())
      .toString(36)
      .replace(/\./g, "");
  }
}
export function getFileName(fileExtension) {
  var d = new Date();
  var year = d.getFullYear();
  var month = d.getMonth();
  var date = d.getDate();
  return (
    "RecordRTC-" +
    year +
    month +
    date +
    "-" +
    getRandomString() +
    "." +
    fileExtension
  );
}
export function SaveToDisk(fileURL, fileName) {
  // for non-IE
  if (!window.ActiveXObject) {
    var save = document.createElement("a");
    save.href = fileURL;
    save.download = fileName || "unknown";
    save.style = "display:none;opacity:0;color:transparent;";
    (document.body || document.documentElement).appendChild(save);
    if (typeof save.click === "function") {
      save.click();
    } else {
      save.target = "_blank";
      var event = document.createEvent("Event");
      event.initEvent("click", true, true);
      save.dispatchEvent(event);
    }
    (window.URL || window.webkitURL).revokeObjectURL(save.href);
  }
  // for IE
  else if (!!window.ActiveXObject && document.execCommand) {
    var _window = window.open(fileURL, "_blank");
    _window.document.close();
    _window.document.execCommand("SaveAs", true, fileName || fileURL);
    _window.close();
  }
}
