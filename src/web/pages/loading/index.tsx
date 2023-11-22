import React, { useLayoutEffect } from 'react'
import './index.less'

const Loading: React.FC = () => {
  useLayoutEffect(() => {
    window.electronAPI.pageReady('loading')
  }, [])
  return (
    <div className='container'>
      <div className='loader'>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <p>Askr Yggdrasills 正在加载...</p>
    </div>
  )
}

export default Loading
