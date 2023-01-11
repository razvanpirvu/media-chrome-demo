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
import { NamedColors } from "../VolumeButtonAndSlider.classNames";
import React from "react";

import { useMenuSettings } from "../PlaybackSettings/PlaybackSettingsProvider";
import { usePlaybackExperienceContext } from "../MtcContextProvider";
import { ISubmenuProps } from "./submenus";
import { submenuStyles } from "./Submenu.classNames";
//   import { useAutoFocusOnFirstChildButton } from '@msstream/utilities-hooks';
import {
  createScreenReaderAlert,
  formatString,
} from "@msstream/shared-services";

interface IColorItemProps {
  primaryColor: string;
  secondaryColor: string;
  text: string;
}

const ColorItem: React.FC<IColorItemProps> = ({
  primaryColor,
  secondaryColor,
  text,
}: IColorItemProps) => {
  const styles = submenuStyles();
  return (
    <div className={styles.colorItemContainer}>
      <div
        className={styles.colorItemExternalDiv}
        // tslint:disable-next-line: jsx-ban-props
        style={{ backgroundColor: primaryColor }}
      >
        <div
          className={styles.colorItemInternalDiv}
          // tslint:disable-next-line: jsx-ban-props
          style={{ backgroundColor: secondaryColor }}
        />
      </div>
      {text}
    </div>
  );
};

export const CaptionColorSubmenu: React.FunctionComponent<ISubmenuProps> = (
  props: ISubmenuProps
) => {
  const styles = submenuStyles();
  const { settings, updateSettings, logChangeSettingsAction } =
    useMenuSettings();
  const { loc, rtl, useBooleanSetting } = usePlaybackExperienceContext();
  const [checkedValues, setCheckedValues] = React.useState<
    Record<string, string[]>
  >({
    captionsColor: [settings.captionsColor],
  });
  const autoFocusTarget = React.useRef<null | HTMLDivElement>(null);
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
    _: MenuCheckedValueChangeEvent,
    { name, checkedItems }: MenuCheckedValueChangeData
  ) => {
    const newCheckedItem = checkedItems[checkedItems.length - 1];
    if (newCheckedItem) {
      logChangeSettingsAction(
        "ChangeCaptionColor",
        settings.captionsColor,
        newCheckedItem
      );
      updateSettings({ ...settings, captionsColor: newCheckedItem });
      setCheckedValues(() => ({ [name]: [newCheckedItem] }));
      const screenReaderString = formatString(
        loc.getString("FluentCaptionsColorChangedStatusMessage"),
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
        name="captionsColor"
        value={value}
      >
        {children}
      </MenuItemRadio>
    ) : (
      <MenuItemCheckbox
        className={settingMenuItemStyle}
        name="captionsColor"
        value={value}
      >
        {children}
      </MenuItemCheckbox>
    );

  return (
    <MenuList
      dir={rtl ? "rtl" : "ltr"}
      className={styles.wideContainer}
      checkedValues={checkedValues}
      onCheckedValueChange={onChange}
      ref={autoFocusTarget}
    >
      {props.menuItemsToAddToTopOfSubmenu}
      <MenuItem value="standard">
        <ColorItem
          primaryColor={NamedColors.Gray190}
          secondaryColor={NamedColors.White}
          text={loc.getString(
            "PlaybackSettings.CaptionSettings.Color.Standard"
          )}
        />
      </MenuItem>

      <MenuItem value="standard-reverse">
        <ColorItem
          primaryColor={NamedColors.White}
          secondaryColor={NamedColors.Gray190}
          text={loc.getString(
            "PlaybackSettings.CaptionSettings.Color.StandardReverse"
          )}
        />
      </MenuItem>

      <MenuItem value="purple">
        <ColorItem
          primaryColor={NamedColors.Purple}
          secondaryColor={NamedColors.White}
          text={loc.getString("PlaybackSettings.CaptionSettings.Color.Purple")}
        />
      </MenuItem>

      <MenuItem value="purple-reverse">
        <ColorItem
          primaryColor={NamedColors.White}
          secondaryColor={NamedColors.Purple}
          text={loc.getString(
            "PlaybackSettings.CaptionSettings.Color.PurpleReverse"
          )}
        />
      </MenuItem>
    </MenuList>
  );
};
