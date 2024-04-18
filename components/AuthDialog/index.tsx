import React from 'react'
import { DialogContent, Dialog, DialogContentText, Typography } from '@material-ui/core'
import styles from './AuthDialog.module.scss'
import ArrowBackIcon from '@material-ui/icons/ArrowBackOutlined'
import { MainForm } from './Forms/Main'
import { LoginForm } from './Forms/Login'
import { RegisterForm } from './Forms/Register'

interface AuthDialogProps {
  visible: boolean
  onClose: () => void
}

export const AuthDialog: React.FC<AuthDialogProps> = ({ onClose, visible }) => {
  const [formType, setFormType] = React.useState<'main' | 'login' | 'register'>('main')

  return (
    <Dialog open={visible} onClose={onClose} maxWidth='xs' fullWidth disableScrollLock={true}>
      <DialogContent>
        <DialogContentText>
          <div className={styles.content}>
            <Typography className={styles.title}>
              {formType === 'main' ? (
                'Вход в UAJ'
              ) : (
                <p onClick={() => setFormType('main')} className={styles.backTitle}>
                  <ArrowBackIcon />К авторизации
                </p>
              )}
            </Typography>
            {formType === 'main' && <MainForm onOpenLogin={() => setFormType('login')} />}
            {formType === 'login' && <LoginForm onOpenRegister={() => setFormType('register')} />}
            {formType === 'register' && (
              <RegisterForm
                onOpenRegister={() => setFormType('register')}
                onOpenLogin={() => setFormType('login')}
              />
            )}
          </div>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  )
}
