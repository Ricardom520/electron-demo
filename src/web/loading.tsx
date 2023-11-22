import { createRoot } from 'react-dom/client'
import Loading from './pages/loading'
import './index.less'

createRoot(document.getElementById('root') as Element).render(<Loading />)
