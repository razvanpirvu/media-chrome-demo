import {defineCustomElement} from "media-chrome/dist/utils/defineCustomElement";
import MediaTheme from "media-chrome/dist/themes/media-theme";

const template = `
<style>
    :host {
        display: inline-block;
    }

    media-controller {
        background: red;
        --media-range-thumb-background: rgba(255, 0, 0, 1);
        --media-range-track-height: 4px;
        --media-range-track-transition: height 0.2s ease;
        --media-range-track-background: #555;
        --media-range-bar-color: rgb(229, 9, 20);
        --media-control-hover-background: none;
        --media-control-background: red;
        --media-button-icon-height: 350px;
        --media-button-icon-transform: scale(1);
        --media-button-icon-transition: transform 0.2s ease;
    }

    media-time-range {
        height: auto;
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
      padding: 30px 17px;
    }
    media-fullscreen-button {
      --media-button-icon-height: 50px;
      margin-right: 10px;
    }
    .control-bar-title {
      margin: 0 auto;
      padding-right: 15%;
    }
</style>
`