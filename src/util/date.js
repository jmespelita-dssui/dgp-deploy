import moment from 'moment'

export const getDeadlineState = (deadline) => {
  if (!deadline) return { type: 'none' }

  const today = moment().startOf('day')
  const dueDate = moment(deadline).startOf('day')
  const diffDays = dueDate.diff(today, 'days')

  // Past
  if (diffDays < 0) {
    return {
      type: 'overdue',
      color: 'danger',
      tooltip: 'Scadenza superata',
    }
  }

  // Within 7 days
  if (diffDays <= 7) {
    return {
      type: 'soon',
      color: 'warning',
      tooltip: 'Scadenza imminente',
    }
  }

  // Normal
  return {
    type: 'normal',
  }
}
