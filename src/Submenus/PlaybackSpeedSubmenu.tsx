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
  mergeClasses,
} from "@fluentui/react-components";
import React from "react";

import { useMenuSettings } from "../PlaybackSettings/PlaybackSettingsProvider";
import { usePlaybackExperienceContext } from "../MtcContextProvider";
import { playbackSpeedStyles } from "../PlaybackSpeed/PlaybackSpeed.classNames";
//   import { useReadOnlyObservable } from '@msstream/utilities-hooks';
import { ISubmenuProps } from "./submenus";
//   import { useAutoFocusOnFirstChildButton } from '@msstream/utilities-hooks';
import {
  createScreenReaderAlert,
  formatString,
} from "@msstream/shared-services";
import { CssVarNames, submenuStyles } from "./Submenu.classNames";
import { actionTypeFromClick } from "../telemetryUtilities";
import { mtcHeightWithPadding } from "../shared.utils";

// if rate is 1 or 2, do not put a space (' ') in the aria label because Voice Access does not understand.
const getPlaybackspeedAriaLabel = (value: string) =>
  value === "1" || value === "2" ? `${value}x` : `${value} x`;

export const PlaybackSpeedSubmenu: React.FunctionComponent<ISubmenuProps> = (
  props: ISubmenuProps
) => {
  const resolvedCSSVars: Record<string, string> = {};
  const loadedPlaybackSpeedStyles = playbackSpeedStyles();
  const sharedStyles = submenuStyles();
  const { settings, updateSettings, logChangeSettingsAction } =
    useMenuSettings();
  const { loc, rtl, player, playerContainer, useBooleanSetting } =
    usePlaybackExperienceContext();
  const [playbackRate] = React.useState(player.playbackRate);
  const [checkedValues, setCheckedValues] = React.useState<
    Record<string, string[]>
  >(() => {
    if (settings.playbackSpeed) {
      return {
        playbackspeed: [settings.playbackSpeed],
      };
    }

    return {
      playbackspeed: [player.playbackRate.value.toString()],
    };
  });
  const isFluentMenuItemRadioFixEnabled = useBooleanSetting(
    "isFluentMenuItemRadioFixEnabled"
  );
  const isHighContrastChangesEnabled = useBooleanSetting(
    "isHighContrastChangesEnabled"
  );
  const isAutoFocusOnMenuOpenFixEnabled = useBooleanSetting(
    "isAutoFocusOnMenuOpenFixEnabled"
  );
  const isFocusSubmenuButtonFixEnabled = useBooleanSetting(
    "isFocusSubmenuButtonFixEnabled"
  );

  const menuItemStyle = isHighContrastChangesEnabled
    ? mergeClasses(
        loadedPlaybackSpeedStyles.menuItem,
        loadedPlaybackSpeedStyles.menuItemHighContrastFix
      )
    : loadedPlaybackSpeedStyles.menuItem;

  const onChange: MenuProps["onCheckedValueChange"] = (
    _: MenuCheckedValueChangeEvent,
    { name, checkedItems }: MenuCheckedValueChangeData
  ) => {
    const newCheckedItem = checkedItems[checkedItems.length - 1];
    if (newCheckedItem) {
      logChangeSettingsAction(
        "ChangePlaybackSpeed",
        `${settings.playbackSpeed ? settings.playbackSpeed : "1"}x`,
        `${newCheckedItem}x`
      );
      updateSettings({ ...settings, playbackSpeed: newCheckedItem });
      player.playbackRate.value = Number.parseFloat(newCheckedItem);
      const screenReaderString = formatString(
        loc.getString("FluentPlaybackSpeedChangedStatusMessage"),
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

  React.useEffect(() => {
    setCheckedValues(() => ({ playbackspeed: [playbackRate.toString()] }));
  }, [playbackRate]);

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
        className={menuItemStyle}
        name="playbackspeed"
        value={value}
        aria-label={getPlaybackspeedAriaLabel(value)}
      >
        {children}
      </MenuItemRadio>
    ) : (
      <MenuItemCheckbox
        className={menuItemStyle}
        name="playbackspeed"
        value={value}
        aria-label={getPlaybackspeedAriaLabel(value)}
      >
        {children}
      </MenuItemCheckbox>
    );

  return (
    <MenuList
      ref={menuRef}
      checkedValues={checkedValues}
      dir={rtl ? "rtl" : "ltr"}
      onCheckedValueChange={onChange}
      className={sharedStyles.container}
      // tslint:disable-next-line: jsx-ban-props
      style={{ ...resolvedCSSVars } as React.CSSProperties}
    >
      {props.menuItemsToAddToTopOfSubmenu}
      <MenuItem value="2">2x</MenuItem>
      <MenuItem value="1.8">1.8x</MenuItem>
      <MenuItem value="1.5">1.5x</MenuItem>
      <MenuItem value="1.2">1.2x</MenuItem>
      <MenuItem value="1">1x</MenuItem>
      <MenuItem value="0.5">0.5x</MenuItem>
    </MenuList>
  );
};
