export const getErrorMessage = (error, fallback = 'Ocorreu um erro inesperado.') => {
    if (error?.response?.data?.message) {
        return error.response.data.message
    }

    if (error?.message) {
        return error.message
    }

    return fallback
}
