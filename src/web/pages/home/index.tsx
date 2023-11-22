import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Progress } from 'antd'
import { PoweroffOutlined } from '@ant-design/icons'
import { urls } from '@/libs/consts'
import styles from './index.module.less'

type MenuItem = typeof urls[number]

const Home: React.FC = () => {
  const timer = useRef<NodeJS.Timer>()
  const webviewRef = useRef<HTMLWebViewElement>(null)
  const [activeMenu, setActiveMenu] = useState<MenuItem>()
  const [transitionend, setTransitionend] = useState<boolean>(false)
  const [showWebview, setShowWebview] = useState<boolean>(false)
  const [webviewPercent, setWebviewPercent] = useState<number>(0)

  /** 菜单点击 */
  const onItemClick = (item: MenuItem) => {
    setTransitionend(false)
    setActiveMenu(item)
    setShowWebview(true)
  }

  useEffect(() => {
    if (webviewRef.current) {
      webviewRef.current.addEventListener('dom-ready', () => {
        setTransitionend(true)
        setWebviewPercent(100)
      })
    }
  }, [showWebview])

  useEffect(() => {
    if (showWebview && activeMenu) {
      if (timer.current) return

      timer.current = setInterval(() => {
        if (webviewPercent < 100) {
          setWebviewPercent((webviewPercent) => webviewPercent + 10)
        } else {
          clearInterval(timer.current)
          timer.current = undefined
          setWebviewPercent(0)
        }
      }, 200)
    }
  }, [activeMenu, showWebview, webviewPercent])

  useEffect(() => {
    if (webviewPercent >= 100) {
      clearInterval(timer.current)
      timer.current = undefined
      setWebviewPercent(0)
    }
  }, [webviewPercent])

  useLayoutEffect(() => {
    window.electronAPI.pageReady('home')
  }, [])

  return (
    <div className={styles.home}>
      <div className={styles.menubox + ' ' + (showWebview ? styles.scroll : '')}>
        <ul className={styles.menu}>
          {urls.map((item, index) => {
            return (
              <li
                className={styles.item + ' ' + (activeMenu?.url === item.url ? styles.active : '')}
                key={`url_${index}`}
                onClick={() => onItemClick(item)}
              >
                <div className={styles['icon-box']}>
                  <img className={styles.icon} src={item.icon} />
                </div>
                <p className={styles.name + ' textOverflow'}>{item.name}</p>
              </li>
            )
          })}
        </ul>
        {showWebview && (
          <div className={styles['menu-tools']}>
            <div className={styles['menu-tools-item']} onClick={() => setShowWebview(false)}>
              <PoweroffOutlined style={{ marginRight: '5px' }} />
              返回
            </div>
          </div>
        )}
      </div>
      <div
        style={
          showWebview ? { position: 'relative', top: 0, left: 0, transform: 'none' } : undefined
        }
        className={styles['webview-box'] + ' ' + (activeMenu ? styles.show : '')}
      >
        {showWebview && (
          <>
            <webview
              ref={webviewRef}
              style={{ width: '100%', height: '100%' }}
              src={activeMenu?.url}
            ></webview>
            {!transitionend && (
              <Progress
                size='small'
                showInfo={false}
                className={styles.progress}
                percent={webviewPercent}
                strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Home
