import MediaChromeButton from "media-chrome/dist/media-chrome-button";
import {MediaUIAttributes} from "media-chrome/dist/constants";
import {defineCustomElement} from "media-chrome/dist/utils/defineCustomElement";

const playIcon = `<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="m6 21 15-9L6 3v18Z"/>
</svg>`;

const pauseIcon = `<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M6 20h4V4H6v16Zm8-16v16h4V4h-4Z"/>
</svg>`;

const window = document.window;

const slotTemplate = document.createElement('template');
slotTemplate.innerHTML = `
  <style>
  :host([${MediaUIAttributes.MEDIA_PAUSED}]) slot[name=pause] > *, 
  :host([${MediaUIAttributes.MEDIA_PAUSED}]) ::slotted([slot=pause]) {
    display: none !important;
  }
  :host(:not([${MediaUIAttributes.MEDIA_PAUSED}])) slot[name=play] > *, 
  :host(:not([${MediaUIAttributes.MEDIA_PAUSED}])) ::slotted([slot=play]) {
    display: none !important;
  }
  </style>
  <slot name="play">${playIcon}</slot>
  <slot name="pause">${pauseIcon}</slot>
`;

class MediaTestButton extends MediaChromeButton { 
    static get observedAttributes() {
        return [...super.observedAttributes, MediaUIAttributes.MEDIA_PAUSED];
    }

    constructor(options = {}) {
        super({ slotTemplate, ...options });
    }

    connectedCallback() {
        super.connectedCallback();
    }

    handleClick(_e) {
        // const eventName =
        //   this.getAttribute(MediaUIAttributes.MEDIA_PAUSED) != null
        //     ? MediaUIEvents.MEDIA_PLAY_REQUEST
        //     : MediaUIEvents.MEDIA_PAUSE_REQUEST;
        // this.dispatchEvent(
        //   new window.CustomEvent(eventName, { composed: true, bubbles: true })
        // );

        console.log("EVENT CLICKED")
    }
}

defineCustomElement('media-test-button', MediaTestButton);
export default MediaTestButton;