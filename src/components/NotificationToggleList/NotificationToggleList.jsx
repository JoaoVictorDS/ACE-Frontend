import { Toggle } from '../Toggle/Toggle'
import { notificationActions } from '../../pages/Profile/tabs/Notifications/notificationActions'
import './NotificationToggleList.css'

export const NotificationToggleList = ({ settings, onChange }) => {
    return (
        <div className="notification-toggle-list">
            {notificationActions.map((action) => {
                const setting = settings.find((item) => item.action_type === action.actionType)

                const enabled = setting?.enabled ?? false

                return (
                    <Toggle
                        key={action.actionType}
                        title={action.title}
                        description={action.description}
                        enabled={enabled}
                        onChange={(value) => onChange(action.actionType, value)}
                    />
                )
            })}
        </div>
    )
}