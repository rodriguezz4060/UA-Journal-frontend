import React from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { LoginFormSchema } from '../../../utils/validations'
import { FormField } from '../../FormField'
import { LoginDto } from '../../../utils/api/types'
import { setCookie } from 'nookies'
import { useAppDispatch } from '../../../redux/hooks'
import { setUserData } from '../../../redux/slices/user'
import { Api } from '../../../utils/api'
import { Button } from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'

interface LoginFormProps {
	onOpenRegister: () => void
}

export const LoginForm: React.FC<LoginFormProps> = ({ onOpenRegister }) => {
	const dispatch = useAppDispatch()
	const [errorMessage, setErrorMessage] = React.useState('')
	const form = useForm({
		mode: 'onChange',
		resolver: yupResolver(LoginFormSchema)
	})

	const onSubmit = async (dto: LoginDto) => {
		try {
			const data = await Api().user.login(dto)
			setCookie(null, 'rtoken', data.token, {
				maxAge: 30 * 24 * 60 * 60,
				path: '/'
			})
			setErrorMessage('')
			dispatch(setUserData(data))
		} catch (err) {
			console.warn('Login error', err)
			// Если ошибка - это строка, то просто устанавливаем ее как сообщение об ошибке
			if (typeof err === 'string') {
				setErrorMessage(err)
			} else if (err instanceof Error) {
				// Если ошибка является объектом ошибки, то извлекаем ее сообщение
				setErrorMessage(err.message)
			} else {
				// Если ошибка не является объектом ошибки и не является строкой,
				// то устанавливаем стандартное сообщение об ошибке
				setErrorMessage('Произошла неизвестная ошибка.')
			}
		}
	}

	return (
		<div>
			<FormProvider {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<FormField name='email' label='Почта' />
					<FormField name='password' label='Пароль' />
					{errorMessage && (
						<Alert severity='error' className='mb-20'>
							{errorMessage}
						</Alert>
					)}
					<div className='d-flex align-center justify-between'>
						<Button
							disabled={!form.formState.isValid || form.formState.isSubmitting}
							type='submit'
							color='primary'
							variant='contained'
						>
							Войти
						</Button>
						<Button onClick={onOpenRegister} color='primary' variant='text'>
							Регистрация
						</Button>
					</div>
				</form>
			</FormProvider>
		</div>
	)
}
