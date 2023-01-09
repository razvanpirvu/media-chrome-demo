// import shaka from "./shaka-player.compiled";
const shaka = require("./shaka-player.compiled");
import defineBtn from "./bitrate-button";
import AzureVideoPlayer from "./azure-video-player";
import reactTest from "./Test.jsx"

import MediaController  from "media-chrome/dist/media-controller";

import volumeReact from "./volume";
import playReact from "./PlayPause";
// function defineCustomElement(name: any, element: any) {
//   if (!window.customElements.get(name)) {
//     window.customElements.define(name, element);
//     window[element.name] = element;
//   }
// }
// defineCustomElement("react-test", MediaBitrateButton);

const manifestUri =
  // "https://rpirvu-usea.streaming.media.azure.net/b37ad24a-42d0-4911-bf04-48d44acd2f81/Big_Buck_Bunny_1080_10s_1MB.ism/manifest(format=m3u8-cmaf)";
  // "https://lldemo-usw22.streaming.media.azure.net/90906a93-8259-465c-a5aa-b4e28f848282/7abe20b2-bd1e-47f7-a796-4c09cb8d898d.ism/Manifest(video,format=m3u8-cmaf).m3u8"
  "https://dash.akamaized.net/akamai/test/caption_test/ElephantsDream/elephants_dream_480p_heaac5_1_https.mpd";
// "https://testendpoint-pamishtestupload-usea.streaming.media.azure.net/a1872fab-df71-480f-90ce-0535f860a304/ef5b884b-d144-4cfe-9787-c5339093d0be.ism/manifest(format=mpd-time-cmaf,encryption=cenc)";

let player: shaka.Player;

function initApp() {
  // Install built-in polyfills to patch browser incompatibilities.
  shaka.polyfill.installAll();

  // Check to see if the browser supports the basic APIs Shaka needs.
  if (shaka.Player.isBrowserSupported()) {
    // Everything looks good!
    initPlayer();
  } else {
    // This browser does not have the minimum set of APIs we need.
    console.error("Browser not supported!");
  }

  defineBtn();
  const azurePlayer: any = new AzureVideoPlayer();
  azurePlayer.addControls();
  reactTest();
  volumeReact();
  playReact();
}

function _getVideEl(): HTMLMediaElement {
  return document
    .querySelector("azure-video-player")
    ?.shadowRoot?.getElementById("video") as HTMLMediaElement;
}

async function initPlayer() {
  // Create a Player instance.
  const video = _getVideEl();

  player = new shaka.Player(video);

  player.configure({
    drm: {
      servers: {
        "com.widevine.alpha":
          "https://pamishtestupload.keydelivery.eastus.media.azure.net/Widevine/?kid=64cc0d16-db2c-4e98-bc22-b33a97bf1b69",
      },
    },
    abr: {
      enabled: true,
    },
  });

  player.getNetworkingEngine()?.registerRequestFilter(function (type, request) {
    // Only add headers to license requests:
    if (type == shaka.net.NetworkingEngine.RequestType.LICENSE) {
      // This is the specific header name and value the server wants:
      request.headers["authorization"] = "Bearer --enter-value-here-";
      // console.log("key type: ", type);
      // console.log(shaka.net.NetworkingEngine.RequestType);
    }

    if (type === shaka.net.NetworkingEngine.RequestType.KEY) {
      console.log("key type: ", type);
      console.log("request: ", request);
    }
  });

  // Attach player to the window to make it easy to access in the JS console.
  window.player = player;

  // Listen for error events.
  player.addEventListener("error", onErrorEvent);

  player.addEventListener("adaptation", async () => {
    console.log("resolution changed");
    await loadBitrates();
  });

  // Try to load a manifest.
  // This is an asynchronous process.
  try {
    await player.load(manifestUri);
    // This runs if the asynchronous load is successful.
    console.log("The video has now been loaded!");

    const streamUrl = document.getElementById("stream-url") as HTMLInputElement;
    //
    streamUrl!.value = manifestUri;

    await loadTextTracks();
    await loadBitrates();
  } catch (e) {
    // onError is executed if the asynchronous load fails.
    onError(e);
  }
}

async function loadBitrates() {
  const bitRates = await player.getVariantTracks();

  const bitRatesComponent = document
    .querySelector("azure-video-player")
    ?.shadowRoot?.querySelector("react-test")
    ?.querySelector("#bitrate-select")
    

    console.log("bitRatesComponent")
    console.log(bitRatesComponent)

  while (bitRatesComponent!.firstChild) {
    bitRatesComponent!.removeChild(bitRatesComponent!.lastChild as Node);
  }

  if (bitRates.length > 0) {
    for (const track of bitRates) {
      const button = document.createElement("button");
      button.classList.add("list-group-item");
      button.classList.add("list-group-item-action");
      if (track.active) button.classList.add("active");
      button.innerHTML = `${track.width}x${track.height} - ${formatBytes(
        track.bandwidth
      )}`;
      button.setAttribute("id", track.id.toString());
      button.onclick = () => selectBitRate(track);
      bitRatesComponent!.appendChild(button);
    }
  } else {
    const button = document.createElement("button");
    button.classList.add("list-group-item");
    button.classList.add("list-group-item-action");
    button.innerHTML = "No text tracks found...";
    bitRatesComponent!.appendChild(button);
  }
}

async function loadTextTracks() {
  const textTracks = await player.getTextTracks();
  console.log("your text tracks...");
  console.log(textTracks);

  const subtitleComponent = document.getElementById("subtitle-list");

  while (subtitleComponent!.firstChild) {
    subtitleComponent!.removeChild(subtitleComponent!.lastChild as Node);
  }

  if (textTracks.length > 0) {
    for (const track of textTracks) {
      const button = document.createElement("button");
      button.classList.add("list-group-item");
      button.classList.add("list-group-item-action");
      button.innerHTML = `${track.id}: ${track.language}`;
      button.setAttribute("id", track.id.toString());
      button.onclick = () => selectTextTrack(track);
      subtitleComponent!.appendChild(button);
    }
  } else {
    const button = document.createElement("button");
    button.classList.add("list-group-item");
    button.classList.add("list-group-item-action");
    button.innerHTML = "No text tracks found...";
    subtitleComponent!.appendChild(button);
  }
}

function shiftTrack() {
  const video = _getVideEl();
  const tracks = video.textTracks;
  const cues = Array.from((tracks[0] && tracks[0].cues) || []) as VTTCue[];
  cues.forEach((cue) => {
    cue.line = 0;
    cue.line = -4;
    console.log(cue);
  });

  const html = document.querySelector("azure-video-player");
  console.log("Attribute: ", html?.getAttribute("play-button"));
}

function resetTrack() {
  const video = _getVideEl();
  const tracks = video.textTracks;
  const cues = Array.from((tracks[0] && tracks[0].cues) || []) as VTTCue[];
  setTimeout(() => {
    cues.forEach((cue) => {
      cue.line = 0;
      cue.line = -2;
      console.log(cue);
    });
  }, 200);
}

function selectTextTrack(track: shaka.extern.Track) {
  console.log(track);

  player.selectTextTrack(track);
  player.setTextTrackVisibility(true);
}

async function selectBitRate(track: shaka.extern.Track) {
  await player.selectVariantTrack(track);
  await loadBitrates();
}

async function reloadPlayer() {
  const streamUri = document.getElementById("stream-url") as HTMLInputElement;
  await player.load(streamUri!.value);
  // await loadTextTracks();
  console.log(await player.getVariantTracks());
}

function onErrorEvent(event: any) {
  // Extract the shaka.util.Error object from the event.
  onError(event.detail);
}

function onError(error: any) {
  // Log the error.
  console.error("Error code", error.code, "object", error);
}

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

document.addEventListener("DOMContentLoaded", initApp);
document
  .getElementById("stream-url-btn")
  ?.addEventListener("click", reloadPlayer);
document
  .querySelector("azure-video-player")
  ?.addEventListener("mouseenter", () => {
    shiftTrack();
  });
document
  .querySelector("azure-video-player")
  ?.addEventListener("mouseleave", () => {
    resetTrack();
  });

  