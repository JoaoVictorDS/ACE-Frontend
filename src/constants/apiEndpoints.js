export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/v1/auth/login',
        REFRESH: '/v1/auth/refresh',
        LOGOUT: '/v1/auth/logout',
    },

    USERS: {
        LIST: '/v1/users',
        PROFILE: '/v1/users/me',
        UPDATE: '/v1/users/me',
        UPDATE_PASSWORD: '/v1/users/me/password',
        GET: (userId) => `/v1/users/${userId}`,

        NOTIFICATION_SETTINGS: {
            GET: 'v1/users/me/notification-settings',
            UPDATE: 'v1/users/me/notification-settings'
        },

        ADMIN: {
            CREATE: '/v1/users',
            UPDATE: (userId) => `/v1/users/${userId}`,
            DELETE: (userId) => `/v1/users/${userId}`,
        }
    },

    WORKSPACES: {
        LIST: '/v1/workspaces',
        CREATE: '/v1/workspaces',
        GET: (workspaceId) => `/v1/workspaces/${workspaceId}`,
        UPDATE: (workspaceId) => `/v1/workspaces/${workspaceId}`,
        DELETE: (workspaceId) => `/v1/workspaces/${workspaceId}`,
        MOVE: (workspaceId) => `/v1/workspaces/${workspaceId}/move`,
        LOGS: (workspaceId) => `/v1/workspaces/${workspaceId}/logs`,
        BOARDS: (workspaceId) => `/v1/workspaces/${workspaceId}/boards`,
    },

    NOTIFICATIONS: {
        GET: '/v1/notifications',
        MARK_ALL_AS_READ: '/v1/notifications/read',
        MARK_AS_READ: (notificationId) => `/v1/notifications/${notificationId}/read`,
        MARK_AS_UNREAD: (notificationId) => `/v1/notifications/${notificationId}/unread`,
    }

}