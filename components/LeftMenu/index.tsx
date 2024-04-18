import React from 'react'
import Link from 'next/link'
import { Button } from '@material-ui/core'
import {
  WhatshotOutlined as FireIcon,
  SmsOutlined as MessageIcon,
  TrendingUpOutlined as TrendingIcon,
  FormatListBulletedOutlined as ListIcon,
} from '@material-ui/icons'

import styles from './LeftMenu.module.scss'
import { useRouter } from 'next/router'

const menu = [
  { text: 'Популярное', icon: <FireIcon />, path: '/' },
  { text: 'Сообщения', icon: <MessageIcon />, path: '/messages' },
  { text: 'Рейтинг', icon: <TrendingIcon />, path: '/rating' },
  { text: 'Подписки', icon: <ListIcon />, path: '/follows' },
]

export const LeftMenu: React.FC = () => {
  const router = useRouter()

  const isActive = (path: string) => {
    return router.asPath === path ? styles.activeSvg : styles.inactiveSvg
  }

  return (
    <div className={styles.menu}>
      <ul>
        {menu.map(obj => (
          <li key={obj.path}>
            <Link href={obj.path}>
              <Button variant={router.asPath === obj.path ? 'contained' : 'text'}>
                <div className={isActive(obj.path)}>{obj.icon}</div>
                {obj.text}
              </Button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
