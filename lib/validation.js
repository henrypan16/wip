// Small helpers for validating server action input. Each returns an error
// message or undefined, so results can be collected into an `errors` object.

export const text = (value) => (typeof value === 'string' ? value.trim() : '');

export function required(value, label) {
    if (!text(value)) return `The ${label} field is required.`;
}

export function maxLength(value, max, label) {
    if (text(value).length > max) return `The ${label} must not be greater than ${max} characters.`;
}

export function email(value) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text(value))) return 'The email must be a valid email address.';
}

export function isoDate(value, label) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(text(value)) || Number.isNaN(Date.parse(value))) return `The ${label} is not a valid date.`;
}

/** Keep only the entries that hold an error message; null when there are none. */
export function collect(errors) {
    const found = Object.fromEntries(Object.entries(errors).filter(([, message]) => message));
    return Object.keys(found).length ? found : null;
}

/** The first error message from a list of checks. */
export const first = (...messages) => messages.find(Boolean);
