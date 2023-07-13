import React from 'react'
import styles from './index.module.less'

const Home: React.FC = () => {
  return (
    <div>Hello World1
      <webview style={{width: 500}} src="http://www.google.com/"></webview>
    </div>
  )
}

export default Home
