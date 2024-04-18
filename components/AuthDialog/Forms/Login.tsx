import React from 'react'
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form'
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
	const form = useForm<LoginDto>({
		mode: 'onChange',
		resolver: yupResolver(LoginFormSchema)
	})

	const onSubmit: SubmitHandler<LoginDto> = async dto => {
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
			if (typeof err === 'string') {
				setErrorMessage(err)
			} else if (err instanceof Error) {
				setErrorMessage(err.message)
			} else {
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
