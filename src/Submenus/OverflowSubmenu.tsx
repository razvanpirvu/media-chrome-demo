// -----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
// Copyright (c) Microsoft Corporation. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import {
  Button,
  MenuGroup,
  MenuList,
  mergeClasses,
} from "@fluentui/react-components";
import {
  ChevronLeft20Regular,
  ChevronRight20Regular,
} from "@fluentui/react-icons";
import React from "react";
import { CssVarNames, submenuStyles } from "./Submenu.classNames";
import { usePlaybackExperienceContext } from "../MtcContextProvider";
import { ISubmenuProps } from "./submenus";
import { IOverflowableButton } from "../MenuWithOverflow";
// import { useReadOnlyObservable } from '@msstream/utilities-hooks';
import { mtcComponentsStyles } from "../mtcComponents.classNames";
import { playbackExperienceStyles } from "../PlaybackExperience.classNames";
import { actionTypeFromClick } from "../telemetryUtilities";
// import { useAutoFocusOnFirstChildButton } from '@msstream/utilities-hooks';
import { mtcHeightWithPadding } from "../shared.utils";

export const OverflowSubmenu: React.FunctionComponent<ISubmenuProps> = (
  props: ISubmenuProps
) => {
  const resolvedCSSVars: Record<string, string> = {};
  const mtcStyles = mtcComponentsStyles();
  const peStyles = playbackExperienceStyles();
  const { rtl, overflowButtons, playerContainer, useBooleanSetting } =
    usePlaybackExperienceContext();
  const [overflowButtonsValue] = React.useState(overflowButtons);
  const styles = submenuStyles();
  const autoFocusTarget = React.useRef<null | HTMLDivElement>(null);
  const isOverflowSubmenuChevronsEnabled = useBooleanSetting(
    "isOverflowSubmenuChevronsEnabled"
  );
  const isHighContrastChangesEnabled = useBooleanSetting(
    "isHighContrastChangesEnabled"
  );

  resolvedCSSVars[`${CssVarNames.playerContainerHeight}`] = `${
    playerContainer.clientHeight - mtcHeightWithPadding
  }px`;
  //   useAutoFocusOnFirstChildButton(autoFocusTarget);

  const buttonClassNames = mergeClasses(
    mtcStyles.buttonStyle,
    peStyles.buttonInOverflow,
    isHighContrastChangesEnabled && mtcStyles.buttonStyleHighContrastFix
  );

  return (
    <MenuList
      className={styles.container}
      ref={autoFocusTarget}
      dir={rtl ? "rtl" : "ltr"}
      // tslint:disable-next-line: jsx-ban-props
      style={{ ...resolvedCSSVars } as React.CSSProperties}
    >
      {overflowButtonsValue.value.map((button: IOverflowableButton) => {
        if (button.subMenu) {
          const onClick = (
            event: React.MouseEvent<HTMLButtonElement, MouseEvent>
          ) => {
            button.subMenu &&
              props.navigateTo(
                button.subMenu.submenuToOpen,
                actionTypeFromClick(event.type)
              );
          };

          return (
            <MenuGroup>
              <Button
                key={button.key}
                role="menuitemcheckbox"
                aria-label={button.subMenu.buttonAriaLabel}
                className={buttonClassNames}
                appearance="transparent"
                icon={button.subMenu.buttonIcon}
                onClick={onClick}
                aria-description={button.subMenu.buttonAriaDescription}
              >
                {button.subMenu.buttonContents || button.subMenu.buttonTitle}
                {isOverflowSubmenuChevronsEnabled &&
                button.subMenu.displayChevron ? (
                  rtl ? (
                    <ChevronLeft20Regular
                      // tslint:disable-next-line: jsx-ban-props
                      style={{ marginRight: "auto", marginLeft: "0px" }}
                    />
                  ) : (
                    <ChevronRight20Regular
                      // tslint:disable-next-line: jsx-ban-props
                      style={{ marginLeft: "auto", marginRight: "0px" }}
                    />
                  )
                ) : null}
              </Button>
            </MenuGroup>
          );
        } else {
          return <div key={button.key}>{button.render(true)}</div>;
        }
      })}
    </MenuList>
  );
};
