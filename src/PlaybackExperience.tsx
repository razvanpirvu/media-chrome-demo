// -----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
// Copyright (c) Microsoft Corporation. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import {
  FluentProvider,
  mergeClasses,
  webDarkTheme,
} from "@fluentui/react-components";
import { IObservableProperty } from "@msstream/components-oneplayer-typings";
import React from "react";

import { MenuProvider } from "./PlaybackSettings/PlaybackSettingsProvider";
// import PopOutButton from "./PopOutButton/PopOutButton";
import { usePlaybackExperienceContext } from "./MtcContextProvider";
import { IOverflowableButton, MenuWithOverflow } from "./MenuWithOverflow";

// import { PluginButtonModel } from './PluginButton/PluginButtonModel';
// import PluginButton from './PluginButton/PluginButton';

import { SubmenuButton } from "./SubmenuButton/SubmenuButton";
import {
  ClosedCaption24Regular,
  Settings20Regular,
} from "@fluentui/react-icons";
import { PlaybackSpeedIcon } from "./PlaybackSpeed/PlaybackSpeedIcon";

import { xsBreakpoint } from "./shared.utils";

import { formatString, throttle } from "@msstream/shared-services";
import { commonMtcStyles } from "./mtcComponents.classNames";
import { playbackExperienceStyles } from "./PlaybackExperience.classNames";
import { altKeyName } from "@msstream/shared-ui";

export interface IPlaybackExperienceProps {
  playbackExperienceContainer: HTMLDivElement;
  mtcMenuOpen: IObservableProperty<boolean>; // This boolean indicates if any MTC menu is open
  pluginButtonModels: IObservableProperty<any[]>;
}

/**
 * The container for all buttons in the playback experience, rendered on the
 * right region of the MTC. This is responsible for creating the JSX for each
 * button and handing it off to the MenuWithOverflow to draw.
 */
const PlaybackExperience: React.FunctionComponent<IPlaybackExperienceProps> = (
  props: IPlaybackExperienceProps
) => {
  const styles = playbackExperienceStyles();
  const [buttonsToRender, setButtonsToRender] = React.useState<
    IOverflowableButton[]
  >([]);
  const {
    handlers,
    player,
    playerContainer,
    loc,
    rtl,
    settingsStore,
    showPlaybackSpeed,
    showPopOutButton,
    mediaType,
    useBooleanSetting,
  } = usePlaybackExperienceContext();

  const isSafariFluentMtcTooltipMountModeBugFixEnabled = false;
  const tooltipMountNodeStyle = isSafariFluentMtcTooltipMountModeBugFixEnabled
    ? commonMtcStyles().tooltipMountNode
    : "";

  //   const shouldShowPopOutButton = useReadOnlyObservable(showPopOutButton);
  //   const itemUrl = useReadOnlyObservable(player.itemUrl);

  const isDisablePipButtonForAudioFilesEnabled = false;
  const isHighContrastChangesEnabled = false;

  const isPipEnabled = false;

  const isPipMediaTypeCheckEnabled = false;

  const videoElement: HTMLVideoElement | undefined = document
    .querySelector("media-controller")
    ?.querySelector("#video") as HTMLVideoElement | undefined;

  const [tooltipMountNode, setTooltipMountNode] =
    React.useState<HTMLElement | null>();

  const playbackSettingsRef = React.useRef<HTMLButtonElement | null>(null);

  const [playerPlaybackRate, setPlayerPlaybackRate] = React.useState(1);

  //   const resizeContainer: HTMLDivElement = React.useMemo(() => {
  //     const resizeContainerQuery = playerContainer.getElementsByClassName(
  //       "fluent-critical-ui-container"
  //     );
  //     return resizeContainerQuery.length
  //       ? (resizeContainerQuery[0] as HTMLDivElement)
  //       : playerContainer;
  //   }, [playerContainer]);

  //   const [isXsThreshold, setIsXsThreshold] = React.useState<boolean>(() => {
  //     return resizeContainer.clientWidth < xsBreakpoint ? true : false;
  //   });

  const handleKeyboardShortcutsModalDismiss = () => {
    handlers.closeKeyboardShortcutModal();
    if (playbackSettingsRef && playbackSettingsRef.current) {
      playbackSettingsRef.current.focus();
    }
  };

  //   React.useEffect(() => {
  //     const onResize = () => {
  //       resizeContainer.clientWidth < xsBreakpoint
  //         ? setIsXsThreshold(true)
  //         : setIsXsThreshold(false);
  //     };

  //     const throttledResize = throttle(onResize, 200);
  //     const mtcResizeObserver = new ResizeObserver(throttledResize);
  //     mtcResizeObserver.observe(resizeContainer);

  //     return () => {
  //       mtcResizeObserver.disconnect();
  //     };
  //   }, [resizeContainer]);

  // Build up the list of buttons to display
  React.useEffect(() => {
    const buttonList: IOverflowableButton[] = [];

    // for (const pluginButtonModel of pluginButtonModels) {
    //   buttonList.push({
    //     key: pluginButtonModel.id.toString(),
    //     render: (inOverflowMenu: boolean) => (
    //       <PluginButton
    //         inOverflowMenu={inOverflowMenu}
    //         tooltipMountNode={tooltipMountNode as HTMLDivElement}
    //         pluginButtonModel={pluginButtonModel}
    //       />
    //     ),
    //     isVisible: pluginButtonModel.isVisibleObservableProperty,
    //   });
    // }

    buttonList.push({
      key: "playbackSpeedButton",
      render: () => (
        <SubmenuButton
          tooltipMountNode={tooltipMountNode as HTMLDivElement}
          mtcMenuOpen={props.mtcMenuOpen}
          buttonContents={
            <React.Fragment key={playerPlaybackRate.toString()}>
              {playerPlaybackRate.toString()}x
            </React.Fragment>
          }
          tooltipText={formatString(
            loc.getString("PlaybackSpeedTooltip"),
            altKeyName
          )}
          ariaLabel={formatString(
            loc.getString("PlaybackSpeedButtonWithCurrentSpeedAriaLabel"),
            playerPlaybackRate.toString()
          )}
          ariaDescription={formatString(
            loc.getString("PlaybackSpeedButtonAriaDescription"),
            altKeyName
          )}
          initalSubmenu="playbackSpeed"
          openUserActionName="OpenPlaybackSpeedMenu"
          closeUserActionName="ClosePlaybackSpeedMenu"
          popoverClassName={styles.playbackSpeedPopover}
        />
      ),
      subMenu: {
        buttonContents: <PlaybackSpeedIcon includeTitle />,
        buttonAriaLabel: formatString(
          loc.getString("PlaybackSpeedButtonWithCurrentSpeedAriaLabel"),
          playerPlaybackRate.toString()
        ),
        submenuToOpen: "playbackSpeed",
        displayChevron: true,
      },
    });

    setButtonsToRender(buttonList);
  }, [playerPlaybackRate]);

  return (
    <FluentProvider
      theme={webDarkTheme}
      // tslint:disable-next-line: jsx-ban-props
      style={{ background: "none" }}
    >
      <MenuProvider>
        <MenuWithOverflow
          childWidth={32}
          container={props.playbackExperienceContainer}
          mtcMenuOpen={props.mtcMenuOpen}
          menuAriaLabel={"PlaybackExperienceContainerAriaLabel"}
          tooltipMountNode={tooltipMountNode as HTMLDivElement}
        >
          {buttonsToRender}
        </MenuWithOverflow>
        <div className={tooltipMountNodeStyle} ref={setTooltipMountNode} />
      </MenuProvider>
    </FluentProvider>
  );
};

// export default PlaybackExperience;
import reactToWebComponent from "react-to-webcomponent";
import ReactDom from "react-dom";
const webComponent = reactToWebComponent(
  PlaybackExperience,
  React as any,
  ReactDom as any
);

export default () =>
  customElements.define("react-playback-experience", webComponent as any);
