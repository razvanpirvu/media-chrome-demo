// -----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
// Copyright (c) Microsoft Corporation. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import {
  MenuCheckedValueChangeData,
  MenuCheckedValueChangeEvent,
  MenuItemCheckbox,
  MenuItemRadio,
  MenuList,
  MenuProps,
} from "@fluentui/react-components";

import React from "react";

import { TextTrack } from "@msstream/components-oneplayer-typings";
import {
  createScreenReaderAlert,
  formatString,
} from "@msstream/shared-services";
import { useMenuSettings } from "../PlaybackSettings/PlaybackSettingsProvider";
import { usePlaybackExperienceContext } from "../MtcContextProvider";
import { ISubmenuProps } from "./submenus";
import { CssVarNames, submenuStyles } from "./Submenu.classNames";
//   import { useReadOnlyObservable } from '@msstream/utilities-hooks';
//   import { useAutoFocusOnFirstChildButton } from '@msstream/utilities-hooks';
import { actionTypeFromClick } from "../telemetryUtilities";
import { mtcHeightWithPadding } from "../shared.utils";

export const CaptionTrackSubmenu: React.FunctionComponent<ISubmenuProps> = (
  props: ISubmenuProps
) => {
  const resolvedCSSVars: Record<string, string> = {};
  const styles = submenuStyles();
  const { settings, updateSettings } = useMenuSettings();
  const { loc, log, rtl, player, playerContainer, useBooleanSetting } =
    usePlaybackExperienceContext();
  const isFluentMenuItemRadioFixEnabled = useBooleanSetting(
    "isFluentMenuItemRadioFixEnabled"
  );
  const isAutoFocusOnMenuOpenFixEnabled = useBooleanSetting(
    "isAutoFocusOnMenuOpenFixEnabled"
  );
  const isFocusSubmenuButtonFixEnabled = useBooleanSetting(
    "isFocusSubmenuButtonFixEnabled"
  );

  const [ccTracks] = React.useState(player.textTracks);
  const [activeTextTrack] = React.useState(player.activeTextTrack);

  const [checkedValues, setCheckedValues] = React.useState<
    Record<string, string[]>
  >(() => {
    if (activeTextTrack) {
      return {
        captions: [activeTextTrack.value?.label!],
      };
    }

    return {
      captions: ["off"],
    };
  });

  const logCaptionChange = (newOption: string): void => {
    log.userAction("PlayerButtonAction", {
      name: newOption === "off" ? "CaptionsOff" : "CaptionsOn",
      playbackTimeSec: player.currentTimeInSeconds.value || -1,
      actionType: "LeftClick",
    });
  };

  React.useEffect(() => {
    let newLabel = "off";
    if (activeTextTrack) {
      newLabel = activeTextTrack.value?.label!;
    }
    setCheckedValues({
      captions: [newLabel],
    });
  }, [activeTextTrack]);

  const onChange: MenuProps["onCheckedValueChange"] = (
    _: MenuCheckedValueChangeEvent,
    { name, checkedItems }: MenuCheckedValueChangeData
  ) => {
    const newCheckedItem = checkedItems[checkedItems.length - 1];
    if (newCheckedItem) {
      if (newCheckedItem === "off") {
        updateSettings({ ...settings, captionTrackLabel: "off" });
      } else {
        const index = ccTracks.value.findIndex(
          (track: TextTrack) => track.label === newCheckedItem
        );
        updateSettings({
          ...settings,
          captionTrackLabel: player.textTracks.value[index].label,
        });
      }

      logCaptionChange(newCheckedItem);
      const screenReaderString = formatString(
        loc.getString("FluentCaptionsChangedStatusMessage"),
        newCheckedItem
      );
      createScreenReaderAlert(screenReaderString, true);
    }

    // close submenu on change
    if (props.updateMenuOpenState) {
      props.updateMenuOpenState(false, actionTypeFromClick(_.type));

      if (isFocusSubmenuButtonFixEnabled) {
        props.focusSubmenuButton?.();
      }
    }
  };

  resolvedCSSVars[`${CssVarNames.playerContainerHeight}`] = `${
    playerContainer.clientHeight - mtcHeightWithPadding
  }px`;

  let menuRef = React.useRef<null | HTMLDivElement>(null);
  if (!isAutoFocusOnMenuOpenFixEnabled) {
    menuRef = React.createRef<HTMLDivElement>();
  }
  // useAutoFocusOnFirstChildButton(menuRef);

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const MenuItem: React.FC<{ value: string }> = ({ children, value }) =>
    isFluentMenuItemRadioFixEnabled ? (
      <MenuItemRadio
        className={styles.captionsMenuItem}
        name="captions"
        value={value}
      >
        {children}
      </MenuItemRadio>
    ) : (
      <MenuItemCheckbox
        className={styles.captionsMenuItem}
        name="captions"
        value={value}
      >
        {children}
      </MenuItemCheckbox>
    );

  return (
    <MenuList
      className={styles.container}
      ref={menuRef}
      dir={rtl ? "rtl" : "ltr"}
      checkedValues={checkedValues}
      onCheckedValueChange={onChange}
      // tslint:disable-next-line: jsx-ban-props
      style={{ ...resolvedCSSVars } as React.CSSProperties}
    >
      {props.menuItemsToAddToTopOfSubmenu}
      <MenuItem value="off">{loc.getString("MediaSettingsToggleOff")}</MenuItem>

      {ccTracks.value.map((track: TextTrack) => (
        <MenuItem value={track.label} key={track.label}>
          {track.label}
        </MenuItem>
      ))}
    </MenuList>
  );
};
