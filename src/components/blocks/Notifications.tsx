import React from "react";
import {Dropdown, DropdownItem} from "./Dropdown";
import {useTheme} from "../../Theme";
import { useI18n } from "../../I18n";
import {Wrapper} from "../ui/GridSystem";
import Icon from "../ui/Icon";
import type { BadgeProps } from "../ui/Badge";

interface NotificationItem {
    title: string;
    url: string;
    time: string;
    icon: string;
}

interface NotificationsProps {
    items?: NotificationItem[];
    badge?: BadgeProps;
    wrapperClassName?: string;
}

function Notifications({
                           items        = [],
                           badge        = undefined,
                           wrapperClassName    = undefined
}: NotificationsProps) {
  const theme = useTheme("notifications");
  const dict = useI18n('notifications');

  return (
      <Wrapper className={wrapperClassName || theme.Notifications.wrapperClassName}>
          <Dropdown
              trigger={{
                icon: "bell",
              }}
              className={"flex items-center " + theme.Notifications.Dropdown.className}
              triggerClassName={"fs-20px " + theme.Notifications.Dropdown.triggerClassName}
              menuClassName={theme.Notifications.Dropdown.menuClassName}
              badge={badge}
              header={dict.title}
              footer={dict.seeAll}
          >
              {(items || []).map((notify, index) => {
                  const iconClassName = index === 0 ? "fs-20px" : "fs-20px w-20px";

                  return (
                      <DropdownItem
                          key={index}
                          className="py-10px text-wrap"
                          url={notify.url}
                          >
                          <div className={iconClassName}>
                              <Icon name={notify.icon} className="text-theme" />
                          </div>
                          <div className="flex-1 flex-wrap pl-3">
                              <div className="mb-1 text-white">{notify.title}</div>
                              <div className="small">{notify.time}</div>
                          </div>
                          <div className="pl-2 fs-16px">
                              <Icon name="chevron-right" />
                          </div>
                      </DropdownItem>
                  );
              })}
          </Dropdown>
      </Wrapper>
  );
}

export default Notifications;
