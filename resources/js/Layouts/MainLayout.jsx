import Navbar from '../Pages/Navbar/Navbar'
import Sidebar from '../Pages/Sidebar/Sidebar'

export default function Layout({ children }) {
  return (
    <div className="antialiased bg-gray-50 dark:bg-gray-900">
        <Navbar/>
        <Sidebar/>
        <div>{children}</div>
    </div>
  )
}