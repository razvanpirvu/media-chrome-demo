// -----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
// Copyright (c) Microsoft Corporation. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import {
  MenuItem,
  MenuList,
  Switch,
  FluentProvider,
  webDarkTheme,
  mergeClasses,
} from "@fluentui/react-components";
import {
  ChevronLeft20Regular,
  ChevronRight20Regular,
} from "@fluentui/react-icons";
import { NamedColors } from "@msstream/shared-ui";
import React from "react";

import { useMenuSettings } from "../PlaybackSettings/PlaybackSettingsProvider";
import { usePlaybackExperienceContext } from "../MtcContextProvider";
import { ISubmenuProps } from "./submenus";
import { submenuStyles } from "./Submenu.classNames";
import { actionTypeFromClick } from "../telemetryUtilities";
//   import { useAutoFocusOnFirstChildButton } from '@msstream/utilities-hooks';
import {
  createScreenReaderAlert,
  formatString,
} from "@msstream/shared-services";

export const CaptionSettingsSubmenu: React.FunctionComponent<ISubmenuProps> = (
  props: ISubmenuProps
) => {
  const styles = submenuStyles();
  const switchParentRef = React.useRef<null | HTMLDivElement>(null);
  // tslint:disable-next-line: no-any
  const lastItemRef = React.useRef<any>(null);
  const {
    settings,
    updateSettings,
    revertToDefaultCaptionSettings,
    logChangeSettingsAction,
  } = useMenuSettings();
  const { loc, rtl, log, player, useBooleanSetting } =
    usePlaybackExperienceContext();
  const autoFocusTarget = React.useRef<null | HTMLDivElement>(null);
  const isFluentMtcSubmenuAriaLabelFixEnabled = useBooleanSetting(
    "isFluentMtcSubmenuAriaLabelFixEnabled"
  );
  const isRevertToDefaultConfirmationFixEnabled = useBooleanSetting(
    "isRevertToDefaultConfirmationFixEnabled"
  );
  const isFluentMtcSwitchRtlFixEnabled = useBooleanSetting(
    "isFluentMtcSwitchRtlFixEnabled"
  );
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // tslint:disable-next-line: no-any
  const handleSwitchKeyDown = (e: any) => {
    if (e.key === "Enter") {
      updateSettings({
        ...settings,
        captionsBackgroundTransparency:
          !settings.captionsBackgroundTransparency,
      });
    }
    if (e.key === "ArrowDown") {
      lastItemRef.current && lastItemRef.current.focus();
    }
  };

  const handleSwitchChange = (
    _: React.ChangeEvent<HTMLInputElement>,
    data: {
      checked: boolean;
    }
  ) => {
    logChangeSettingsAction(
      "ChangeCaptionBackground",
      settings.captionsBackgroundTransparency.toString(),
      data.checked.toString()
    );
    updateSettings({
      ...settings,
      captionsBackgroundTransparency: data.checked,
    });
    const screenReaderString = formatString(
      loc.getString("FluentBackgroundTransparencyChangedStatusMessage"),
      data.checked ? "on" : "off"
    );
    createScreenReaderAlert(screenReaderString, true);
  };

  const getLocalizedCaptionSize = () => {
    switch (settings.captionsSize) {
      case "small":
        return loc.getString(
          "PlaybackSettings.CaptionSettings.CaptionSize.Small"
        );
      case "medium":
        return loc.getString(
          "PlaybackSettings.CaptionSettings.CaptionSize.Medium"
        );
      case "large":
        return loc.getString(
          "PlaybackSettings.CaptionSettings.CaptionSize.Large"
        );
      default:
        return "";
    }
  };

  const getLocalizedCaptionColor = () => {
    switch (settings.captionsColor) {
      case "standard":
        return loc.getString("PlaybackSettings.CaptionSettings.Color.Standard");
      case "standard-reverse":
        return loc.getString(
          "PlaybackSettings.CaptionSettings.Color.StandardReverse"
        );
      case "purple":
        return loc.getString("PlaybackSettings.CaptionSettings.Color.Purple");
      case "purple-reverse":
        return loc.getString(
          "PlaybackSettings.CaptionSettings.Color.PurpleReverse"
        );
      default:
        return "";
    }
  };

  React.useLayoutEffect(() => {
    if (switchParentRef && switchParentRef.current) {
      switchParentRef.current.style.setProperty(
        "--colorNeutralForegroundOnBrand",
        NamedColors.Gray200
      );
    }
  }, []);

  function handleRevertToDefaultSettings(): void {
    revertToDefaultCaptionSettings();
    if (isRevertToDefaultConfirmationFixEnabled) {
      createScreenReaderAlert(
        loc.getString(
          "PlaybackSettings.CaptionSettings.RevertToDefaultConfirmation"
        ),
        true
      );
    }
    log.userAction("PlayerButtonAction", {
      name: "SelectDefaultCaptionSettings",
      playbackTimeSec: player.currentTimeInSeconds.value || -1,
      actionType: "LeftClick",
    });
  }

  // useAutoFocusOnFirstChildButton(autoFocusTarget);

  return (
    <MenuList
      dir={rtl ? "rtl" : "ltr"}
      className={styles.wideContainer}
      ref={autoFocusTarget}
    >
      {props.menuItemsToAddToTopOfSubmenu}
      <MenuItem
        aria-haspopup
        aria-label={
          isFluentMtcSubmenuAriaLabelFixEnabled
            ? `${loc.getString(
                "PlaybackSettings.CaptionSettings.Size"
              )} ${getLocalizedCaptionSize()}`
            : undefined
        }
        className={settingMenuItemStyle}
        // tslint:disable-next-line: jsx-no-lambda
        onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
          props.navigateTo("captionSize", actionTypeFromClick(event.type))
        }
      >
        <div
          className={settingButtonStyle}
          aria-hidden={isFluentMtcSubmenuAriaLabelFixEnabled}
        >
          <span>{loc.getString("PlaybackSettings.CaptionSettings.Size")}</span>
          <div
            // tslint:disable-next-line: jsx-ban-props
            style={{ display: "flex", alignItems: "center" }}
          >
            <span className={styles.itemTooltip}>
              {getLocalizedCaptionSize()}
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

      <MenuItem
        aria-haspopup
        aria-label={
          isFluentMtcSubmenuAriaLabelFixEnabled
            ? `${loc.getString(
                "PlaybackSettings.CaptionSettings.Color"
              )} ${getLocalizedCaptionColor()}`
            : undefined
        }
        className={settingMenuItemStyle}
        // tslint:disable-next-line: jsx-no-lambda
        onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
          props.navigateTo("captionColor", actionTypeFromClick(event.type))
        }
      >
        <div
          className={settingButtonStyle}
          aria-hidden={isFluentMtcSubmenuAriaLabelFixEnabled}
        >
          <span>{loc.getString("PlaybackSettings.CaptionSettings.Color")}</span>
          <div
            // tslint:disable-next-line: jsx-ban-props
            style={{ display: "flex", alignItems: "center" }}
          >
            <span className={styles.itemTooltip}>
              {getLocalizedCaptionColor()}
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

      <MenuItem className={settingMenuItemStyle}>
        <div className={settingButtonStyle} tabIndex={-1}>
          <span>
            {loc.getString(
              "PlaybackSettings.CaptionSettings.BackgroundTransparency"
            )}
          </span>
          {isFluentMtcSwitchRtlFixEnabled ? (
            <FluentProvider
              theme={webDarkTheme}
              // tslint:disable-next-line: jsx-ban-props
              style={{ background: "none" }}
              dir={rtl ? "rtl" : "ltr"}
            >
              <div
                ref={switchParentRef}
                // tslint:disable-next-line: jsx-ban-props
                style={{ display: "flex", alignItems: "center" }}
              >
                <span
                  className={styles.itemTooltip}
                  // tslint:disable-next-line: jsx-ban-props
                  style={{ marginRight: 8 }}
                >
                  {settings.captionsBackgroundTransparency
                    ? loc.getString("MediaSettingsToggleOn")
                    : loc.getString("MediaSettingsToggleOff")}
                </span>
                <Switch
                  aria-label={loc.getString(
                    "PlaybackSettings.CaptionSettings.BackgroundTransparencyAriaLabel"
                  )}
                  onKeyDown={handleSwitchKeyDown}
                  checked={settings.captionsBackgroundTransparency}
                  onChange={handleSwitchChange}
                />
              </div>
            </FluentProvider>
          ) : (
            <div
              ref={switchParentRef}
              // tslint:disable-next-line: jsx-ban-props
              style={{ display: "flex", alignItems: "center" }}
            >
              <span
                className={styles.itemTooltip}
                // tslint:disable-next-line: jsx-ban-props
                style={{ marginRight: 8 }}
              >
                {settings.captionsBackgroundTransparency
                  ? loc.getString("MediaSettingsToggleOn")
                  : loc.getString("MediaSettingsToggleOff")}
              </span>
              <Switch
                aria-label={loc.getString(
                  "PlaybackSettings.CaptionSettings.BackgroundTransparencyAriaLabel"
                )}
                onKeyDown={handleSwitchKeyDown}
                checked={settings.captionsBackgroundTransparency}
                onChange={handleSwitchChange}
              />
            </div>
          )}
        </div>
      </MenuItem>

      <MenuItem
        ref={lastItemRef}
        className={settingMenuItemStyle}
        onClick={handleRevertToDefaultSettings}
      >
        {loc.getString("PlaybackSettings.CaptionSettings.RevertToDefault")}
      </MenuItem>
    </MenuList>
  );
};
