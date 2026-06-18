import React from 'react';
import { UIProps } from '../..';
import { useTheme } from '../../Theme';
import { cn } from '../../libs/cn';
import { Wrapper } from './GridSystem';
import Loader from './Loader';

export interface CardProps extends UIProps {
    children: React.ReactNode;
    title?: string;
    header?: string | React.ReactNode;
    footer?: string | React.ReactNode;
    headerClassName?: string;
    bodyClassName?: string;
    footerClassName?: string;
    loading?: boolean;
    before?: React.ReactNode;
    after?: React.ReactNode;
}

const cardRootClassName = 'rounded-lg border border-border bg-card text-card-foreground shadow-sm';
const cardHeaderClassName = 'flex items-center gap-3 border-b border-border px-4 py-3';
const cardBodyClassName = 'p-4';
const cardFooterClassName = 'border-t border-border px-4 py-3';

const Card = ({
    children,
    title = undefined,
    header = undefined,
    footer = undefined,
    loading = undefined,
    wrapperClassName = undefined,
    className = undefined,
    headerClassName = undefined,
    bodyClassName = undefined,
    footerClassName = undefined,
    before = undefined,
    after = undefined,
}: CardProps) => {
    const theme = useTheme('card');
    const resolvedWrapClass = wrapperClassName
        ?? theme.Card.wrapperClassName
        ?? ((before || after) ? 'flex items-center gap-2' : undefined);

    return (
        <Wrapper className={resolvedWrapClass}>
            {before}
            <div className={cn(cardRootClassName, theme.Card.className, className)}>
                {(header || title) ? (
                    <div className={cn(cardHeaderClassName, theme.Card.headerClassName, headerClassName)}>
                        {title ? <h5 className="m-0 whitespace-nowrap text-base leading-none font-semibold">{title}</h5> : null}
                        {header}
                    </div>
                ) : null}

                <div className={cn(cardBodyClassName, theme.Card.bodyClassName, bodyClassName)}>
                    <Loader show={loading ?? theme.Card.loading}>
                        {children}
                    </Loader>
                </div>

                {footer ? (
                    <div className={cn(cardFooterClassName, theme.Card.footerClassName, footerClassName)}>
                        {footer}
                    </div>
                ) : null}
            </div>
            {after}
        </Wrapper>
    );
};

export default Card;