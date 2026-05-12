import React, { useEffect } from 'react';
import { useTheme } from '../../Theme';
import { UIProps } from '../..';
import { Wrapper } from "./GridSystem";
import { createPortal } from 'react-dom';
import { cn } from '../../libs/cn';
import Icon from './Icon';

type AlertProps = {
    children: string | React.ReactNode;
    type?: "info" | "success" | "warning" | "danger" | "primary" | "secondary" | "light" | "dark";
    isFixed?: "top" | "bottom";
    timeout?: number;
    onClose?: () => void;
    icon?: string | boolean;
    className?: string;
} & UIProps;

const Alert = ({
    children,
    type = "info",
    isFixed = undefined,
    timeout = undefined,
    onClose = undefined,
    icon = true,
    pre = undefined,
    post = undefined,
    wrapClass = undefined,
    className = undefined
}: AlertProps) => {
    const theme = useTheme("alert");

    const DEFAULT_ICONS: Record<string, string> = {
        info:      'info',
        success:   'check',
        warning:   'warning',
        danger:    'x-circle',
        primary:   '',
        secondary: '',
        light:     '',
        dark:      '',
    };

    const iconName: string | null = icon === false ? null
        : icon === true ? (DEFAULT_ICONS[type] || null)
        : (icon as string) || null;

    useEffect(() => {
        if (typeof onClose === 'function') {
            const duration = timeout || 5000;
            const timer = setTimeout(() => {
                onClose();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [onClose, timeout]);

    const renderAlert = () => (
        <Wrapper className={wrapClass}>
            {pre}
            <div
                role="alert"
                className={cn(
                    "alert alert-" + type,
                    className || theme.Alert.className,
                    isFixed && "fixed left-1/2 z-[1100] w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2 shadow-lg"
                )}
                style={isFixed ? { [isFixed]: 50 } : undefined}
            >
                {iconName && <Icon name={iconName} size={16} className="shrink-0" />}
                {children}
            </div>
            {post}
        </Wrapper>
    );

    return isFixed ? createPortal(renderAlert(), document.body) : renderAlert();
}

export default Alert;
