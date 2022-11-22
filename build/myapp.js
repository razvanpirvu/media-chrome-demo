import shaka from "./shaka-player.compiled";
import MediaTestButton from "./custom-button";

const manifestUri =
  "https://rpirvu-usea.streaming.media.azure.net/b37ad24a-42d0-4911-bf04-48d44acd2f81/Big_Buck_Bunny_1080_10s_1MB.ism/manifest(format=m3u8-cmaf)";

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
}

async function initPlayer() {
  // Create a Player instance.
  const video = document.getElementById("video");
  const player = new shaka.Player(video);


  player.configure({
    drm: {
      servers: {
        "com.widevine.alpha":
          "https://pamishtestupload.keydelivery.eastus.media.azure.net/Widevine/?kid=64cc0d16-db2c-4e98-bc22-b33a97bf1b69",
      },
    },
    abr: {
      enabled: true
    }
  });

  player.getNetworkingEngine().registerRequestFilter(function (type, request) {
    // Only add headers to license requests:
    if (type == shaka.net.NetworkingEngine.RequestType.LICENSE) {
      // This is the specific header name and value the server wants:
      request.headers["authorization"] = "Bearer --enter-value-here-";
    }
  });

  // Attach player to the window to make it easy to access in the JS console.
  window.player = player;

  // Listen for error events.
  player.addEventListener("error", onErrorEvent);

  player.addEventListener("adaptation", async () => {
    console.log('resolution changed');
    await loadBitrates();
  })

  // Try to load a manifest.
  // This is an asynchronous process.
  try {
    await player.load(manifestUri);
    // This runs if the asynchronous load is successful.
    console.log("The video has now been loaded!");

    const streamUrl = document.getElementById("stream-url");
    streamUrl.value = manifestUri;

    await loadTextTracks();
    await loadBitrates();
  } catch (e) {
    // onError is executed if the asynchronous load fails.
    onError(e);
  }
}

async function loadBitrates() {
  const bitRates = await player.getVariantTracks();

  const bitRatesComponent = document.getElementById("bitrates-list");

  while (bitRatesComponent.firstChild) {
    bitRatesComponent.removeChild(bitRatesComponent.lastChild);
  }

  if (bitRates.length > 0) {
    for (const track of bitRates) {
      const button = document.createElement("button");
      button.classList.add("list-group-item");
      button.classList.add("list-group-item-action");
      if (track.active)
        button.classList.add("active");
      button.innerHTML = `${track.id}: ${track.width}x${track.height} - ${formatBytes(track.bandwidth)}`;
      button.setAttribute("id", track.id);
      button.onclick = () => selectBitRate(track);
      bitRatesComponent.appendChild(button);
    }
  } else {
    const button = document.createElement("button");
    button.classList.add("list-group-item");
    button.classList.add("list-group-item-action");
    button.innerHTML = "No text tracks found...";
    bitRatesComponent.appendChild(button);
  }
}

async function loadTextTracks() {
  const textTracks = await player.getTextTracks();
  console.log("your text tracks...");
  console.log(textTracks);

  const subtitleComponent = document.getElementById("subtitle-list");

  while (subtitleComponent.firstChild) {
    subtitleComponent.removeChild(subtitleComponent.lastChild);
  }

  if (textTracks.length > 0) {
    for (const track of textTracks) {
      const button = document.createElement("button");
      button.classList.add("list-group-item");
      button.classList.add("list-group-item-action");
      button.innerHTML = `${track.id}: ${track.language}`;
      button.setAttribute("id", track.id);
      button.onclick = () => selectTextTrack(track);
      subtitleComponent.appendChild(button);
    }
  } else {
    const button = document.createElement("button");
    button.classList.add("list-group-item");
    button.classList.add("list-group-item-action");
    button.innerHTML = "No text tracks found...";
    subtitleComponent.appendChild(button);
  }
}

function selectTextTrack(track) {
  player.selectTextTrack(track);
  player.setTextTrackVisibility(true);
}

async function selectBitRate(track) {
  await player.selectVariantTrack(track);
  await loadBitrates();
}

async function reloadPlayer() {
  const player = window.player;
  const streamUri = document.getElementById("stream-url");
  await player.load(streamUri.value);
  // await loadTextTracks();
  console.log(await player.getVariantTracks());
}

function onErrorEvent(event) {
  // Extract the shaka.util.Error object from the event.
  onError(event.detail);
}

function onError(error) {
  // Log the error.
  console.error("Error code", error.code, "object", error);
}

function formatBytes(bytes, decimals = 2) {
  if (!+bytes) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

document.addEventListener("DOMContentLoaded", initApp);
document
  .getElementById("stream-url-btn")
  .addEventListener("click", reloadPlayer);

