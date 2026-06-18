import React, { CSSProperties, ReactNode } from 'react';
import { cn } from '../../libs/cn';

type ContainerProps = {
    children?: ReactNode;
    className?: string;
    style?: CSSProperties;
    onClick?: () => void;
};

type ColProps = ContainerProps & {
    defaultSize?: number;
    xxl?: number | 'auto';
    xl?: number | 'auto';
    lg?: number | 'auto';
    md?: number | 'auto';
    sm?: number | 'auto';
    xs?: number | 'auto';
};

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
type ColSize = number | 'auto';

const CONTAINER_CLASS = "mx-auto w-full px-3 sm:max-w-[540px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1140px] 2xl:max-w-[1320px]";
const ROW_CLASS = "mx-[-0.75rem] flex flex-wrap";
const COL_BASE_CLASS = "box-border px-3 max-w-full";
const COL_FILL_CLASS = "min-w-0 flex-1 basis-0";
const COL_STACK_CLASS = "w-full max-w-full basis-full shrink-0 grow-0";
const COL_AUTO_CLASS = "w-auto max-w-none basis-auto shrink-0 grow-0";

const spanClass = (value: string, prefix = "") =>
    `${prefix}w-[${value}] ${prefix}max-w-[${value}] ${prefix}basis-[${value}] ${prefix}shrink-0 ${prefix}grow-0`;

const sizeClassMap: Record<Exclude<Breakpoint, 'xs'> | 'xs', Record<string, string>> = {
    xs: {
        auto: COL_AUTO_CLASS,
        1: spanClass('8.333333%'),
        2: spanClass('16.666667%'),
        3: spanClass('25%'),
        4: spanClass('33.333333%'),
        5: spanClass('41.666667%'),
        6: spanClass('50%'),
        7: spanClass('58.333333%'),
        8: spanClass('66.666667%'),
        9: spanClass('75%'),
        10: spanClass('83.333333%'),
        11: spanClass('91.666667%'),
        12: spanClass('100%'),
    },
    sm: {
        auto: spanClass('auto', 'sm:').replace('sm:w-[auto] sm:max-w-[auto] sm:basis-[auto]', 'sm:w-auto sm:max-w-none sm:basis-auto'),
        1: spanClass('8.333333%', 'sm:'),
        2: spanClass('16.666667%', 'sm:'),
        3: spanClass('25%', 'sm:'),
        4: spanClass('33.333333%', 'sm:'),
        5: spanClass('41.666667%', 'sm:'),
        6: spanClass('50%', 'sm:'),
        7: spanClass('58.333333%', 'sm:'),
        8: spanClass('66.666667%', 'sm:'),
        9: spanClass('75%', 'sm:'),
        10: spanClass('83.333333%', 'sm:'),
        11: spanClass('91.666667%', 'sm:'),
        12: spanClass('100%', 'sm:'),
    },
    md: {
        auto: spanClass('auto', 'md:').replace('md:w-[auto] md:max-w-[auto] md:basis-[auto]', 'md:w-auto md:max-w-none md:basis-auto'),
        1: spanClass('8.333333%', 'md:'),
        2: spanClass('16.666667%', 'md:'),
        3: spanClass('25%', 'md:'),
        4: spanClass('33.333333%', 'md:'),
        5: spanClass('41.666667%', 'md:'),
        6: spanClass('50%', 'md:'),
        7: spanClass('58.333333%', 'md:'),
        8: spanClass('66.666667%', 'md:'),
        9: spanClass('75%', 'md:'),
        10: spanClass('83.333333%', 'md:'),
        11: spanClass('91.666667%', 'md:'),
        12: spanClass('100%', 'md:'),
    },
    lg: {
        auto: spanClass('auto', 'lg:').replace('lg:w-[auto] lg:max-w-[auto] lg:basis-[auto]', 'lg:w-auto lg:max-w-none lg:basis-auto'),
        1: spanClass('8.333333%', 'lg:'),
        2: spanClass('16.666667%', 'lg:'),
        3: spanClass('25%', 'lg:'),
        4: spanClass('33.333333%', 'lg:'),
        5: spanClass('41.666667%', 'lg:'),
        6: spanClass('50%', 'lg:'),
        7: spanClass('58.333333%', 'lg:'),
        8: spanClass('66.666667%', 'lg:'),
        9: spanClass('75%', 'lg:'),
        10: spanClass('83.333333%', 'lg:'),
        11: spanClass('91.666667%', 'lg:'),
        12: spanClass('100%', 'lg:'),
    },
    xl: {
        auto: spanClass('auto', 'xl:').replace('xl:w-[auto] xl:max-w-[auto] xl:basis-[auto]', 'xl:w-auto xl:max-w-none xl:basis-auto'),
        1: spanClass('8.333333%', 'xl:'),
        2: spanClass('16.666667%', 'xl:'),
        3: spanClass('25%', 'xl:'),
        4: spanClass('33.333333%', 'xl:'),
        5: spanClass('41.666667%', 'xl:'),
        6: spanClass('50%', 'xl:'),
        7: spanClass('58.333333%', 'xl:'),
        8: spanClass('66.666667%', 'xl:'),
        9: spanClass('75%', 'xl:'),
        10: spanClass('83.333333%', 'xl:'),
        11: spanClass('91.666667%', 'xl:'),
        12: spanClass('100%', 'xl:'),
    },
    xxl: {
        auto: spanClass('auto', '2xl:').replace('2xl:w-[auto] 2xl:max-w-[auto] 2xl:basis-[auto]', '2xl:w-auto 2xl:max-w-none 2xl:basis-auto'),
        1: spanClass('8.333333%', '2xl:'),
        2: spanClass('16.666667%', '2xl:'),
        3: spanClass('25%', '2xl:'),
        4: spanClass('33.333333%', '2xl:'),
        5: spanClass('41.666667%', '2xl:'),
        6: spanClass('50%', '2xl:'),
        7: spanClass('58.333333%', '2xl:'),
        8: spanClass('66.666667%', '2xl:'),
        9: spanClass('75%', '2xl:'),
        10: spanClass('83.333333%', '2xl:'),
        11: spanClass('91.666667%', '2xl:'),
        12: spanClass('100%', '2xl:'),
    },
};

const resolveSizeClass = (breakpoint: Breakpoint, value: ColSize) => {
    const key = String(value);
    return sizeClassMap[breakpoint][key];
};

export const Wrapper = ({
                            children    = undefined,
                            className   = undefined,
                            style       = undefined,
                            onClick     = undefined,
} : ContainerProps) => {
    return className
        ? <div className={className} style={style} onClick={onClick}>{children}</div>
        : <>{children}</>;
};


export const Container = ({
                            children    = undefined,
                            className   = undefined,
                            style       = undefined
}: ContainerProps) => {
    return (<div className={cn(CONTAINER_CLASS, className)} style={style}>{children}</div>);
};

export const Row = ({
                            children    = undefined,
                            className   = undefined,
                            style       = undefined
}: ContainerProps) => {
    return (<div className={cn(ROW_CLASS, className)} style={style}>{children}</div>);
};

export const Col = ({
                            children    = undefined,
                            className   = undefined,
                            style       = undefined,
                            defaultSize = undefined,
                            xxl         = undefined,
                            xl          = undefined,
                            lg          = undefined,
                            md          = undefined,
                            sm          = undefined,
                            xs          = undefined
}: ColProps) => {
    const resolvedXs = xs ?? defaultSize;
    const hasResponsiveSizes = resolvedXs !== undefined || sm !== undefined || md !== undefined || lg !== undefined || xl !== undefined || xxl !== undefined;
    const classParts = [
        COL_BASE_CLASS,
        !hasResponsiveSizes ? COL_FILL_CLASS : resolvedXs !== undefined ? resolveSizeClass('xs', resolvedXs) : COL_STACK_CLASS,
        sm !== undefined ? resolveSizeClass('sm', sm) : undefined,
        md !== undefined ? resolveSizeClass('md', md) : undefined,
        lg !== undefined ? resolveSizeClass('lg', lg) : undefined,
        xl !== undefined ? resolveSizeClass('xl', xl) : undefined,
        xxl !== undefined ? resolveSizeClass('xxl', xxl) : undefined,
        className,
    ];

    return <div className={cn(classParts)} style={style}>{children}</div>;
};
