import React, { Children, ReactElement, useMemo, useState } from 'react';
import { Wrapper } from "./GridSystem";
import type { MotionUIProps } from '../types';
import { useEnterMotion } from '../../motion';
import { useTheme } from '../../Theme';
import { cn } from '../../libs/cn';

export type TabPosition = "default" | "top" | "left" | "right" | "bottom";

/** Props for a single `<TabItem>` inside a `<Tab>`. */
interface TabItemProps {
    /** Tab header label (text or ReactNode). */
    label: React.ReactNode;
    /** Tab panel content. */
    children: React.ReactNode;
}

interface TabLayoutProps {
    menu: React.ReactNode;
    content: React.ReactNode;
}

type TabLayoutConfig = {
    shellClassName: string;
    menuClassName: string;
    contentClassName: string;
    itemClassName: string;
    triggerClassName: string;
    activeTriggerClassName: string;
    inactiveTriggerClassName: string;
};

/** Props for the `<Tab>` container. */
interface TabProps extends MotionUIProps {
    /** `<TabItem>` children that define the tabs. */
    children: React.ReactNode;
    /** 0-based index of the initially selected tab. Defaults to `0`. */
    defaultIndex?: number;
    /** Spatial layout of the tab bar: `"default"` (underline top), `"top"`, `"left"`, `"right"`, `"bottom"`. */
    layout?: TabPosition;
}

const TAB_LAYOUTS: Record<TabPosition, TabLayoutConfig> = {
    default: {
        shellClassName: "space-y-4",
        menuClassName: "flex flex-wrap items-end gap-2 border-b border-border/70",
        contentClassName: "min-w-0",
        itemClassName: "shrink-0",
        triggerClassName: "inline-flex items-center rounded-t-lg border-b-2 px-3 py-2 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        activeTriggerClassName: "border-primary text-foreground",
        inactiveTriggerClassName: "border-transparent text-muted-foreground hover:text-foreground hover:border-border/80",
    },
    top: {
        shellClassName: "space-y-4",
        menuClassName: "inline-flex max-w-full flex-wrap gap-2 rounded-xl bg-muted/50 p-1.5",
        contentClassName: "min-w-0",
        itemClassName: "shrink-0",
        triggerClassName: "inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        activeTriggerClassName: "bg-card text-foreground shadow-sm ring-1 ring-border/60",
        inactiveTriggerClassName: "text-muted-foreground hover:bg-background/80 hover:text-foreground",
    },
    left: {
        shellClassName: "flex flex-col gap-5 md:flex-row md:items-start",
        menuClassName: "flex shrink-0 gap-2 overflow-x-auto md:w-64 md:flex-col md:overflow-visible",
        contentClassName: "min-w-0 flex-1 rounded-2xl border border-border/60 bg-card p-4 shadow-sm",
        itemClassName: "shrink-0 md:w-full",
        triggerClassName: "inline-flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        activeTriggerClassName: "bg-primary text-primary-foreground shadow-sm",
        inactiveTriggerClassName: "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
    },
    right: {
        shellClassName: "flex flex-col gap-5 md:flex-row md:items-start",
        menuClassName: "order-1 flex shrink-0 gap-2 overflow-x-auto md:order-2 md:w-64 md:flex-col md:overflow-visible",
        contentClassName: "order-2 min-w-0 flex-1 rounded-2xl border border-border/60 bg-card p-4 shadow-sm md:order-1",
        itemClassName: "shrink-0 md:w-full",
        triggerClassName: "inline-flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        activeTriggerClassName: "bg-primary text-primary-foreground shadow-sm",
        inactiveTriggerClassName: "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
    },
    bottom: {
        shellClassName: "space-y-4",
        menuClassName: "flex flex-wrap gap-2 rounded-xl bg-muted/50 p-1.5",
        contentClassName: "min-w-0 rounded-2xl border border-border/60 bg-card p-4 shadow-sm",
        itemClassName: "shrink-0",
        triggerClassName: "inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        activeTriggerClassName: "bg-card text-foreground shadow-sm ring-1 ring-border/60",
        inactiveTriggerClassName: "text-muted-foreground hover:bg-background/80 hover:text-foreground",
    },
};

export function getTabLayoutConfig(layout: TabPosition): TabLayoutConfig {
    return TAB_LAYOUTS[layout];
}

export function getTabTriggerClassName(layout: TabPosition, active: boolean, className?: string) {
    const config = getTabLayoutConfig(layout);

    return cn(
        config.triggerClassName,
        active ? config.activeTriggerClassName : config.inactiveTriggerClassName,
        className,
    );
}

export function getTabPaneClassName(className?: string) {
    return cn("min-w-0", className);
}

export const TabLayouts: Record<TabPosition, (props: TabLayoutProps) => JSX.Element> = {
    default: ({menu, content}) => {
        const config = getTabLayoutConfig("default");
        return (
            <div className={config.shellClassName}>
                <div role="tablist" aria-orientation="horizontal" className={config.menuClassName}>{menu}</div>
                <div className={config.contentClassName}>{content}</div>
            </div>
        );
    },
    top: ({menu, content}) => {
        const config = getTabLayoutConfig("top");
        return (
            <div className={config.shellClassName}>
                <div role="tablist" aria-orientation="horizontal" className={config.menuClassName}>{menu}</div>
                <div className={config.contentClassName}>{content}</div>
            </div>
        );
    },
    left: ({menu, content}) => {
        const config = getTabLayoutConfig("left");
        return (
            <div className={config.shellClassName}>
                <div role="tablist" aria-orientation="vertical" className={config.menuClassName}>{menu}</div>
                <div className={config.contentClassName}>{content}</div>
            </div>
        );
    },
    right: ({menu, content}) => {
        const config = getTabLayoutConfig("right");
        return (
            <div className={config.shellClassName}>
                <div role="tablist" aria-orientation="vertical" className={config.menuClassName}>{menu}</div>
                <div className={config.contentClassName}>{content}</div>
            </div>
        );
    },
    bottom: ({menu, content}) => {
        const config = getTabLayoutConfig("bottom");
        return (
            <div className={config.shellClassName}>
                <div className={config.contentClassName}>{content}</div>
                <div role="tablist" aria-orientation="horizontal" className={config.menuClassName}>{menu}</div>
            </div>
        );
    },
};

export const TabItem: React.FC<TabItemProps> = () => null;

const TabPane = ({
    children,
    motion,
}: {
    children: React.ReactNode;
    motion?: MotionUIProps['motion'];
}) => {
    const theme = useTheme("tab");
    const style = useEnterMotion(undefined, motion ?? theme.Tab.motion?.enter ?? 'fadeUp', theme.Tab.motion?.enter ?? 'fadeUp');

    return (
        <div style={style} className={getTabPaneClassName()}>
            {children}
        </div>
    );
};

const Tab: React.FC<TabProps> = ({
    children,
    defaultIndex = 0,
    layout = "default",
    before = undefined,
    after = undefined,
    wrapperClassName = undefined,
    className = undefined,
    motion = undefined
}) => {
    const [active, setActive] = useState(defaultIndex);

    const items = Children.toArray(children)
        .filter((child): child is ReactElement<TabItemProps> =>
            React.isValidElement(child) && child.type === TabItem
        );

    const config = useMemo(() => getTabLayoutConfig(layout), [layout]);
    const TabLayout = TabLayouts[layout];

    return (
        <Wrapper className={wrapperClassName}>
            {before}
            <div className={cn("min-w-0", className)}>
                <TabLayout
                    menu={items.map((item, index) => (
                        <div key={index} className={config.itemClassName}>
                            <button
                                type="button"
                                role="tab"
                                aria-selected={index === active}
                                onClick={() => setActive(index)}
                                className={getTabTriggerClassName(layout, index === active)}
                            >
                                {item.props.label}
                            </button>
                        </div>
                    ))}
                    content={
                        <TabPane key={active} motion={motion}>
                            {items[active]?.props?.children}
                        </TabPane>
                    }
                />
            </div>
            {after}
        </Wrapper>
    );
};

export default Tab;
