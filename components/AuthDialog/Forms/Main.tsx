import MailIcon from '@material-ui/icons/MailOutline'
import AppleIcon from '@material-ui/icons/Apple'
import styles from '../AuthDialog.module.scss'
import React from 'react'
import { Button } from '@material-ui/core'

interface MainFormProps {
  onOpenLogin: () => void
}

export const MainForm: React.FC<MainFormProps> = ({ onOpenLogin }) => {
  return (
    <>
      <div>
        <Button onClick={onOpenLogin} className='mb-10' variant='contained' fullWidth>
          <MailIcon />
          Через почту
        </Button>
        <Button className='mb-10' variant='contained' fullWidth>
          <img src='https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg' alt='Google' />
          Google
        </Button>
        <Button className='mb-10' variant='contained' fullWidth>
          <AppleIcon />
          Apple
        </Button>
      </div>
      <div className={styles.miniButtons}>
        <Button className='mb-10' variant='contained' fullWidth>
          <MailIcon />
        </Button>
        <Button className='mb-10' variant='contained' fullWidth>
          <img src='https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg' alt='Google' />
        </Button>
        <Button className='mb-10' variant='contained' fullWidth>
          <AppleIcon />
        </Button>
      </div>
    </>
  )
}
