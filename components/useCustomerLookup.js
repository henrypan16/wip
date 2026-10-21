'use client';

import { useEffect, useRef } from 'react';
import { lookupCustomerName } from '@/actions/tasks';

/**
 * Fill in the pharmacy name from earlier tasks once a full customer ID is typed.
 * A name the user typed themselves is never overwritten.
 * @param {string} customerId
 * @param {string} name
 * @param {(name: string) => void} setName
 */
export default function useCustomerLookup(customerId, name, setName) {
    const autoFilled = useRef('');

    useEffect(() => {
        if (!/^\d{4}$/.test(customerId) || customerId === '0000') return;
        let cancelled = false;
        lookupCustomerName(customerId).then((found) => {
            if (cancelled || !found) return;
            if (name === '' || name === autoFilled.current) {
                autoFilled.current = found;
                setName(found);
            }
        });
        return () => {
            cancelled = true;
        };
        // Only look up when the ID changes.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customerId]);
}
