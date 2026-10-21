'use client';

import { type ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';

type ModalProps = { show: boolean; onClose: () => void; children: ReactNode; className?: string };

export default function Modal({ show, onClose, children, className = 'max-w-2xl' }: ModalProps) {
    useEffect(() => {
        if (!show) return;
        const onKeyDown = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [show, onClose]);

    if (!show) return null;

    return createPortal(
        <>
            <div className="bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-40" />
            <div tabIndex={-1} role="dialog" aria-modal="true" onClick={onClose}
                className="fixed top-0 left-0 right-0 z-50 flex justify-center items-center w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
                <div className={`relative w-full ${className} max-h-full`} onClick={(e) => e.stopPropagation()}>
                    {children}
                </div>
            </div>
        </>,
        document.body,
    );
}
