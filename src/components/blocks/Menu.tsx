import React, { useEffect, useState } from 'react';
import { useMenu, type UseMenuItem } from '../../App';
import { useTheme } from '../../Theme';
import { Link } from 'react-router-dom';
import { Wrapper } from '../ui/GridSystem';
import Badge, { BadgeType } from '../ui/Badge';
import { isInteractiveElement } from '../../libs/utils';
import Icon from '../ui/Icon';
import type { UIProps } from '../types';
import { cn } from '../../libs/cn';

interface MenuProps extends UIProps {
  /** Registry key used to look up menu items from `useMenu()`. */
  menuKey: string;
  as?: 'ul' | 'ol';
  /** Badge overrides keyed by menu item ID. */
  badges?: Record<string, { type?: BadgeType, children: string }>;
  headerClassName?: string;
  itemClassName?: string;
  linkClassName?: string;
  iconClassName?: string;
  textClassName?: string;
  badgeClassName?: string;
  arrowClassName?: string;
  submenuClassName?: string;
}

const Menu = ({
  menuKey,
  as            = 'ul',
  badges        = {},
  before           = undefined,
  after          = undefined,
  wrapperClassName     = undefined,
  className     = undefined,
  headerClassName   = undefined,
  itemClassName     = undefined,
  linkClassName     = undefined,
  iconClassName     = undefined,
  textClassName     = undefined,
  badgeClassName    = undefined,
  arrowClassName    = undefined,
  submenuClassName  = undefined,
}: MenuProps) => {
  const menu = useMenu(menuKey);
  const theme = useTheme('menu');

  const MenuItem = ({ item, index }: { item: UseMenuItem; index: number }) => {
    const [isOpen, setIsOpen] = useState<boolean>(item.active);

    useEffect(() => {
      setIsOpen(item.active);
    }, [item]);

    const hasChildren = (item.children?.length ?? 0) > 0;
    const key = (item.title ?? '').toLowerCase();
    const MenuIcon = () => (
      <span className={iconClassName ?? theme.Menu.iconClassName}>
        <Icon name={item.icon} />
      </span>
    );

    if (!item.path) {
      return (
        <li key={index} className={headerClassName ?? theme.Menu.headerClassName}>
          {item.icon && <MenuIcon />}
          {item.title && (/^-+$/.test(item.title) ? <hr className={"m-0"} /> : <span>{item.title}</span>)}
        </li>
      );
    }

    return (
      <li className={cn(itemClassName ?? theme.Menu.itemClassName)}>
        <Link
          to={item.path.split("*")[0]}
          className={cn(
            linkClassName ?? theme.Menu.linkClassName,
            item.active && "bg-primary/10 text-primary",
          )}
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
          <span className={textClassName ?? theme.Menu.textClassName}>
            {item.title}
          </span>
          {badges[key] && (
            <Badge variant={badges[key].type} className={badgeClassName ?? theme.Menu.badgeClassName}>
              {badges[key].children}
            </Badge>
          )}
          {hasChildren && (
            <span
              className={cn(
                arrowClassName ?? theme.Menu.arrowClassName,
                "ml-auto inline-flex shrink-0 items-center justify-center text-muted-foreground transition-transform duration-200",
                isOpen && "rotate-90",
              )}
            >
              <Icon name="chevron-right" size={14} />
            </span>
          )}
        </Link>
        {hasChildren && (
          <div
            className={cn(
              "grid transition-[grid-template-rows,opacity] duration-200 ease-out",
              isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
            )}
          >
            <div className="min-h-0 overflow-hidden">
              {(() => {
                const ListElement = as;
                return (
                  <ListElement className={submenuClassName ?? theme.Menu.submenuClassName}>
                    {(item.children as UseMenuItem[]).map((child, idx: number) => (
                      <MenuItem key={idx} item={child} index={idx} />
                    ))}
                  </ListElement>
                );
              })()}
            </div>
          </div>
        )}
      </li>
    );
  };

  const ListRoot = as;
  return (
    <Wrapper className={wrapperClassName ?? theme.Menu.wrapperClassName}>
      {before}
      <ListRoot className={className ?? theme.Menu.className}>
        {menu.map((item, index) => (
          <MenuItem key={index} item={item} index={index} />
        ))}
      </ListRoot>
      {after}
    </Wrapper>
  );
};

export default Menu;
