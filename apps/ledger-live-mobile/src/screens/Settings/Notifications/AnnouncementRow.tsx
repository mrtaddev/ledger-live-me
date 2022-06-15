import React, { useCallback } from "react";
import { StyleProp, ViewStyle } from "react-native";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { notificationsSelector } from "../../../reducers/settings";
import { setNotifications } from "../../../actions/settings";

import SettingsRow from "../../../components/SettingsRow";
import Switch from "../../../components/Switch";
import Track from "../../../analytics/Track";

type Props = {
  style: StyleProp<ViewStyle>;
};

function AnnouncementRow({ style }: Props) {
  const dispatch = useDispatch();
  const notifications = useSelector(notificationsSelector);

  const { t } = useTranslation();

  const onValueChange = useCallback(() => {
    dispatch(
      setNotifications({
        ...notifications,
        announcement: !notifications.announcement,
      }),
    );
  }, [dispatch, notifications]);

  return (
    <SettingsRow
      event="AnnouncementRow"
      title={t("settings.notifications.announcement.title")}
      desc={t("settings.notifications.announcement.desc")}
      style={style}
    >
      <Track
        event={
          notifications.announcement
            ? "EnableAnnouncementNotifications"
            : "DisableAnnouncementNotifications"
        }
        onUpdate
      />
      <Switch
        disabled={!notifications.allowed}
        value={notifications.announcement}
        onValueChange={onValueChange}
      />
    </SettingsRow>
  );
}

export default AnnouncementRow;
