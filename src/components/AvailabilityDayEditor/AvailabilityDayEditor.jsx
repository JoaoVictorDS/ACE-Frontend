
import { useState } from 'react'
import { Clock3, FileText, Plus, Save, Trash2, X } from 'lucide-react'
import { USER_AVAILABILITY, USER_AVAILABILITY_OPTIONS } from '../../constants/userAvailability'
import { useUpdateUserAvailabilityPeriods, useUpsertUserAvailabilityNotes } from '../../hooks/useAvailability'
import { useToast } from '../../hooks/useToast'
import { getErrorMessage } from '../../utils/error'
import './AvailabilityDayEditor.css'

const activityOptions = USER_AVAILABILITY_OPTIONS.filter((option) => option.value !== USER_AVAILABILITY.END_OF_DAY)

const toMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number)

    return hours * 60 + minutes
}

const getNextAvailableMinute = (time) => {
    if (!time) return undefined

    const nextMinute = toMinutes(time) + 1

    if (nextMinute >= 24 * 60) return undefined

    const hours = String(Math.floor(nextMinute / 60)).padStart(2, '0')
    const minutes = String(nextMinute % 60).padStart(2, '0')

    return `${hours}:${minutes}`
}

const createPeriodDrafts = (periods = []) => {
    return periods.map((period) => ({
        id: period.id,
        status: period.status,
        startedTime: period.started_time,
        endedTime: period.ended_time ?? ''
    }))
}

export const AvailabilityDayEditor = ({ userId, day }) => {
    const [editingPeriods, setEditingPeriods] = useState(false)
    const [editingNotes, setEditingNotes] = useState(false)
    const [periods, setPeriods] = useState(() => createPeriodDrafts(day.periods))
    const [notes, setNotes] = useState(day.notes ?? '')

    const { updateUserAvailabilityPeriods, updatingUserAvailabilityPeriods } = useUpdateUserAvailabilityPeriods()
    const { upsertUserAvailabilityNotes, upsertingUserAvailabilityNotes } = useUpsertUserAvailabilityNotes()

    const { error } = useToast()

    const handleEditPeriods = () => {
        setPeriods(createPeriodDrafts(day.periods))
        setEditingPeriods(true)
    }

    const handleCancelPeriods = () => {
        setPeriods(createPeriodDrafts(day.periods))
        setEditingPeriods(false)
    }

    const handlePeriodChange = (index, field, value) => {
        setPeriods((current) => {
            const updatedPeriods = current.map((period) => ({ ...period }))

            updatedPeriods[index] = {
                ...updatedPeriods[index],
                [field]: value
            }

            const currentPeriod = updatedPeriods[index]

            if (currentPeriod.status === USER_AVAILABILITY.END_OF_DAY && field === 'startedTime') {
                currentPeriod.endedTime = value

                if (index > 0) {
                    updatedPeriods[index - 1].endedTime = value
                }
            }

            if (field === 'endedTime' && updatedPeriods[index + 1]?.status === USER_AVAILABILITY.END_OF_DAY) {
                updatedPeriods[index + 1].startedTime = value
                updatedPeriods[index + 1].endedTime = value
            }

            return updatedPeriods
        })
    }

    const handleAddPeriod = () => {
        const lastPeriod = periods[periods.length - 1]

        const startedTime = !lastPeriod
            ? ''
            : lastPeriod.status === USER_AVAILABILITY.END_OF_DAY
                ? lastPeriod.startedTime
                : lastPeriod.endedTime

        setPeriods((current) => [
            ...current,
            {
                status: USER_AVAILABILITY.AVAILABLE,
                startedTime,
                endedTime: ''
            }
        ])
    }

    const handleAddEndOfDay = () => {
        const lastPeriod = periods[periods.length - 1]

        if (!lastPeriod || lastPeriod.status === USER_AVAILABILITY.END_OF_DAY || !lastPeriod.endedTime) {
            return
        }

        setPeriods((current) => [
            ...current,
            {
                status: USER_AVAILABILITY.END_OF_DAY,
                startedTime: lastPeriod.endedTime,
                endedTime: lastPeriod.endedTime
            }
        ])
    }

    const handleRemovePeriod = (index) => {
        setPeriods((current) => current.filter((_, periodIndex) => periodIndex !== index))
    }

    const handleSavePeriods = async (event) => {
        event.preventDefault()

        try {
            const formattedPeriods = periods.map((period) => {
                if (!period.startedTime) {
                    throw new Error('Informe o início de todos os períodos.')
                }

                if (period.status === USER_AVAILABILITY.END_OF_DAY) {
                    return {
                        status: period.status,
                        started_time: period.startedTime,
                        ended_time: period.startedTime
                    }
                }

                const endedTime = period.endedTime || null

                if (endedTime && toMinutes(endedTime) <= toMinutes(period.startedTime)) {
                    throw new Error('O término deve ser posterior ao início.')
                }

                return {
                    status: period.status,
                    started_time: period.startedTime,
                    ended_time: endedTime
                }
            })

            await updateUserAvailabilityPeriods({
                userId,
                workDate: day.work_date,
                periods: formattedPeriods
            })

            setEditingPeriods(false)
        } catch (err) {
            error({
                title: 'Erro ao salvar períodos',
                message: getErrorMessage(err)
            })
        }
    }

    const handleSaveNotes = async (event) => {
        event.preventDefault()

        try {
            await upsertUserAvailabilityNotes({
                userId,
                workDate: day.work_date,
                notes
            })

            setNotes(notes.trim())
            setEditingNotes(false)
        } catch (err) {
            error({
                title: 'Erro ao salvar observações',
                message: getErrorMessage(err)
            })
        }
    }

    const lastPeriod = periods[periods.length - 1]
    const canAddPeriod = !lastPeriod || lastPeriod.status === USER_AVAILABILITY.END_OF_DAY || !!lastPeriod.endedTime
    const canAddEndOfDay = !!lastPeriod && lastPeriod.status !== USER_AVAILABILITY.END_OF_DAY && !!lastPeriod.endedTime

    return (
        <div className="availability-day-editor">
            <div className="availability-day-editor-section">
                <div className="availability-day-editor-header">
                    <div>
                        <h4>Gerenciar períodos</h4>
                        <p>Adicione, corrija ou remova horários deste dia.</p>
                    </div>

                    {!editingPeriods && (
                        <button
                            type="button"
                            className="availability-day-editor-button"
                            onClick={handleEditPeriods}
                        >
                            Editar horários
                        </button>
                    )}
                </div>

                {editingPeriods && (
                    <form onSubmit={handleSavePeriods}>
                        <div className="availability-day-editor-periods">
                            {periods.length === 0 && (
                                <div className="availability-day-editor-empty">
                                    Nenhum período cadastrado. Adicione o primeiro registro.
                                </div>
                            )}

                            {periods.map((period, index) => {
                                const isEndOfDay = period.status === USER_AVAILABILITY.END_OF_DAY

                                return (
                                    <div
                                        key={`${period.id ?? 'new'}-${index}`}
                                        className="availability-day-editor-period"
                                    >
                                        <div className="availability-day-editor-period-header">
                                            <strong>
                                                {isEndOfDay
                                                    ? 'Fim das atividades'
                                                    : `Período ${index + 1}`}
                                            </strong>

                                            <button
                                                type="button"
                                                className="availability-day-editor-remove"
                                                onClick={() => handleRemovePeriod(index)}
                                                aria-label="Remover período"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>

                                        {!isEndOfDay && (
                                            <label className="availability-day-editor-field">
                                                <span>Status</span>

                                                <select
                                                    value={period.status}
                                                    onChange={(event) => handlePeriodChange(index, 'status', event.target.value)}
                                                    required
                                                >
                                                    {activityOptions.map((option) => (
                                                        <option
                                                            key={option.value}
                                                            value={option.value}
                                                        >
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </label>
                                        )}

                                        <div className="availability-day-editor-times">
                                            <label className="availability-day-editor-field">
                                                <span>
                                                    {isEndOfDay ? 'Horário do encerramento' : 'Início'}
                                                </span>

                                                <input
                                                    type="time"
                                                    step="60"
                                                    value={period.startedTime}
                                                    onChange={(event) => handlePeriodChange(index, 'startedTime', event.target.value)}
                                                    required
                                                />
                                            </label>

                                            {!isEndOfDay && (
                                                <label className="availability-day-editor-field">
                                                    <span>Término</span>

                                                    <input
                                                        type="time"
                                                        step="60"
                                                        value={period.endedTime}
                                                        onChange={(event) => handlePeriodChange(index, 'endedTime', event.target.value)}
                                                        min={getNextAvailableMinute(period.startedTime)}
                                                    />

                                                    <small>
                                                        Deixe vazio para manter o período em andamento.
                                                    </small>
                                                </label>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        <div className="availability-day-editor-actions">
                            <button
                                type="button"
                                className="availability-day-editor-secondary"
                                onClick={handleAddPeriod}
                                disabled={!canAddPeriod}
                            >
                                <Plus size={15} />
                                Adicionar período
                            </button>

                            <button
                                type="button"
                                className="availability-day-editor-secondary"
                                onClick={handleAddEndOfDay}
                                disabled={!canAddEndOfDay}
                            >
                                <Clock3 size={15} />
                                Fim das atividades
                            </button>
                        </div>

                        <div className="availability-day-editor-footer">
                            <button
                                type="button"
                                className="availability-day-editor-cancel"
                                onClick={handleCancelPeriods}
                                disabled={updatingUserAvailabilityPeriods}
                            >
                                <X size={15} />
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                className="availability-day-editor-save"
                                disabled={updatingUserAvailabilityPeriods}
                            >
                                <Save size={15} />
                                {updatingUserAvailabilityPeriods
                                    ? 'Salvando...'
                                    : 'Salvar períodos'}
                            </button>
                        </div>
                    </form>
                )}
            </div>

            <div className="availability-day-editor-section">
                <div className="availability-day-editor-header">
                    <div>
                        <h4>Observações do dia</h4>
                        <p>Registre informações relevantes sobre esta data.</p>
                    </div>

                    {!editingNotes && (
                        <button
                            type="button"
                            className="availability-day-editor-button"
                            onClick={() => {
                                setNotes(day.notes ?? '')
                                setEditingNotes(true)
                            }}
                        >
                            Editar observações
                        </button>
                    )}
                </div>

                {editingNotes ? (
                    <form onSubmit={handleSaveNotes}>
                        <label className="availability-day-editor-field">
                            <span>Observações</span>

                            <textarea
                                rows={4}
                                value={notes}
                                onChange={(event) => setNotes(event.target.value)}
                                placeholder="Descreva alguma ocorrência deste dia..."
                            />
                        </label>

                        <div className="availability-day-editor-footer">
                            <button
                                type="button"
                                className="availability-day-editor-cancel"
                                onClick={() => {
                                    setNotes(day.notes ?? '')
                                    setEditingNotes(false)
                                }}
                                disabled={upsertingUserAvailabilityNotes}
                            >
                                <X size={15} />
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                className="availability-day-editor-save"
                                disabled={upsertingUserAvailabilityNotes}
                            >
                                <Save size={15} />
                                {upsertingUserAvailabilityNotes
                                    ? 'Salvando...'
                                    : 'Salvar observações'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="availability-day-editor-notes">
                        <FileText size={16} />

                        <p>
                            {day.notes || 'Nenhuma observação registrada neste dia.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
