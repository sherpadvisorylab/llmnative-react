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
const ROW_CLASS = "rf-row";
const COL_BASE_CLASS = "rf-col";
const COL_FILL_CLASS = "rf-col-fill";
const COL_STACK_CLASS = "rf-col-12";

const buildSpanClass = (breakpoint: Breakpoint, value: Exclude<ColSize, 'auto'>) => (
    breakpoint === 'xs'
        ? `rf-col-${value}`
        : `rf-col-${breakpoint}-${value}`
);

const buildAutoClass = (breakpoint: Breakpoint) => (
    breakpoint === 'xs'
        ? 'rf-col-auto'
        : `rf-col-${breakpoint}-auto`
);

const buildBreakpointMap = (breakpoint: Breakpoint): Record<string, string> => ({
    auto: buildAutoClass(breakpoint),
    1: buildSpanClass(breakpoint, 1),
    2: buildSpanClass(breakpoint, 2),
    3: buildSpanClass(breakpoint, 3),
    4: buildSpanClass(breakpoint, 4),
    5: buildSpanClass(breakpoint, 5),
    6: buildSpanClass(breakpoint, 6),
    7: buildSpanClass(breakpoint, 7),
    8: buildSpanClass(breakpoint, 8),
    9: buildSpanClass(breakpoint, 9),
    10: buildSpanClass(breakpoint, 10),
    11: buildSpanClass(breakpoint, 11),
    12: buildSpanClass(breakpoint, 12),
});

const sizeClassMap: Record<Breakpoint, Record<string, string>> = {
    xs: buildBreakpointMap('xs'),
    sm: buildBreakpointMap('sm'),
    md: buildBreakpointMap('md'),
    lg: buildBreakpointMap('lg'),
    xl: buildBreakpointMap('xl'),
    xxl: buildBreakpointMap('xxl'),
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
