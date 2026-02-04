const DATE_FORMATTER = new Intl.DateTimeFormat('sr-RS', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
});

const TIME_FORMATTER = new Intl.DateTimeFormat('sr-RS', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
});

export const formatDate = (date) =>
    date ? DATE_FORMATTER.format(new Date(date)) : '';

export  const formatTimeSimple = (timeString) => {
    if (!timeString) return '';
    // "12:42:00" -> "12:42"
    return timeString.slice(0,5);
};
