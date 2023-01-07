const template = document.createElement("template");
import { defineCustomElement } from "media-chrome/dist/utils/defineCustomElement";

template.innerHTML = `
<style>
:host {
  display: inline-block;
}

media-controller {
  --media-range-thumb-background: rgb(237, 226, 226);
  /* --media-range-track-height: 4px; */
  --media-range-track-transition: height 0.2s ease;
  --media-range-track-background: #555;
  /* --media-range-bar-color: rgb(229, 9, 20); */
  --media-control-hover-background: none;
  --media-control-background: none;
  --media-button-icon-transform: scale(1);
  --media-button-icon-transition: transform 0.2s ease;
}

media-control-bar {
  display: flex;
  background: rgba(20, 19, 19, 0.7);
  backdrop-filter: blur(3px);
}

media-time-range {
  height: 20px;
  --media-range-thumb-height: 20px;
  --media-range-thumb-width: 20px;
  --media-range-thumb-border-radius: 20px;
  --media-time-buffered-color: #777;
  --media-range-track-pointer-border-right: 2px solid #fff;
}
media-time-range:hover {
  --media-range-track-height: 9px;
}
media-control-bar {
  width: 100%;
  align-items: center;
}
media-control-bar *:hover {
  --media-button-icon-transform: scale(1.2);
  --media-button-icon-transition: transform 0.2s ease;
}

media-play-button,
media-seek-backward-button,
media-seek-forward-button,
media-mute-button,
media-fullscreen-button {
  --media-button-icon-height: 45px;
  /* padding: 30px 17px; */
}

media-captions-button:hover {
  background: red;
  --captions-display: block;
}

media-fullscreen-button {
  --media-button-icon-height: 50px;
  margin-right: 10px;
}
.control-bar-title {
  margin: 0 auto;
  padding-right: 15%;
}

#video::cue {
  font-size: 28px;
  bottom: 30;
  background-color: transparent;
  text-shadow: 1px 1px 2px black;
}

</style>

<media-controller>
    <video id="video" slot="media" crossorigin autoplay muted>
      <!-- <track label="thumbnails" default kind="metadata" src="https://image.mux.com/DS00Spx1CV902MCtPj5WknGlR102V5HFkDe/storyboard.vtt"> -->
    </video>
    <media-control-bar>
    <react-test-volume></react-test-volume>
    <react-app></react-app>
    </media-control-bar>
</media-controller>
`;

class AzureVideoPlayer extends HTMLElement {
  _template;

  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });

    const html = template.content.cloneNode(true);
    shadow.appendChild(html);

    // this.buildTemplate();
  }

  addControls() {
    // Update video player based on attributes
    const html = document
      .querySelector("azure-video-player")
      ?.shadowRoot?.querySelector("media-controller")
      ?.querySelector("media-control-bar");

    const attrs = document.querySelector("azure-video-player")?.attributes;

    const controls = [];
    for (let i = 0; i < attrs.length; i++) {
      this._buildControls(attrs.item(i).nodeName, controls);
    }

    const template = document.createElement("template");
    // console.log(controls);
    template.innerHTML = controls.join("\n");
    html?.appendChild(template.content.cloneNode(true));
  }

  _buildControls(controlType, controls) {
    switch (controlType) {
      case "play-button":
        // controls.push("<media-play-button></media-play-button>");
        controls.push("<react-play-pause></react-play-pause>");
        break;
      case "timeline":
        controls.push("<media-time-range></media-time-range>");
        break;
      case "bitrate-button":
        controls.push("<react-test></react-test>");
        break;
      case "mute-button":
        controls.push("<media-mute-button></media-mute-button>");
        break;
      case "volume-range":
        controls.push("<react-test-volume></react-test-volume>");
        break;
      case "time-display":
        controls.push(
          "<media-time-display show-duration></media-time-display>"
        );
        break;
      case "captions-button":
        controls.push("<media-captions-button></media-captions-button>");
        break;
      case "fullscreen-button":
        controls.push("<media-fullscreen-button></media-fullscreen-button>");
        break;
      default:
        break;
    }
  }
}

defineCustomElement("azure-video-player", AzureVideoPlayer);

export default AzureVideoPlayer;
//   defineCustomElement("azure-video-player", AzureVideoPlayer);
