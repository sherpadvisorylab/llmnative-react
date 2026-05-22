import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import {useTheme} from "../../Theme";
import { BadgeOverlay } from './Badge';
import type { MotionUIProps, UIProps } from '../types';
import { Wrapper } from './GridSystem';
import { BadgeProps } from './Badge';
import { cn } from '../../libs/cn';
import { usePressMotion } from '../../motion';
import Icon from './Icon';

export interface IButton extends MotionUIProps {
    onClick?: (e: any) => any;
    icon?: string;
    label?: string | React.ReactNode;
    badge?: BadgeProps;
    title?: string;
    disabled?: boolean;
    showLoader?: boolean;
    iconClass?: string;
    style?: React.CSSProperties;
    variant?: "primary" | "secondary" | "danger" | "success" | "warning" | "info" | "light" | "dark" | "outline-primary" | "outline-secondary" | "outline-danger" | "outline-success" | "link";
}

export type SetMessagePayload = { message: string; chunkDone?: number; totalChunks?: number };

export interface LoadingButtonProps extends Omit<IButton, "onClick"> {
    onClick?: (e: any, setMessage?: (payload: SetMessagePayload) => any) => Promise<any>;
    loadingLabel?: string | React.ReactNode;
}

export const buttonBaseClass = "btn";
export const buttonPrimaryClass = "btn-primary";
export const buttonSecondaryClass = "btn-secondary";
export const buttonDangerClass = "btn-danger";
export const buttonSuccessClass = "btn-success";
export const buttonWarningClass = "btn-warning";
export const buttonInfoClass = "btn-info";
export const buttonLightClass = "btn-light";
export const buttonDarkClass = "btn-dark";
export const buttonOutlinePrimaryClass = "btn-outline-primary";
export const buttonOutlineSecondaryClass = "btn-outline-secondary";
export const buttonOutlineDangerClass = "btn-outline-danger";
export const buttonOutlineSuccessClass = "btn-outline-success";
export const buttonLinkClass = "btn-link";

const resolveButtonVariant = (variant?: IButton["variant"]) => {
    switch (variant) {
        case "primary": return buttonPrimaryClass;
        case "secondary": return buttonSecondaryClass;
        case "danger": return buttonDangerClass;
        case "success": return buttonSuccessClass;
        case "warning": return buttonWarningClass;
        case "info": return buttonInfoClass;
        case "light": return buttonLightClass;
        case "dark": return buttonDarkClass;
        case "outline-primary": return buttonOutlinePrimaryClass;
        case "outline-secondary": return buttonOutlineSecondaryClass;
        case "outline-danger": return buttonOutlineDangerClass;
        case "outline-success": return buttonOutlineSuccessClass;
        case "link": return buttonLinkClass;
        default: return undefined;
    }
};
  
export const LoadingButton = ({
    onClick,
    icon            = undefined,
    label           = undefined,
    badge           = undefined,
    title           = undefined,
    disabled        = false,
    showLoader      = false,
    pre             = undefined,
    post            = undefined,
    wrapClass       = undefined,
    className       = undefined,
    iconClass       = undefined,
    style           = undefined,
    loadingLabel    = undefined,
    variant         = undefined,
    motion: motionConfig = undefined
}: LoadingButtonProps = {}) => {
    const [loader, setLoader] = useState(showLoader);
    const [disable, setDisable] = useState(disabled);
    const [message, setMessageState] = useState("");

    const setMessage = (payload: SetMessagePayload) => {
        setMessageState(payload.message ?? '');
    };

    const theme = useTheme("button");
    const motion = usePressMotion(disable || loader, style, motionConfig ?? theme.LoadingButton.motion?.press ?? 'press');
    const activeLoadingLabel = loadingLabel ?? (message || (typeof label === 'string' ? `${label}...` : label));

    useEffect(() => {
        setLoader(showLoader);
        setDisable(disabled);
    }, [showLoader, disabled]);

    const button = (
        <button
            title={title}
            className={cn(
                buttonBaseClass,
                variant ? resolveButtonVariant(variant) : (className || theme.LoadingButton.className),
                variant ? className : undefined,
                loader && "whitespace-nowrap"
            )}
            style={motion.style}
            disabled={disable || loader}
            {...motion.pressHandlers}
            onClick={async (e) => {
                e.stopPropagation();
                setDisable(true);
                setLoader(true);
                await onClick?.(e, setMessage);
                setLoader(false);
                setDisable(false);
            }}
        >
            {loader && <>
                <span className={cn(activeLoadingLabel && "mr-1", "inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent")} />
                {activeLoadingLabel && <span>{activeLoadingLabel}</span>}
            </>}
            {(icon && !loader) && <Icon name={icon} className={cn(label && "mr-1", iconClass)} />}
            {!loader && label}
        </button>
    );

    return (
        <Wrapper className={wrapClass}>
            {pre}
            <BadgeOverlay badge={!loader ? badge : undefined}>{button}</BadgeOverlay>
            {post}
        </Wrapper>
    );
};

export const ActionButton = ({
    onClick,
    icon            = undefined,
    label           = undefined,
    badge           = undefined,
    title           = undefined,
    disabled        = false,
    pre             = undefined,
    post            = undefined,
    wrapClass       = undefined,
    className       = undefined,
    iconClass       = undefined,
    style           = undefined,
    variant         = undefined,
    motion: motionConfig = undefined
}: IButton = {}) => {
    const theme = useTheme("button");
    const motion = usePressMotion(disabled, style, motionConfig ?? theme.ActionButton.motion?.press ?? 'press');
    const button = (
        <button
            title={title}
            className={cn(
                buttonBaseClass,
                variant ? resolveButtonVariant(variant) : (className || theme.ActionButton.className),
                variant ? className : undefined
            )}
            style={motion.style}
            disabled={disabled}
            {...motion.pressHandlers}
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClick?.(e);
            }}
        >
            {icon && <Icon name={icon} className={cn(label && "mr-1", iconClass)} />}
            {label}
        </button>
    );

    return (
        <Wrapper className={wrapClass}>
            {pre}
            <span
                title={disabled ? title : undefined}
                style={disabled ? { cursor: 'not-allowed', display: 'inline-flex' } : undefined}
            >
                <BadgeOverlay badge={badge}>{button}</BadgeOverlay>
            </span>
            {post}
        </Wrapper>
    );
};

interface BackLinkProps extends UIProps {
    label?: string;
}

export const BackLink = ({
    label           = "<- Back",
    pre             = undefined,
    post            = undefined,
    wrapClass       = undefined,
    className       = undefined
}: BackLinkProps) => {
    const navigate = useNavigate();
    const theme = useTheme("button");
    return (
        <Wrapper className={wrapClass}>
            {pre}
            <a href="#"
               className={cn(buttonBaseClass, className || theme.LinkButton.className)}
               onClick={(e) => {
                   e.preventDefault();
                   navigate(-1);
               }}
            >
                {label}
            </a>
            {post}
        </Wrapper>
    );
};

interface GoSiteProps extends UIProps {
    label: string;
    url: string;
}

export const GoSite = ({
    label,
    url,
    pre             = undefined,
    post            = undefined,
    wrapClass       = undefined,
    className       = undefined
}: GoSiteProps) => {
    const theme = useTheme("button");

    return (
        <Wrapper className={wrapClass}>
            {pre}
            <h1 className={cn("m-0 text-2xl font-bold", className)}>
                {label + " "}
                <a href={url} target="_blank" rel="noopener noreferrer">
                    <Icon name="external-link" />
                </a>
            </h1>
            {post}
        </Wrapper>
    );
};

interface ReferSiteProps extends UIProps {
    title: string;
    url: string;
    imageUrl: string;
    width?: number | string;
}

export const ReferSite = ({
    title,
    url,
    imageUrl,
    width,
    pre             = undefined,
    post            = undefined,
    wrapClass       = undefined,
    className       = undefined
}: ReferSiteProps) => {
    return (
        <Wrapper className={wrapClass}>
            {pre}
            <a
                href={url}
                className={cn("mr-1", className)}
                target="_blank"
                title={title}
                rel="noopener noreferrer"
            >
                <img src={imageUrl} width={width ? width : "100"} height="30" alt={title} />
            </a>
            {post}
        </Wrapper>
    );
};

