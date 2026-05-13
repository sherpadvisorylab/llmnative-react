import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import {useTheme} from "../../Theme";
import Badge from './Badge';
import type { UIProps } from '../types';
import { Wrapper } from './GridSystem';
import { BadgeType } from './Badge';
import { cn } from '../../libs/cn';
import { usePressMotion, type MotionConfig } from '../../motion';

export interface IButton extends UIProps {
    onClick?: (e: any) => any;
    icon?: string;
    label?: string | React.ReactNode;
    badge?: string;
    title?: string;
    disabled?: boolean;
    showLoader?: boolean;
    badgeType?: BadgeType;
    iconClass?: string;
    style?: React.CSSProperties;
    motion?: MotionConfig | false;
}

export type SetMessagePayload = { message: string; chunkDone?: number; totalChunks?: number };

export interface LoadingButtonProps extends Omit<IButton, "onClick"> {
    onClick?: (e: any, setMessage?: (payload: SetMessagePayload) => any) => Promise<any>;
}
  
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
    badgeType       = undefined,
    iconClass       = undefined,
    style           = undefined,
    motion: motionConfig = undefined
}: LoadingButtonProps = {}) => {
    const [loader, setLoader] = useState(showLoader);
    const [disable, setDisable] = useState(disabled);
    const [message, setMessageState] = useState("");

    const setMessage = (payload: SetMessagePayload) => {
        setMessageState(payload.message ?? '');
    };

    const theme = useTheme("button");
    const motion = usePressMotion(disable || loader, style, motionConfig === false ? { preset: 'none' } : motionConfig);

    useEffect(() => {
        setLoader(showLoader);
        setDisable(disabled);
    }, [showLoader, disabled]);

    const button = (
        <button
            title={title}
            className={cn("btn", className || theme.LoadingButton.className, loader && message && "whitespace-nowrap")}
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
            {loader && <><i className={cn(label && "mr-1", theme.LoadingButton.spinnerClass)}></i>{message && <span className='ml-1'>{message}</span>}</>}
            {(icon && !loader) && <i className={cn(label && "mr-1", iconClass, theme.getIcon(icon))}></i>}
            {label}
        </button>
    );

    return (
        <Wrapper className={wrapClass}>
            {pre}
            {(badge != null && !loader) ? <Badge type={badgeType} post={badge}>{button}</Badge> : button}
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
    badgeType       = undefined,
    iconClass       = undefined,
    style           = undefined,
    motion: motionConfig = undefined
}: IButton = {}) => {
    const theme = useTheme("button");
    const motion = usePressMotion(disabled, style, motionConfig === false ? { preset: 'none' } : motionConfig);
    const button = (
        <button
            title={title}
            className={cn("btn", className || theme.ActionButton.className)}
            style={motion.style}
            disabled={disabled}
            {...motion.pressHandlers}
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClick?.(e);
            }}
        >
            {icon && <i className={cn(label && "mr-1", iconClass, theme.getIcon(icon))}></i>}
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
                {badge != null ? <Badge type={badgeType} post={badge}>{button}</Badge> : button}
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
               className={cn("btn", className || theme.LinkButton.className)}
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
                    <i className={theme.getIcon("external-link")} />
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

