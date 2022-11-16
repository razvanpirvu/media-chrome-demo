const shaka = require("./shaka-player.compiled");

const manifestUri = 
    'https://ams1-uswe.streaming.media.azure.net/878f95e3-7751-4a31-bea5-f1bfeb22280a/AzurePromo.ism/manifest(format=mpd-time-cmaf)';

function initApp() {
  // Install built-in polyfills to patch browser incompatibilities.
  shaka.polyfill.installAll();

  // Check to see if the browser supports the basic APIs Shaka needs.
  if (shaka.Player.isBrowserSupported()) {
    // Everything looks good!
    initPlayer();
  } else {
    // This browser does not have the minimum set of APIs we need.
    console.error('Browser not supported!');
  }
}

async function initPlayer() {
  // Create a Player instance.
  const video = document.getElementById('video');
  const player = new shaka.Player(video);

  // Attach player to the window to make it easy to access in the JS console.
  window.player = player;

  // Listen for error events.
  player.addEventListener('error', onErrorEvent);

  // Try to load a manifest.
  // This is an asynchronous process.
  try {
    await player.load(manifestUri);
    // This runs if the asynchronous load is successful.
    console.log('The video has now been loaded!');
    
    const streamUrl = document.getElementById("stream-url");
    streamUrl.value = manifestUri;
     
    await loadTextTracks();
  } catch (e) {
    // onError is executed if the asynchronous load fails.
    onError(e);
  }
}

async function loadTextTracks() {
    const textTracks = await player.getTextTracks();
    console.log("your text tracks...");
    console.log(textTracks)

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
            button.setAttribute('id', track.id);
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

async function reloadPlayer() {
    const player = window.player;
    const streamUri = document.getElementById("stream-url");
    await player.load(streamUri.value);
    await loadTextTracks();
}

function onErrorEvent(event) {
  // Extract the shaka.util.Error object from the event.
  onError(event.detail);
}

function onError(error) {
  // Log the error.
  console.error('Error code', error.code, 'object', error);
}


document.addEventListener('DOMContentLoaded', initApp);
document.getElementById("stream-url-btn").addEventListener('click', reloadPlayer);