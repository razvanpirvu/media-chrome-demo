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

import { submenuStyles } from "./Submenu.classNames";
import { useMenuSettings } from "../PlaybackSettings/PlaybackSettingsProvider";
import { usePlaybackExperienceContext } from "../MtcContextProvider";
import { ISubmenuProps } from "./submenus";
//   import { useAutoFocusOnFirstChildButton } from '@msstream/utilities-hooks';
import {
  createScreenReaderAlert,
  formatString,
} from "@msstream/shared-services";

export const CaptionSizeSubmenu: React.FunctionComponent<ISubmenuProps> = (
  props: ISubmenuProps
) => {
  const styles = submenuStyles();
  const autoFocusTarget = React.useRef<null | HTMLDivElement>(null);
  const { settings, updateSettings, logChangeSettingsAction } =
    useMenuSettings();
  const { loc, rtl, useBooleanSetting } = usePlaybackExperienceContext();
  const [checkedValues, setCheckedValues] = React.useState<
    Record<string, string[]>
  >({
    captionsSize: [settings.captionsSize],
  });
  const isFluentMenuItemRadioFixEnabled = useBooleanSetting(
    "isFluentMenuItemRadioFixEnabled"
  );
  const isHighContrastChangesEnabled = useBooleanSetting(
    "isHighContrastChangesEnabled"
  );

  const settingMenuItemStyle = isHighContrastChangesEnabled
    ? mergeClasses(
        styles.settingMenuItem,
        styles.settingMenuItemHighContrastFix
      )
    : styles.settingMenuItem;

  const onChange: MenuProps["onCheckedValueChange"] = (
    e: MenuCheckedValueChangeEvent,
    { name, checkedItems }: MenuCheckedValueChangeData
  ) => {
    const newCheckedItem = checkedItems[checkedItems.length - 1];
    if (newCheckedItem) {
      logChangeSettingsAction(
        "ChangeCaptionSize",
        settings.captionsSize,
        newCheckedItem
      );
      updateSettings({ ...settings, captionsSize: newCheckedItem });
      setCheckedValues(() => ({ [name]: [newCheckedItem] }));
      const screenReaderString = formatString(
        loc.getString("FluentCaptionsSizeChangedStatusMessage"),
        newCheckedItem
      );
      createScreenReaderAlert(screenReaderString, true);
    }
  };

  // useAutoFocusOnFirstChildButton(autoFocusTarget);

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const MenuItem: React.FC<{ value: string }> = ({ children, value }) =>
    isFluentMenuItemRadioFixEnabled ? (
      <MenuItemRadio
        className={settingMenuItemStyle}
        name="captionsSize"
        value={value}
      >
        {children}
      </MenuItemRadio>
    ) : (
      <MenuItemCheckbox
        className={settingMenuItemStyle}
        name="captionsSize"
        value={value}
      >
        {children}
      </MenuItemCheckbox>
    );

  return (
    <MenuList
      dir={rtl ? "rtl" : "ltr"}
      ref={autoFocusTarget}
      className={styles.wideContainer}
      checkedValues={checkedValues}
      onCheckedValueChange={onChange}
    >
      {props.menuItemsToAddToTopOfSubmenu}
      <MenuItem value="small">
        {loc.getString("PlaybackSettings.CaptionSettings.CaptionSize.Small")}
      </MenuItem>

      <MenuItem value="medium">
        {loc.getString("PlaybackSettings.CaptionSettings.CaptionSize.Medium")}
      </MenuItem>

      <MenuItem value="large">
        {loc.getString("PlaybackSettings.CaptionSettings.CaptionSize.Large")}
      </MenuItem>
    </MenuList>
  );
};
