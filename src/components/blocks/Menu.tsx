import React, { useEffect, useState } from 'react';
import { useMenu, type UseMenuItem } from '../../App';
import { useTheme } from '../../Theme';
import { Link } from 'react-router-dom';
import { Wrapper } from '../ui/GridSystem';
import Badge, { BadgeType } from '../ui/Badge';
import { isInteractiveElement } from '../../libs/utils';
import Icon from '../ui/Icon';

interface MenuProps {
  context: string;
  Type?: 'ul' | 'ol';
  badges?: Record<string, { type?: BadgeType, children: string }>;
  pre?: React.ReactNode;
  post?: React.ReactNode;
  wrapClass?: string;
  className?: string;
  headerClass?: string;
  itemClass?: string;
  linkClass?: string;
  iconClass?: string;
  textClass?: string;
  badgeClass?: string;
  arrowClass?: string;
  submenuClass?: string;
}

const Menu = ({
  context,
  Type          = 'ul',
  badges        = {},
  pre           = undefined,
  post          = undefined,
  wrapClass     = undefined,
  className     = undefined,
  headerClass   = undefined,
  itemClass     = undefined,
  linkClass     = undefined,
  iconClass     = undefined,
  textClass     = undefined,
  badgeClass    = undefined,
  arrowClass    = undefined,
  submenuClass  = undefined,
}: MenuProps) => {
  const menu = useMenu(context);
  const theme = useTheme('menu');

  const MenuItem = ({ item, index }: { item: UseMenuItem; index: number }) => {
    const [isOpen, setIsOpen] = useState<boolean>(item.active);

    useEffect(() => {
      setIsOpen(item.active);
    }, [item]);

    const hasChildren = (item.children?.length ?? 0) > 0;
    const key = (item.title ?? '').toLowerCase();
    const MenuIcon = () => (
      <span className={iconClass ?? theme.Menu.iconClass}>
        <Icon name={item.icon} />
      </span>
    );

    if (!item.path) {
      return (
        <li key={index} className={headerClass ?? theme.Menu.headerClass}>
          {item.icon && <MenuIcon />}
          {item.title && (/^-+$/.test(item.title) ? <hr className={"m-0"} /> : <span>{item.title}</span>)}
        </li>
      );
    }

    return (
      <li className={`${item.active ? 'active ' : ''}${itemClass ?? theme.Menu.itemClass}`}>
        <Link
          to={item.path.split("*")[0]}
          className={linkClass ?? theme.Menu.linkClass}
          {...(hasChildren && {

          })}
          onClick={(e) => {
            if (hasChildren && !isInteractiveElement(e, 'a')) {
              e.preventDefault();
              setIsOpen(prev => !prev)
            }
          }}
        >
          {item.icon && <MenuIcon />}
          <span className={textClass ?? theme.Menu.textClass}>
            {item.title}
          </span>
          {badges[key] && (
            <Badge type={badges[key].type} className={badgeClass ?? theme.Menu.badgeClass}>
              {badges[key].children}
            </Badge>
          )}
          {hasChildren && <Icon name={isOpen ? 'caret-down' : 'caret-right'} />}
        </Link>
        {hasChildren && (
          <div className={`collapse ${isOpen ? 'show' : ''}`}>
            <Type className={submenuClass ?? theme.Menu.submenuClass}>
              {(item.children as UseMenuItem[]).map((child, idx: number) => (
                <MenuItem key={idx} item={child} index={idx} />
              ))}
            </Type>
          </div>
        )}
      </li>
    );
  };

  return (
    <Wrapper className={wrapClass ?? theme.Menu.wrapClass}>
      {pre}
      <Type className={className ?? theme.Menu.className}>
        {menu.map((item, index) => (
          <MenuItem key={index} item={item} index={index} />
        ))}
      </Type>
      {post}
    </Wrapper>
  );
};

export default Menu;
