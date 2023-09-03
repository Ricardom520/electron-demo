import { createRoot } from "react-dom/client"
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom'
import { routes } from './routes'

import './index.less'

const BaseRoutes = (
  <Routes>
    {routes.map((item, index) => {
      return <Route path={item.path} element={item.component} key={index} />
    })}
    <Route path='*' element={<Navigate to={routes[0].path} replace={true} />} />
  </Routes>
)

createRoot(document.getElementById("root") as Element).render(
    <HashRouter children={BaseRoutes} />
);
