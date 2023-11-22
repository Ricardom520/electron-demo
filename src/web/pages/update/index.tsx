import React, { useCallback } from 'react'
import { Button } from 'antd'
import UpdateIcon from './update.jpg'
import styles from './index.module.less'

const Update: React.FC = () => {
  const onClose = useCallback(() => {
    console.log('')
  }, [])
  return (
    <div className={styles.update}>
      <div className={styles['update-box']}>
        <img className={styles['update-bg']} src={UpdateIcon} />
        <div className={styles['update-desc']}>
          <p className={styles['update-desc-line']}>有新版本喔~</p>
          <Button onClick={onClose}>关闭窗口</Button>
          <Button type='primary'>立即更新</Button>
        </div>
      </div>
    </div>
  )
}

export default Update
