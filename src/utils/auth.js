import { STORAGE_KEYS } from '../constants/storageKeys'

export const clearSession = () => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER)
}