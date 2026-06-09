import React from 'react';
import {useTheme} from "../../Theme";
import {Wrapper} from "./GridSystem";
import Loader from "./Loader";
import { UIProps } from '../..';
import { cn } from '../../libs/cn';

interface CardProps extends UIProps {
    children: React.ReactNode;
    title?: string;
    header?: string | React.ReactNode;
    footer?: string | React.ReactNode;
    headerClass?: string;
    bodyClass?: string;
    footerClass?: string;
    showLoader?: boolean;
    showArrow?: boolean;
    pre?: React.ReactNode;
    post?: React.ReactNode;
}

const Card = ({
    children,
    title         = undefined,
    header        = undefined,
    footer        = undefined,
    showLoader    = undefined,
    showArrow     = undefined,
    wrapClass     = undefined,
    className     = undefined,
    headerClass   = undefined,
    bodyClass     = undefined,
    footerClass   = undefined,
    pre           = undefined,
    post          = undefined,
}: CardProps) => {
  const theme = useTheme("card");

  const resolvedWrapClass = wrapClass ?? theme.Card.wrapClass ?? ((pre || post) ? 'flex items-center gap-2' : undefined);

  return (
    <Wrapper className={resolvedWrapClass}>
        {pre}
        <div className={cn("card", className || theme.Card.className)}>
          {(header || title) &&
            <div className={cn("card-header", headerClass || theme.Card.headerClass)}>
                {title ? <h5 className="m-0 text-base font-semibold leading-none whitespace-nowrap">{title}</h5> : ""}
                {header}
            </div>
          }

          <div className={cn("card-body", bodyClass || theme.Card.bodyClass)}>
              <Loader show={showLoader || theme.Card.showLoader}>
                {children}
              </Loader>
          </div>
          {footer && <div className={cn("card-footer", footerClass || theme.Card.footerClass)}>{footer}</div>}
          {(showArrow || theme.Card.showArrow) &&
            <div className="card-arrow">
              <div className="card-arrow-top-left" />
              <div className="card-arrow-top-right" />
              <div className="card-arrow-bottom-left" />
              <div className="card-arrow-bottom-right" />
            </div>
          }
        </div>
        {post}
    </Wrapper>
  );
};

export default Card;
