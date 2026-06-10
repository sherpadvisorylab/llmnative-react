import React from 'react';
import {useTheme} from "../../Theme";
import {Wrapper} from "./GridSystem";
import Loader from "./Loader";
import { UIProps } from '../..';
import { cn } from '../../libs/cn';

export interface CardProps extends UIProps {
    children: React.ReactNode;
    title?: string;
    header?: string | React.ReactNode;
    footer?: string | React.ReactNode;
    headerClassName?: string;
    bodyClassName?: string;
    footerClassName?: string;
    loading?: boolean;
    showArrow?: boolean;
    before?: React.ReactNode;
    after?: React.ReactNode;
}

const Card = ({
    children,
    title         = undefined,
    header        = undefined,
    footer        = undefined,
    loading    = undefined,
    showArrow     = undefined,
    wrapperClassName     = undefined,
    className     = undefined,
    headerClassName   = undefined,
    bodyClassName     = undefined,
    footerClassName   = undefined,
    before           = undefined,
    after          = undefined,
}: CardProps) => {
  const theme = useTheme("card");

  const resolvedWrapClass = wrapperClassName ?? theme.Card.wrapperClassName ?? ((before || after) ? 'flex items-center gap-2' : undefined);

  return (
    <Wrapper className={resolvedWrapClass}>
        {before}
        <div className={cn("card", className || theme.Card.className)}>
          {(header || title) &&
            <div className={cn("card-header", headerClassName || theme.Card.headerClassName)}>
                {title ? <h5 className="m-0 text-base font-semibold leading-none whitespace-nowrap">{title}</h5> : ""}
                {header}
            </div>
          }

          <div className={cn("card-body", bodyClassName || theme.Card.bodyClassName)}>
              <Loader show={loading || theme.Card.loading}>
                {children}
              </Loader>
          </div>
          {footer && <div className={cn("card-footer", footerClassName || theme.Card.footerClassName)}>{footer}</div>}
          {(showArrow || theme.Card.showArrow) &&
            <div className="card-arrow">
              <div className="card-arrow-top-left" />
              <div className="card-arrow-top-right" />
              <div className="card-arrow-bottom-left" />
              <div className="card-arrow-bottom-right" />
            </div>
          }
        </div>
        {after}
    </Wrapper>
  );
};

export default Card;
