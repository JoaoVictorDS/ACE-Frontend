export const USER_AVAILABILITY = {
    AVAILABLE: 'AVAILABLE',
    BREAK: 'BREAK',
    EXTERNAL_ACTIVITY: 'EXTERNAL_ACTIVITY',
    END_OF_DAY: 'END_OF_DAY'
}

export const USER_AVAILABILITY_OPTIONS = [
    {
        value: USER_AVAILABILITY.AVAILABLE,
        label: 'Disponível'
    },
    {
        value: USER_AVAILABILITY.BREAK,
        label: 'Intervalo'
    },
    {
        value: USER_AVAILABILITY.EXTERNAL_ACTIVITY,
        label: 'Em atividades externas'
    },
    {
        value: USER_AVAILABILITY.END_OF_DAY,
        label: 'Fim das atividades'
    }
]

export const getUserAvailabilityOption = (value) => {
    if (!value) {
        return {
            value: null,
            label: 'Sem status'
        }
    }

    return USER_AVAILABILITY_OPTIONS.find(
        (option) => option.value === value
    ) ?? {
        value: null,
        label: 'Status desconhecido'
    }
}