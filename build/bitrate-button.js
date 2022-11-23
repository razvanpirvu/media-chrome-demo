import MediaChromeButton from "media-chrome/dist/media-chrome-button";
import { MediaUIAttributes } from "media-chrome/dist/constants";
import { defineCustomElement } from "media-chrome/dist/utils/defineCustomElement";
import { Window as window } from "media-chrome/dist/utils/server-safe-globals";

const bitrateIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bar-chart" viewBox="0 0 16 16">
<path d="M4 11H2v3h2v-3zm5-4H7v7h2V7zm5-5v12h-2V2h2zm-2-1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1h-2zM6 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7zm-5 4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-3z"/>
</svg>`;

const slotTemplate = document.createElement("template");
slotTemplate.innerHTML = `
  <link
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css"
    rel="stylesheet"
    integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi"
    crossorigin="anonymous"
  />
  <style>
    :host([${MediaUIAttributes.MEDIA_PAUSED}]) slot[name=pause] > *, 
    :host([${MediaUIAttributes.MEDIA_PAUSED}]) ::slotted([slot=pause]) {
      display: none !important;
    }
    :host(:not([${MediaUIAttributes.MEDIA_PAUSED}])) slot[name=play] > *, 
    :host(:not([${MediaUIAttributes.MEDIA_PAUSED}])) ::slotted([slot=play]) {
      display: none !important;
    }

    .initials{
      font-size:medium;
      padding-bottom:5px;
    }
    .dropbtn {
      background: none;
      color: white;
      padding: 16px;
      
      border: none;
      top:50%;
    }

    /* The container <div> - needed to position the dropup content */
    .dropup {
      position: relative;
      display: inline-block;
    }

    /* Dropup content (Hidden by Default) */
    .dropup-content {
      display: none;
      position: absolute;
      bottom: 50px;
      // background-color: #2c3e50;
      min-width: 180px;
      max-width: 250px;
      box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
      z-index: 1;
    }

    /* Links inside the dropup */
    .dropup-content button {
      padding: 12px 16px;
      text-decoration: none;
      display: block;
      font-size: 0.8rem;
    }

    /* Change color of dropup links on hover */
    .dropup-content a:hover {background-color: #ddd}

    /* Show the dropup menu on hover */
    .dropup:hover .dropup-content {
      display: block;
    }

    /* Change the background color of the dropup button when the dropup content is shown */
    // .dropup:hover .dropbtn {
    //   background-color: #2980B9;
    // } 

  </style>

  <slot name="bitrate">

  <div id="content"/>
    <div class="initials">
      <div>
      <div class="dropup">
        <button class="dropbtn">${bitrateIcon}</button>
        <div id="bitrate-select" class="dropup-content list-group">
        </div>
      </div>  
    </div> 
  </slot>
`;

class MediaBitrateButton extends MediaChromeButton {
  static get observedAttributes() {
    return [...super.observedAttributes, MediaUIAttributes.MEDIA_PAUSED];
  }

  constructor(options = {}) {
    super({ slotTemplate, ...options });
    document
      .querySelector("media-test-button")
      .shadowRoot.getElementById("bitrate-select").onclick = () =>
      console.log("I AM CLICKED ");
  }

  connectedCallback() {
    super.connectedCallback();
  }

  handleClick(_e) {
    // const eventName =
    //   this.getAttribute(MediaUIAttributes.MEDIA_PAUSED) != null
    //     ? MediaUIEvents.MEDIA_PLAY_REQUEST
    //     : MediaUIEvents.MEDIA_PAUSE_REQUEST;
    this.dispatchEvent(
      new window.CustomEvent("eventName", { composed: true, bubbles: true })
    );

    console.log("EVENT CLICKED");
  }
}

class Test extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });

    const buttonHTML = slotTemplate.content.cloneNode(true);
    this.nativeEl = buttonHTML;
    shadow.appendChild(buttonHTML);
  }
}

// customElements.define("media-test-button", Test);

defineCustomElement("media-bitrate-button", MediaBitrateButton);
export default MediaBitrateButton;
