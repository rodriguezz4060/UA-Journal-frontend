import React from 'react'
import { TextField } from '@material-ui/core'
import { useFormContext, FieldError } from 'react-hook-form'

interface FormFieldProps {
	name: string
	label: string
}

export const FormField: React.FC<FormFieldProps> = ({ name, label }) => {
	const { register, formState } = useFormContext()

	// Convert the error object to a string if it exists
	const errorMessage = formState.errors[name]?.message?.toString()

	return (
		<TextField
			{...register(name)}
			name={name}
			className='mb-20'
			size='small'
			label={label}
			variant='outlined'
			error={!!errorMessage}
			helperText={errorMessage}
			fullWidth
		/>
	)
}
