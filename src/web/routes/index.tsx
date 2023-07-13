import Home from '../pages/home'

export interface RoutesItem {
  title: string
  component: React.ReactNode
  path: string
}

export const routes: RoutesItem[] = [
  {
    title: 'home',
    component: <Home />,
    path: '/'
  },
]