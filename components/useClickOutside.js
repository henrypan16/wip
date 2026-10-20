import { useEffect } from 'react';

/** Call `handler` when a mousedown happens outside the element in `ref`. */
export default function useClickOutside(ref, handler, enabled = true) {
    useEffect(() => {
        if (!enabled) return;
        function onMouseDown(e) {
            if (ref.current && !ref.current.contains(e.target)) handler();
        }
        document.addEventListener('mousedown', onMouseDown);
        return () => document.removeEventListener('mousedown', onMouseDown);
    }, [ref, handler, enabled]);
}
