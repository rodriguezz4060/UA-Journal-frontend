import React, { MouseEvent, TouchEvent, useRef } from 'react'
import { useState } from 'react'
import ArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import ArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import {
	InputAdornment,
	MenuItem,
	TextField,
	ClickAwayListener,
	Grow,
	MenuList,
	Paper,
	Popper,
	makeStyles,
	Theme,
	createStyles
} from '@material-ui/core'
import avatarStyles from '../Porfile.module.scss'
import styles from './Settings.module.scss'
import axios from 'axios'
import { parseCookies } from 'nookies'
import { useAppSelector } from '../../../redux/hooks'
import { selectUserData, setUserData } from '../../../redux/slices/user'
import { useDispatch } from 'react-redux'

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			display: 'flex'
		},
		paper: {
			marginRight: theme.spacing(2)
		}
	})
)

interface SettingsMainProps {}

const Profile: React.FC<SettingsMainProps> = ({}) => {
	const userData = useAppSelector(selectUserData)

	// Проверка на null и undefined
	if (!userData) {
		return <div>Загрузка...</div> // Или любой другой компонент, который будет отображаться, пока данные не будут загружены
	}

	const [error, setError] = useState('')
	const [focused, setFocused] = useState(false)
	const classes = useStyles()

	const [openSvg, setOpenSvg] = useState(false)
	const [open, setOpen] = useState(false)
	const anchorRef = React.useRef<HTMLDivElement>(null)

	const [fullName, setFullName] = useState(userData.fullName)
	const [description, setDescription] = useState(userData.description)
	const [feed, setFeed] = useState(userData.feed)
	const [selectedOption, setSelectedOption] = useState(feed)
	const dispatch = useDispatch()

	const handleSubmit = async () => {
		try {
			const cookies = parseCookies()
			const token = cookies.rtoken
			const formData = {
				fullName: fullName,
				description: description,
				feed: feed
			}

			const response = await axios.patch(
				'http://localhost:7777/users/me',
				formData,
				{
					headers: {
						Authorization: `Bearer ${token}`
					}
				}
			)
			if (response.data && response.data.fullName) {
				setFullName(response.data.fullName)
				setDescription(response.data.description)
				setFeed(response.data.feed)
				setError('')
				dispatch(setUserData(response.data)) // Обновление состояния userData
			}
		} catch (error) {
			setError('Ошибка при сохранении данных')
			console.error(error)
		}
	}

	const handleUserNameChange = (event: any) => {
		const value = event.target.value
		if (value.length <= 30) {
			setFullName(value)
			if (/[<>{}"№'`^*[\]@]/.test(value)) {
				setError('Неподходящая длина или формат никнейма')
			} else {
				setError('')
			}
		} else {
			setError('')
		}
	}

	const handleChange = (e: any) => {
		const inputValue = e.target.value
		setDescription(inputValue)
	}

	const handleToggle = () => {
		setOpen(prevOpen => !prevOpen)
	}

	const handleClose = (event: React.MouseEvent<Document>) => {
		if (anchorRef.current && anchorRef.current.contains(event.target as Node)) {
			return
		}

		setOpen(false)
	}

	const handleListKeyDown = (event: any) => {
		if (event.key === 'Tab') {
			event.preventDefault()
			setOpen(false)
		}
	}

	const handleMenuItemClick = (option: React.SetStateAction<string>) => {
		setSelectedOption(option)
		if (option === 'Популярное') {
			setFeed('popular')
		} else if (option === 'Новое') {
			setFeed('new')
		} else if (option === 'Моя лента') {
			setFeed('myFeed')
		}
		setOpen(false)
	}

	const prevOpen = useRef(open)
	React.useEffect(() => {
		if (prevOpen.current === true && open === false) {
			anchorRef.current!.focus()
		}

		prevOpen.current = open
	}, [open])

	return (
		<>
			<div className={styles.formSection}>
				<label className={styles.formSection__label}>Отображаемое имя</label>
				<form className={styles.textFieldStyles}>
					<TextField
						size='small'
						label=''
						variant='outlined'
						fullWidth
						required
						InputLabelProps={{ shrink: false }}
						error={!!error}
						helperText={error}
						InputProps={{
							endAdornment: (
								<InputAdornment position='end'>
									{30 - fullName.length}
								</InputAdornment>
							)
						}}
						value={fullName}
						onChange={handleUserNameChange}
					/>
				</form>
			</div>
			<div className={styles.formSection}>
				<label className={styles.formSection__label}>Описание к блогу</label>
				<form>
					<TextField
						size='small'
						label=''
						multiline
						minRows={2}
						variant='outlined'
						fullWidth
						InputLabelProps={{ shrink: true }}
						InputProps={{
							placeholder: 'Пара слов о себе',
							inputProps: { maxLength: 160 },
							endAdornment:
								description !== null && description.length <= 150 ? null : (
									<InputAdornment position='end'>
										{description !== null ? 160 - description.length : null}
									</InputAdornment>
								)
						}}
						value={description !== null ? description : ''}
						onChange={handleChange}
					/>
				</form>
			</div>
			<div className={styles.formSection}>
				<label className={styles.formSection__label}>Лента по умолчанию</label>
				<form>
					<div
						ref={anchorRef}
						aria-controls={open ? 'menu-list-grow' : undefined}
						aria-haspopup='true'
						onClick={handleToggle}
						style={{ width: '100%' }}
						className={styles.textarea}
					>
						<TextField
							size='small'
							label=''
							variant='outlined'
							fullWidth
							InputLabelProps={{
								shrink: true,
								style: { cursor: 'pointer' }
							}}
							value={
								feed === 'new'
									? 'Новое'
									: feed === 'popular'
									? 'Популярное'
									: 'Моя лента'
							}
							onChange={event => setFeed(event.target.value)}
							inputProps={{
								ref: anchorRef,
								style: { cursor: 'pointer' },
								readOnly: true
							}}
							onFocus={() => {
								setFocused(true)
								setOpenSvg(true)
							}}
							onBlur={() => {
								setFocused(false)
								setOpenSvg(false)
							}}
							InputProps={{
								endAdornment: (
									<InputAdornment position='end'>
										{focused ? (
											<ArrowUpIcon style={{ width: 20, height: 20 }} />
										) : (
											<ArrowDownIcon
												className={styles.arrowIco}
												style={{ width: 20, height: 20 }}
											/>
										)}
									</InputAdornment>
								)
							}}
						/>
					</div>
					<Popper
						open={open}
						anchorEl={anchorRef.current}
						role={undefined}
						transition
						disablePortal
						style={{ width: anchorRef.current?.clientWidth, zIndex: 6 }}
					>
						{({ TransitionProps }) => (
							<Grow {...TransitionProps}>
								<Paper
									className={avatarStyles.menuForm}
									style={{ width: '100%', margin: '8px 0' }}
								>
									<ClickAwayListener onClickAway={handleClose}>
										<div className={avatarStyles.avatar_menu__item}>
											<MenuList
												autoFocusItem={open}
												id='menu-list-grow'
												onKeyDown={handleListKeyDown}
											>
												<div className={avatarStyles.avatar_menu__item}>
													<MenuItem
														selected={selectedOption === 'Популярное'}
														onClick={() => handleMenuItemClick('Популярное')}
													>
														Популярное
													</MenuItem>
												</div>
												<div className={avatarStyles.avatar_menu__item}>
													<MenuItem
														selected={selectedOption === 'Новое'}
														onClick={() => handleMenuItemClick('Новое')}
													>
														Новое
													</MenuItem>
												</div>
												<div className={avatarStyles.avatar_menu__item}>
													<MenuItem
														selected={selectedOption === 'Моя лента'}
														onClick={() => handleMenuItemClick('Моя лента')}
													>
														Моя лента
													</MenuItem>
												</div>
											</MenuList>
										</div>
									</ClickAwayListener>
								</Paper>
							</Grow>
						)}
					</Popper>
				</form>
			</div>
			<div
				className={`${styles.scrollFooter} ${styles.settingsFooter} ${styles.islandBg}`}
			>
				<button
					onClick={handleSubmit}
					className={`${styles.userPlus__saveButton} ${avatarStyles.button} ${avatarStyles.buttonBlue} ${avatarStyles.buttonSizeDefault}`}
				>
					<span className={styles.button__label}>Сохранить</span>
				</button>
			</div>
		</>
	)
}

export default Profile
