//import 'bootstrap/dist/css/bootstrap.min.css';
import MainLayout from './Layouts/MainLayout'

import './bootstrap';
import '../css/app.css';
import 'flowbite';


import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

const appName = import.meta.env.VITE_APP_NAME || 'FTWIP';

createInertiaApp({
    title: (title) => `${appName} - ${title}`,
    resolve: name => {
        const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true })
        let page = pages[`./Pages/${name}.jsx`]
        page.default.layout = page.default.layout || (page => <MainLayout children={page} />)
        return page
      },
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
