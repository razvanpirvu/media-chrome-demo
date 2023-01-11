// -----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
// Copyright (c) Microsoft Corporation. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import { MenuItem, MenuList, mergeClasses } from "@fluentui/react-components";
import {
  ChevronRight20Regular,
  ChevronLeft20Regular,
} from "@fluentui/react-icons";
import { BitrateQuality } from "@msstream/components-oneplayer-typings";
import React from "react";
import { getInitialQualityLabelFromList } from "../PlaybackSettings/PlaybackSettings.utils";
import { useMenuSettings } from "../PlaybackSettings/PlaybackSettingsProvider";
import { usePlaybackExperienceContext } from "../MtcContextProvider";
import { ISubmenuProps } from "./submenus";
import { CssVarNames, submenuStyles } from "./Submenu.classNames";
// import { useReadOnlyObservable } from '@msstream/utilities-hooks';
import { actionTypeFromClick } from "../telemetryUtilities";
// import { useAutoFocusOnFirstChildButton } from '@msstream/utilities-hooks';
import { mtcHeightWithPadding } from "../shared.utils";

const getQualityLabel = (
  listOfBitrates: BitrateQuality[],
  quality: string,
  autoQualityLabel: string
) => {
  // If user has made a selection, it will be in settings.quality (second param)
  // Else, if there is only 1 available bitrate, show that ones label. Otherwise show auto
  if (quality === "-1") {
    return getInitialQualityLabelFromList(listOfBitrates, autoQualityLabel);
  }

  return quality;
};

export const SettingsRootSubmenu: React.FunctionComponent<ISubmenuProps> = (
  props: ISubmenuProps
) => {
  const resolvedCSSVars: Record<string, string> = {};
  const styles = submenuStyles();
  const { settings } = useMenuSettings();
  const { handlers, loc, rtl, player, playerContainer, useBooleanSetting } =
    usePlaybackExperienceContext();
  const [ccTracks] = React.useState(player.textTracks);
  const showQualityMenu = player.availableBitrateQualities.value.length > 0;
  const autoFocusTarget = React.useRef<null | HTMLDivElement>(null);
  const isFluentMtcSubmenuAriaLabelFixEnabled = useBooleanSetting(
    "isFluentMtcSubmenuAriaLabelFixEnabled"
  );
  const autoQualityLabel = useBooleanSetting(
    "isAutoQualityLabelLocalizedEnabled"
  )
    ? loc.getString("PlaybackSettings.AutoQualityLabel")
    : "Auto";
  const isHighContrastChangesEnabled = useBooleanSetting(
    "isHighContrastChangesEnabled"
  );

  const settingButtonStyle = isHighContrastChangesEnabled
    ? mergeClasses(styles.settingButton, styles.settingButtonHighContrastFix)
    : styles.settingButton;
  const settingMenuItemStyle = isHighContrastChangesEnabled
    ? mergeClasses(
        styles.settingMenuItem,
        styles.settingMenuItemHighContrastFix
      )
    : styles.settingMenuItem;

  const handleClick = (): void => {
    handlers.openKeyboardShortcutModal("LeftClick");
  };

  resolvedCSSVars[`${CssVarNames.playerContainerHeight}`] = `${
    playerContainer.clientHeight - mtcHeightWithPadding
  }px`;
  //   useAutoFocusOnFirstChildButton(autoFocusTarget);

  return (
    <MenuList
      dir={rtl ? "rtl" : "ltr"}
      className={styles.wideContainer}
      // tslint:disable-next-line: jsx-ban-props
      style={{ ...resolvedCSSVars } as React.CSSProperties}
      ref={autoFocusTarget}
    >
      {props.menuItemsToAddToTopOfSubmenu}
      {ccTracks.value.length > 0 ? (
        <MenuItem
          aria-haspopup
          className={settingMenuItemStyle}
          // tslint:disable-next-line: jsx-no-lambda
          onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
            props.navigateTo("captionSettings", actionTypeFromClick(event.type))
          }
        >
          <div className={settingButtonStyle}>
            <span>{loc.getString("PlaybackSettings.CaptionSettings")}</span>
            {rtl ? (
              <ChevronLeft20Regular
                // tslint:disable-next-line: jsx-ban-props
                style={{ marginLeft: 12 }}
              />
            ) : (
              <ChevronRight20Regular
                // tslint:disable-next-line: jsx-ban-props
                style={{ marginLeft: 12 }}
              />
            )}
          </div>
        </MenuItem>
      ) : (
        <></>
      )}

      {showQualityMenu ? (
        <MenuItem
          aria-haspopup
          aria-label={
            isFluentMtcSubmenuAriaLabelFixEnabled
              ? `${loc.getString("PlaybackSettings.Quality")} ${getQualityLabel(
                  player.availableBitrateQualities.value,
                  settings.quality,
                  autoQualityLabel
                )}`
              : undefined
          }
          className={settingMenuItemStyle}
          // tslint:disable-next-line: jsx-no-lambda
          onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
            props.navigateTo("qualitySettings", actionTypeFromClick(event.type))
          }
        >
          <div
            className={settingButtonStyle}
            aria-hidden={isFluentMtcSubmenuAriaLabelFixEnabled}
          >
            <span>{loc.getString("PlaybackSettings.Quality")}</span>
            <div
              // tslint:disable-next-line: jsx-ban-props
              style={{ display: "flex", alignItems: "center" }}
            >
              <span className={styles.itemTooltip}>
                {getQualityLabel(
                  player.availableBitrateQualities.value,
                  settings.quality,
                  autoQualityLabel
                )}
              </span>
              {rtl ? (
                <ChevronLeft20Regular
                  // tslint:disable-next-line: jsx-ban-props
                  style={{ marginLeft: 12 }}
                />
              ) : (
                <ChevronRight20Regular
                  // tslint:disable-next-line: jsx-ban-props
                  style={{ marginLeft: 12 }}
                />
              )}
            </div>
          </div>
        </MenuItem>
      ) : (
        <></>
      )}
      <MenuItem className={settingMenuItemStyle} onClick={handleClick}>
        <div className={settingButtonStyle}>
          {loc.getString("PlaybackSettings.KeyboardShortcuts")}
        </div>
      </MenuItem>
    </MenuList>
  );
};
