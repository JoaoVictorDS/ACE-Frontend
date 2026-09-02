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
        GET: (userId) => `/v1/users/${userId}`,

        ADMIN: {
            CREATE: '/v1/users',
            UPDATE: (userId) => `/v1/users/${userId}`,
            DELETE: (userId) => `/v1/users/${userId}`,
        }
    }

}