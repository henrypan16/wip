'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const TASKS = '/task';
const DELAY_MS = 250;

/**
 * A task search box that searches as you type. Shortly after typing stops, the
 * term goes into the /task URL: replaced in place on the tasks page (keeping
 * its status filter), or opening the tasks page from anywhere else.
 * Every box using this stays in step with the URL, so the navbar and the tasks
 * page show the same term.
 */
export default function useTaskSearch() {
    const router = useRouter();
    const pathname = usePathname();
    const params = useSearchParams();
    const onTasks = pathname === TASKS;
    const urlSearch = onTasks ? (params.get('search') ?? '') : '';
    const [value, setValue] = useState(urlSearch);
    // The last term this box sent, so its own URL updates don't overwrite newer typing.
    const sent = useRef(urlSearch);

    function go(term: string) {
        sent.current = term;
        const next = new URLSearchParams(onTasks ? params.toString() : '');
        if (term) next.set('search', term);
        else next.delete('search');
        next.delete('page');
        const url = next.size ? `${TASKS}?${next}` : TASKS;
        if (onTasks) router.replace(url, { scroll: false });
        else router.push(url);
    }

    // Search once typing pauses.
    useEffect(() => {
        const term = value.trim();
        if (onTasks ? term === urlSearch : !term) return;
        const timer = setTimeout(() => go(term), DELAY_MS);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    // Follow URL changes made elsewhere (another search box, a link, leaving the page).
    useEffect(() => {
        if (urlSearch !== sent.current) {
            sent.current = urlSearch;
            setValue(urlSearch);
        }
    }, [urlSearch]);

    /** Search straight away, for Enter. */
    const submit = () => go(value.trim());

    return { value, setValue, submit };
}
