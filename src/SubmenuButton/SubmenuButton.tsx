// -----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
// Copyright (c) Microsoft Corporation. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------

import {
  Button,
  Menu,
  MenuOpenChangeData,
  MenuOpenEvents,
  MenuPopover,
  MenuProps,
  MenuTrigger,
  Tooltip,
  OnVisibleChangeData,
  MenuDivider,
  MenuGroup,
  mergeClasses,
} from "@fluentui/react-components";
// import { throttle } from "@msstream/shared-services";
import { IObservableProperty } from "@msstream/components-oneplayer-typings";
import React from "react";

import { mtcComponentsStyles } from "../mtcComponents.classNames";
import { submenuButtonStyles } from "./SubmenuButton.classNames";
import { usePlaybackExperienceContext } from "../MtcContextProvider";
import { playbackExperienceStyles } from "../PlaybackExperience.classNames";
import {
  getBackButtonAriaDescriptionStringName,
  getSubmenuCloseUserActionName,
  getSubmenuOpenUserActionName,
  getSubMenuTitleStringName,
  ISubmenuProps,
  renderSubmenu,
  SubmenuName,
} from "../Submenus/submenus";

import {
  ChevronLeft20Regular,
  ChevronRight20Regular,
} from "@fluentui/react-icons";
import { ActionType } from "@msstream/components-base-telemetry-typings";
import { actionTypeFromClick } from "../telemetryUtilities";
import { CssVarNames } from "../Submenus/Submenu.classNames";
import { mtcHeightWithPadding } from "../shared.utils";

interface ISubmenuButtonProps {
  tooltipMountNode?: HTMLDivElement;
  icon?: JSX.Element;
  buttonContents?: JSX.Element;
  tooltipText: string;
  ariaLabel: string;
  ariaDescription?: string;
  initalSubmenu: SubmenuName;
  openUserActionName: string;
  closeUserActionName: string;
  mtcMenuOpen: IObservableProperty<boolean>; // This boolean indicates if any MTC menu is open
  popoverClassName: string;
  buttonRef?: React.MutableRefObject<HTMLButtonElement | null>;
}

/**
 * A button that draws a submenu when clicked. Submenus support multiple pages.
 * MenuWithOverflow uses one of these to render the ... overflow menu, which
 * itself is a submenu. This is how submenus, such as settings, can reuse the
 * overflow popout menu per the design.
 */
const SubmenuButtonComponent: React.FunctionComponent<ISubmenuButtonProps> = (
  props: ISubmenuButtonProps
) => {
  const resolvedCSSVars: Record<string, string> = {};
  const [submenuStack, setSubmenuStack] = React.useState<SubmenuName[]>([
    props.initalSubmenu,
  ]);
  const currentSubmenu = submenuStack[submenuStack.length - 1];
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  //   const { loc, log, rtl, player, playerContainer, useBooleanSetting } =
  //     usePlaybackExperienceContext();

  // resolvedCSSVars[`${CssVarNames.playerContainerHeight}`] = `${
  //     playerContainer.clientHeight - mtcHeightWithPadding
  //   }px`;

  const [open, setOpen] = React.useState(false);
  const [showTooltip, setShowTooltip] = React.useState(false);

  const subStyles = submenuButtonStyles();
  const peStyles = playbackExperienceStyles();
  const mtcStyles = mtcComponentsStyles();
  const inOverflowMenu = props.initalSubmenu === "overflowMenu";

  const isHighContrastChangesEnabled = false;
  const isFocusSubmenuButtonFixEnabled = false;

  let menuTriggerRef = props.buttonRef;
  if (isFocusSubmenuButtonFixEnabled) {
    menuTriggerRef = props.buttonRef ?? buttonRef;
  }

  let menuTriggerStyle: string;
  let backButtonStyle: string;
  if (isHighContrastChangesEnabled) {
    menuTriggerStyle = mergeClasses(
      peStyles.menuTrigger,
      peStyles.menuTriggerHighContrastFix
    );
    backButtonStyle = mergeClasses(
      subStyles.backButtonStyle,
      subStyles.backButtonHighContrastFix
    );
  } else {
    menuTriggerStyle =
      currentSubmenu === "playbackSpeed"
        ? mergeClasses(peStyles.menuTrigger, peStyles.textMenuTrigger)
        : mergeClasses(peStyles.menuTrigger, peStyles.iconMenuTrigger);
    backButtonStyle = subStyles.backButtonStyle;
  }

  //   React.useEffect(() => {
  //     const onResize = () => {
  //       setOpen(false);

  //       setSubmenuStack([props.initalSubmenu]);
  //       setShowTooltip(false);
  //     };

  //     const throttledResize = throttle(onResize, 200);

  //     const mtcResizeObserver = new ResizeObserver(throttledResize);
  //     mtcResizeObserver.observe(playerContainer);

  //     return () => {
  //       mtcResizeObserver.disconnect();
  //     };
  //   }, []);

  const focusSubmenuButton = React.useCallback(() => {
    menuTriggerRef?.current?.focus();
  }, [buttonRef, props.buttonRef]);

  function navigateBack(actionType: ActionType): void {
    const newStack = submenuStack.slice(0, -1);
    setSubmenuStack(newStack);
  }

  function navigateTo(newSubmenu: SubmenuName, actionType: ActionType): void {
    const newStack = submenuStack.slice();
    newStack.push(newSubmenu);
    setSubmenuStack(newStack);
  }

  const onOpenChange: MenuProps["onOpenChange"] = (
    e: MenuOpenEvents,
    data: MenuOpenChangeData
  ) => {
    // We need to stop propagation only for keyboard events so 'Esc' only closes
    // our menu and not the whole OneUp overlay.
    if (e.type !== "click") {
      e.stopPropagation();
    }
    const eAsKeyboardEvent: React.KeyboardEvent<HTMLElement> =
      e as React.KeyboardEvent<HTMLElement>;
    // If the user is in a submenu, handle ESC key navigation to go back to
    // the parent menu instead of closing the menu popover
    if (
      e.type === "keydown" &&
      eAsKeyboardEvent.nativeEvent &&
      // tslint:disable-next-line: triple-equals
      eAsKeyboardEvent.nativeEvent.key == "Escape" &&
      submenuStack.length > 1
    ) {
      e.preventDefault();
      navigateBack("KeyDown");
    } else {
      const actionType = actionTypeFromClick(e.type);
      updateMenuOpenState(data.open, actionType);
    }
  };

  const updateMenuOpenState = (openMenu: boolean, actionType: ActionType) => {
    setOpen(openMenu);
    // props.mtcMenuOpen.value = openMenu;
    if (openMenu) {
    } else {
      // The user might be closing the popover by clicking outside, so we need to reset the navigation stack here
      // Log close for all submenu in the stack

      setSubmenuStack([props.initalSubmenu]);
      setShowTooltip(false);
    }
  };

  function renderPopover(): JSX.Element {
    let menuItemsToAddToTopOfSubmenu: JSX.Element[] = [];
    if (submenuStack.length > 1) {
      const onBackButtonClick = (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
      ) => {
        navigateBack(actionTypeFromClick(event.type));
      };
      menuItemsToAddToTopOfSubmenu = [
        <MenuGroup key="submenu title group">
          <Button
            aria-label={`${getSubMenuTitleStringName(
              currentSubmenu
            )}, ${getBackButtonAriaDescriptionStringName(currentSubmenu)}`}
            className={backButtonStyle}
            key="Back Button"
            onClick={onBackButtonClick}
            icon={<ChevronRight20Regular />}
          >
            {getSubMenuTitleStringName(currentSubmenu)}
          </Button>
        </MenuGroup>,
        <MenuDivider key="Divider" className={subStyles.dividerStyle} />,
      ];
    }
    const submenuProps: ISubmenuProps = {
      navigateBack,
      navigateTo,
      menuItemsToAddToTopOfSubmenu,
      focusSubmenuButton,
    };

    if (
      currentSubmenu === "playbackSpeed" ||
      currentSubmenu === "captionTrack"
    ) {
      submenuProps.updateMenuOpenState = updateMenuOpenState;
    }
    return renderSubmenu(currentSubmenu, submenuProps);
  }

  return (
    <Menu
      inline
      persistOnItemClick
      open={open}
      onOpenChange={onOpenChange}
      openOnHover={false}
      positioning={
        "above"
        // inOverflowMenu && currentSubmenu === "captionSettings"
        //   ? { flipBoundary: playerContainer, position: "above" }
        //   : "above"
      }
    >
      <Tooltip
        withArrow
        content={{ className: mtcStyles.tooltip, children: props.tooltipText }}
        relationship="label"
        mountNode={props.tooltipMountNode}
        // tslint:disable-next-line: jsx-no-lambda
        onVisibleChange={(
          _ev:
            | React.FocusEvent<HTMLElement>
            | React.PointerEvent<HTMLElement>
            | undefined,
          data: OnVisibleChangeData
        ) => setShowTooltip(data.visible)}
        visible={showTooltip && !open}
      >
        <MenuTrigger>
          <Button
            ref={menuTriggerRef}
            role="menuitem"
            aria-label={props.ariaLabel}
            aria-description={props.ariaDescription}
            className={menuTriggerStyle}
            appearance="transparent"
            aria-expanded={open}
            icon={props.icon}
          >
            {props.buttonContents}
          </Button>
        </MenuTrigger>
      </Tooltip>
      <MenuPopover
        className={props.popoverClassName}
        // tslint:disable-next-line: jsx-ban-props
        style={
          inOverflowMenu
            ? ({
                ...resolvedCSSVars,
                maxWidth: "max-content",
                overflow: "hidden",
              } as React.CSSProperties)
            : ({ ...resolvedCSSVars } as React.CSSProperties)
        }
      >
        {renderPopover()}
      </MenuPopover>
    </Menu>
  );
};

export const SubmenuButton = React.memo(
  SubmenuButtonComponent,
  (
    prevProps: Readonly<React.PropsWithChildren<ISubmenuButtonProps>>,
    nextProps: Readonly<React.PropsWithChildren<ISubmenuButtonProps>>
  ) => {
    return (
      prevProps.icon?.type.displayName === nextProps.icon?.type.displayName &&
      prevProps.buttonContents?.key === nextProps.buttonContents?.key &&
      prevProps.tooltipMountNode === nextProps.tooltipMountNode &&
      prevProps.tooltipText === nextProps.tooltipText &&
      prevProps.ariaLabel === nextProps.ariaLabel &&
      prevProps.ariaDescription === nextProps.ariaDescription &&
      prevProps.initalSubmenu === nextProps.initalSubmenu &&
      prevProps.openUserActionName === nextProps.openUserActionName &&
      prevProps.closeUserActionName === nextProps.closeUserActionName &&
      prevProps.mtcMenuOpen === nextProps.mtcMenuOpen &&
      prevProps.popoverClassName === nextProps.popoverClassName &&
      prevProps.buttonRef === nextProps.buttonRef
    );
  }
);
