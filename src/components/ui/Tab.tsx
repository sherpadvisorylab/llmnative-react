import React, { useState, Children, ReactElement } from 'react';
import { Wrapper } from "./GridSystem";
import type { MotionUIProps } from '../types';
import { useEnterMotion } from '../../motion';
import { useTheme } from '../../Theme';

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

/** Props for the `<Tab>` container. */
interface TabProps extends MotionUIProps {
    /** `<TabItem>` children that define the tabs. */
    children: React.ReactNode;
    /** 0-based index of the initially selected tab. Defaults to `0`. */
    defaultIndex?: number;
    /** Spatial layout of the tab bar: `"default"` (underline top), `"top"`, `"left"`, `"right"`, `"bottom"`. */
    layout?: TabPosition;
}

export const TabLayouts: Record<TabPosition, (props: TabLayoutProps) => JSX.Element> = {
    default: ({menu, content}) => (
        <>
            <ul className="nav nav-tabs mb-2">{menu}</ul>
            <div className="tab-content">{content}</div>
        </>
    ),
    top: ({menu, content}) => (
        <>
            <ul className="nav nav-pills mb-2">{menu}</ul>
            <div className="tab-content">{content}</div>
        </>
    ),
    left: ({menu, content}) => (
        <div className="flex">
            <ul className="nav nav-pills flex-col mr-2">{menu}</ul>
            <div className="tab-content flex-fill">{content}</div>
        </div>
    ),
    right: ({menu, content}) => (
        <div className="flex">
            <div className="tab-content flex-fill">{content}</div>
            <ul className="nav nav-pills flex-col ml-2">{menu}</ul>
        </div>
    ),
    bottom: ({menu, content}) => (
        <>
            <div className="tab-content">{content}</div>
            <ul className="nav nav-pills">{menu}</ul>
        </>
    )
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
        <div className="tab-pane fade show active" style={style}>
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

    const TabLayout = TabLayouts[layout];

    return (
        <Wrapper className={wrapperClassName}>
            {before}
            <div className={className}>
                <TabLayout
                    menu={items.map((item, index) => (
                        <li key={index} className="nav-item mr-1">
                            <button 
                               onClick={() => setActive(index)}
                               className={`nav-link ${index === active ? 'active' : ''}`}
                            >
                                {item.props.label}
                            </button>
                        </li>
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
