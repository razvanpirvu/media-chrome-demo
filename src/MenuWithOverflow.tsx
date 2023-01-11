// -----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
// Copyright (c) Microsoft Corporation. All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
import React from "react";
import { menuWithOverflowStyles } from "./MenuWithOverflow.classNames";
import { useArrowNavigationGroup } from "@fluentui/react-components";
import { MoreHorizontal20Regular } from "@fluentui/react-icons";
// import { throttle } from '@msstream/shared-services';

import {
  IObservableProperty,
  IReadOnlyObservableProperty,
} from "@msstream/components-oneplayer-typings";
import { SubmenuButton } from "./SubmenuButton/SubmenuButton";
import { usePlaybackExperienceContext } from "./MtcContextProvider";
import { SubmenuName } from "./Submenus/submenus";

export interface ISubmenu {
  buttonTitle?: string;
  buttonIcon?: JSX.Element;
  buttonContents?: JSX.Element;
  buttonAriaLabel: string;
  buttonAriaDescription?: string;
  submenuToOpen: SubmenuName;
  displayChevron?: boolean;
}

export interface IOverflowableButton {
  key: string;
  subMenu?: ISubmenu;
  render: (inOverflowMenu: boolean) => JSX.Element;
  isVisible?: IReadOnlyObservableProperty<boolean>;
}

export interface IMenuWithOverflowProps {
  children: IOverflowableButton[];
  childWidth: number;
  container: HTMLElement;
  mtcMenuOpen: IObservableProperty<boolean>;
  menuAriaLabel?: string;
  tooltipMountNode?: HTMLDivElement;
}

/**
 * A component that takes a collection of children and displays them in a list,
 * and displays an overflow menu if there is not sufficient space for the
 * children, moving some of children into the overflow menu. It also allows for
 * buttons in the overflow menu to take over the menu instead of popping up
 * their flyouts on top of it. It currently assumes the list is displayed in the
 * horizontal orientation, but it could take the direction in as a prop when the
 * need arises.
 */
export const MenuWithOverflow: React.FunctionComponent<
  IMenuWithOverflowProps
> = (props: IMenuWithOverflowProps) => {
  const menuStyles = menuWithOverflowStyles();
  const { loc, overflowButtons, useBooleanSetting } =
    usePlaybackExperienceContext();
  const attrs = useArrowNavigationGroup({
    axis: "horizontal",
    memorizeCurrent: true,
  });
  const [regularItems, setRegularItems] = React.useState<IOverflowableButton[]>(
    []
  );
  const [visibleChildren, setVisibleChildren] = React.useState<
    IOverflowableButton[]
  >([]);
  const [containerWidth, setContainerWidth] = React.useState<number>(0);

  // Examine the children and figure out which are visible, and subscribe to changes in their visible state
  React.useEffect(() => {
    const updateVisibleChildrenList = (): void => {
      setVisibleChildren(
        props.children.filter(
          (child: IOverflowableButton) =>
            child.isVisible === undefined || child.isVisible.value
        )
      );
    };

    // Subscribe to changes of the isVisible property of all of the children
    const unsubscribers: (() => void)[] = [];
    for (const child of props.children) {
      if (child.isVisible !== undefined) {
        unsubscribers.push(
          child.isVisible.subscribe(updateVisibleChildrenList)
        );
      }
    }

    // Update our list of the ones that are visible now
    updateVisibleChildrenList();

    // If the list of children changes, unsubscribe from previous change notifications
    return () => {
      for (const unsubscriber of unsubscribers) {
        unsubscriber();
      }
    };
  }, [props.children]);

  // Subscribe to size changes on props.container and set the containerWidth state
  //   React.useEffect(() => {
  //     const onResize = () => {
  //       // Needed to break the appearance of an infinite loop, since resize events trigger layout updates which can trigger the resize event.
  //       // ResizeObserver would see this and throw an "ResizeObserver loop limit exceeded" error.
  //       setTimeout(() => {
  //         setContainerWidth(props.container.clientWidth);
  //       }, 0);
  //     };

  //     const throttledOnResize = throttle(onResize, 200);
  //     const resizeObserver = new ResizeObserver(throttledOnResize);
  //     resizeObserver.observe(props.container);

  //     return () => {
  //       resizeObserver.disconnect();
  //     };
  //   }, [props.container]);

  // Do the math to decide which children go into the overflow and which do not
  React.useEffect(() => {
    let itemsThatWillFit = Number.MAX_VALUE;
    if (containerWidth > 0) {
      itemsThatWillFit = Math.floor(containerWidth / props.childWidth);
    }
    // Note that when all items won't fit, we have to move one extra into the overflow to make room for the ... button
    const overflowItemCount =
      itemsThatWillFit >= visibleChildren.length
        ? 0
        : visibleChildren.length - itemsThatWillFit + 1;

    const newOverflowItemList: IOverflowableButton[] = [];
    const newRegularItemList: IOverflowableButton[] = [];

    for (
      let index = 0;
      index < overflowItemCount && index < visibleChildren.length;
      index++
    ) {
      newOverflowItemList.push(visibleChildren[index]);
    }
    for (
      let index = overflowItemCount;
      index < visibleChildren.length;
      index++
    ) {
      newRegularItemList.push(visibleChildren[index]);
    }

    setRegularItems(newRegularItemList);
    overflowButtons.value = newOverflowItemList;
  }, [containerWidth, props.childWidth, visibleChildren]);

  const isFluentMtcOverflowTooltipFixEnabled = useBooleanSetting(
    "isFluentMtcOverflowTooltipFixEnabled"
  );

  return (
    <div
      className={menuStyles.container}
      role="menubar"
      aria-label={props.menuAriaLabel}
      {...attrs}
    >
      {overflowButtons.value.length > 0 && (
        <SubmenuButton
          mtcMenuOpen={props.mtcMenuOpen}
          tooltipMountNode={
            isFluentMtcOverflowTooltipFixEnabled
              ? props.tooltipMountNode
              : undefined
          }
          buttonContents={<MoreHorizontal20Regular />}
          tooltipText={loc.getString("PlaybackExperienceOverflowButtonTooltip")}
          ariaLabel={loc.getString("PlaybackExperienceOverflowButtonAriaLabel")}
          initalSubmenu="overflowMenu"
          openUserActionName="OpenOverflowMenu"
          closeUserActionName="CloseOverflowMenu"
          popoverClassName={menuStyles.overflowPopover}
        />
      )}
      {regularItems.map((button: IOverflowableButton) => (
        // tslint:disable-next-line: jsx-ban-props
        <div style={{ width: props.childWidth }} key={button.key}>
          {button.render(false)}
        </div>
      ))}
    </div>
  );
};
