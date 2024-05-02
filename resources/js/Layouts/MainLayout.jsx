import { createContext, useContext, useState, useEffect} from 'react';
import { router, usePage } from '@inertiajs/react';
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import Content from './Content'

export default function MainLayout({ children }) {
    const [darkMode, setDarkMode] = useState(localStorage.getItem('local') == 'true' ? true : false);
    const {auth} = usePage().props;
    useEffect(() => {
        if(localStorage.getItem('local') == 'true') {
            document.body.classList.add('dark')} 
      return () => {
      }
    }, [])
    
    function handleChangeTheme() {
        if(darkMode) {
            document.body.classList.remove('dark');
            localStorage.setItem('local', false);
            setDarkMode(false);
        } else {
            document.body.classList.add('dark');
            localStorage.setItem('local', true);
            setDarkMode(true);
        }
    }


  return (
    <>
    {auth.user != null ?
        <div className='antialiased bg-gray-50 dark:bg-gray-900 h-screen w-screen'>
            <Navbar />
            <Sidebar handleChangeTheme={handleChangeTheme} darkMode={darkMode}/>
            <Content>
                {children}
            </Content>
        </div>
        : <div>{children}</div>
    }
    </>
  )
}