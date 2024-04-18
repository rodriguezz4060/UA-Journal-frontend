import React from 'react'
import { setCookie } from 'nookies'
import { useForm, FormProvider } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { RegisterFormSchema } from '../../../utils/validations'
import { FormField } from '../../FormField'
import { CreateUserDto } from '../../../utils/api/types'
import { useAppDispatch } from '../../../redux/hooks'
import { setUserData } from '../../../redux/slices/user'
import { Button } from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'
import { Api } from '../../../utils/api'

interface LoginFormProps {
	onOpenRegister: () => void
	onOpenLogin: () => void
}

export const RegisterForm: React.FC<LoginFormProps> = ({
	onOpenRegister,
	onOpenLogin
}) => {
	const dispatch = useAppDispatch()
	const [errorMessage, setErrorMessage] = React.useState('')
	const form = useForm({
		mode: 'onChange',
		resolver: yupResolver(RegisterFormSchema)
	})

	const onSubmit = async (dto: CreateUserDto) => {
		try {
			const data = await Api().user.register(dto)
			setCookie(null, 'authToken', data.token, {
				maxAge: 30 * 24 * 60 * 60,
				path: '/'
			})
			setErrorMessage('')
			dispatch(setUserData(data))
		} catch (err) {
			console.warn('Register error', err)
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
				<FormField name='fullName' label='Имя и Фамилия' />
				<FormField name='email' label='Почта' />
				<FormField name='password' label='Пароль' />
				{errorMessage && (
					<Alert severity='error' className='mb-20'>
						{errorMessage}
					</Alert>
				)}
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<div className='d-flex align-center justify-between'>
						<Button
							disabled={!form.formState.isValid || form.formState.isSubmitting}
							type='submit'
							color='primary'
							variant='contained'
						>
							Зарегистрироваться
						</Button>
						<Button onClick={onOpenLogin} color='primary' variant='text'>
							Войти
						</Button>
					</div>
				</form>
			</FormProvider>
		</div>
	)
}
