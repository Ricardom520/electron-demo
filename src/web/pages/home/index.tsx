import React, { useEffect, useRef, useState } from 'react'
import { Progress } from 'antd'
import { urls } from '@/libs/consts'
import styles from './index.module.less'

type MenuItem = typeof urls[number]

const Home: React.FC = () => {
  const timer = useRef<NodeJS.Timer>()
  const webviewRef = useRef<HTMLWebViewElement>(null)
  const [activeMenu, setActiveMenu] = useState<MenuItem>()
  const [transitionend, setTransitionend] = useState<boolean>(false)
  const [webviewPercent, setWebviewPercent] = useState<number>(0)

  /** 菜单点击 */
  const onItemClick = (item: MenuItem) => {
    setActiveMenu(item)
  }

  const onWebviewAnimationEnd = () => {
    setTransitionend(true)
  }

  useEffect(() => {
    console.log('webviewRef:', webviewRef)
    if (webviewRef.current) {
      webviewRef.current.addEventListener('dom-ready', () => {
        console.log('dom=reayd')
        setWebviewPercent(100)
      })
    } 
  }, [transitionend])

  useEffect(() => {
    if (transitionend && activeMenu) {
      if (timer.current) return

      timer.current = setInterval(() => {
        if (webviewPercent + 10 === 100) {
          clearInterval(timer.current)
          timer.current = undefined
        } else {
          setWebviewPercent(webviewPercent + 10)
        }
      }, 200)
    }
  }, [activeMenu, transitionend])

  useEffect(() => {
    if (webviewPercent === 100) {
      clearInterval(timer.current)
      timer.current = undefined
    }
  }, [webviewPercent])

  return (
    <div className={styles.home}>
      <ul className={styles.menu + ' ' + (transitionend ? styles.scroll : '')}>
        {urls.map((item, index) => {
          return (
            <li className={styles.item + ' ' + (activeMenu?.url === item.url ? styles.active : '')} key={`url_${index}`} onClick={() => onItemClick(item)}>
              <div className={styles['icon-box']}>
                <img className={styles.icon} src={item.icon} />
              </div>
              <p className={styles.name + ' textOverflow'}>{item.name}</p>
            </li>
          )
        })}
      </ul>
      <div onAnimationEnd={onWebviewAnimationEnd} style={transitionend ? { position: 'relative', top: 0, left: 0, transform: 'none'} : undefined } className={styles['webview-box'] + ' ' + (activeMenu ? styles.show : '')}>
        
        {transitionend && (
          <>
          <webview ref={webviewRef} style={{width: '100%', height: '100%'}} src={activeMenu?.url}></webview>
          {webviewPercent !== 100 && (
            <Progress size='small' showInfo={false} className={styles.progress} percent={webviewPercent} strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }} />
          )}
          </>
        ) }
      </div>
    </div>
  )
}

export default Home
