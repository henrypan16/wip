'use client';

import { useCallback, useLayoutEffect, useState } from 'react';
import { DASHBOARD_LOANER_SECTIONS, STATUS } from '@/lib/constants';
import LoanerSection from './LoanerSection';
import TaskModal from './TaskModal';
import TaskSection from './TaskSection';

function useWindowWidth() {
    const [width, setWidth] = useState(0);
    useLayoutEffect(() => {
        const update = () => setWidth(window.innerWidth);
        window.addEventListener('resize', update);
        update();
        return () => window.removeEventListener('resize', update);
    }, []);
    return width;
}

// How many task cards fit in each section at a given window width.
function maxTasksFor(width) {
    if (width > 1423) return 8;
    if (width > 1280) return 7;
    if (width > 1024) return 11;
    if (width > 872) return 8;
    if (width > 768) return 7;
    if (width > 600) return 8;
    return 7;
}

export default function Dashboard({ tasks, loaners }) {
    const [selectedId, setSelectedId] = useState(null);
    const maxTask = maxTasksFor(useWindowWidth());
    const closeModal = useCallback(() => setSelectedId(null), []);

    const ready = tasks.filter((task) => task.status_id === STATUS.READY);
    const notReady = tasks.filter((task) => task.status_id !== STATUS.READY);
    const selected = tasks.find((task) => task.id === selectedId) ?? null;

    return (
        <div className="overflow-auto">
            <div className="flex flex-col h-full mx-10 mt-0">
                <div className="xl:flex dark:divide-gray-800 mb-4">
                    <TaskSection tasks={ready.slice(0, maxTask)} slots={maxTask} click={setSelectedId} title="Ready To Go" />
                    <TaskSection tasks={notReady.slice(0, maxTask)} slots={maxTask} click={setSelectedId} title="Not Ready" />
                </div>
                <div className="hidden xl:block">
                    <h1 className="text-lg text-gray-900 dark:text-white">Loaner Status:</h1>
                    <div className="flex w-11/12">
                        {DASHBOARD_LOANER_SECTIONS.map((category) => (
                            <LoanerSection key={category} title={category} loaners={loaners.filter((loaner) => loaner.category === category)} />
                        ))}
                    </div>
                </div>
            </div>

            <TaskModal task={selected} onClose={closeModal} />
        </div>
    );
}
