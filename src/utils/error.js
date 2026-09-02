import { MESSAGES } from '../constants/messages'

export const getErrorMessage = (error) => {
    if (error.response?.data?.message) {
        return error.response.data.message
    }

    if (error.message) {
        return error.message
    }

    return MESSAGES.ERROR.SOMETHING_WRONG
}