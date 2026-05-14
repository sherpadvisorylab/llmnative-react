import React, { useState, Children, ReactElement } from 'react';
import { Wrapper } from "./GridSystem";
import type { MotionUIProps } from '../types';
import { useEnterMotion } from '../../motion';
import { useTheme } from '../../Theme';

export type TabPosition = "default" | "top" | "left" | "right" | "bottom";

interface TabItemProps {
    label: React.ReactNode;
    children: React.ReactNode;
}

interface TabLayoutProps {
    menu: React.ReactNode;
    content: React.ReactNode;
}

interface TabProps extends MotionUIProps {
    children: React.ReactNode;
    defaultTab?: number;
    tabPosition?: TabPosition;
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
    defaultTab = 0,
    tabPosition = "default",
    pre = undefined,
    post = undefined,
    wrapClass = undefined,
    className = undefined,
    motion = undefined
}) => {
    const [active, setActive] = useState(defaultTab);
    
    const items = Children.toArray(children)
        .filter((child): child is ReactElement<TabItemProps> => 
            React.isValidElement(child) && child.type === TabItem
        );

    const TabLayout = TabLayouts[tabPosition];

    return (
        <Wrapper className={wrapClass}>
            {pre}
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
            {post}
        </Wrapper>
    );
};

export default Tab;
