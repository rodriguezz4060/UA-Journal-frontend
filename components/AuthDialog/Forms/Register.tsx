import React from 'react'
import { setCookie } from 'nookies'
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form'
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
	const form = useForm<CreateUserDto>({
		mode: 'onChange',
		resolver: yupResolver(RegisterFormSchema)
	})

	const onSubmit: SubmitHandler<CreateUserDto> = async dto => {
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
					<FormField name='fullName' label='Имя и Фамилия' />
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
