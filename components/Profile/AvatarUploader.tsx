import React, { useState } from 'react'
import axios from 'axios'
import {
	Avatar,
	Button,
	ClickAwayListener,
	Grow,
	MenuItem,
	MenuList,
	Paper,
	Popper
} from '@material-ui/core'
import AddPhotoIcon from '@material-ui/icons/AddPhotoAlternateOutlined'
import CreateIcon from '@material-ui/icons/CreateOutlined'
import styles from './Porfile.module.scss'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import PhotoIcon from '@material-ui/icons/InsertPhotoOutlined'
import HeaderCover from './HeaderCover'
import { useAppSelector } from '../../redux/hooks'
import { selectUserData, setUserData } from '../../redux/slices/user'
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

interface AvatarUploaderProps {
	headerCoverUrl?: string | null
	headerCoverPosition?: string | null
}

const AvatarUploader = ({
	headerCoverUrl,
	headerCoverPosition
}: AvatarUploaderProps) => {
	const userData = useAppSelector(selectUserData)
	const [selectedFile, setSelectedFile] = useState<File | null>(null)
	// const [uploadedAvatarUrl, setUploadedAvatarUrl] = useState<string | null>(
	// 	userData.avatarUrl
	// )

	const classes = useStyles()
	const [open, setOpen] = React.useState(false)
	const anchorRef = React.useRef<HTMLButtonElement>(null)
	const dispatch = useDispatch()

	const handleToggle = () => {
		setOpen(prevOpen => !prevOpen)
	}

	const handleClose = (event: React.MouseEvent<EventTarget>) => {
		if (
			anchorRef.current &&
			anchorRef.current.contains(event.target as HTMLElement)
		) {
			return
		}

		setOpen(false)
	}

	function handleListKeyDown(event: React.KeyboardEvent) {
		if (event.key === 'Tab') {
			event.preventDefault()
			setOpen(false)
		}
	}

	const prevOpen = React.useRef(open)
	React.useEffect(() => {
		if (prevOpen.current === true && open === false) {
			anchorRef.current!.focus()
		}

		prevOpen.current = open
	}, [open])

	const handleFileChange = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		if (event.target.files && event.target.files.length > 0) {
			const file = event.target.files[0]
			setSelectedFile(file)
			try {
				const formData = new FormData()
				formData.append('file', file)
				const token = document.cookie.replace(
					/(?:(?:^|.*;\s*)rtoken\s*=\s*([^;]*).*$)|^.*$/,
					'$1'
				)
				await axios.patch('http://localhost:7777/users/avatar', formData, {
					headers: {
						'Content-Type': 'multipart/form-data',
						Authorization: `Bearer ${token}`
					}
				})
				const fileReader = new FileReader()
				fileReader.onload = () => {
					const uploadedAvatarUrl = fileReader.result as string
					console.log('Аватарка успешно загружена')
					const updatedUserData = { ...userData, avatarUrl: uploadedAvatarUrl }
					dispatch(setUserData(updatedUserData))
				}
				fileReader.readAsDataURL(file)
			} catch (error) {
				console.error('Ошибка загрузки аватарки:', error)
			}
		}
	}

	const handleUploadClick = () => {
		document.getElementById('upload-avatar').click()
	}

	return (
		<div className={styles.pageWrapper}>
			<style>
				{`
          :root {
            --wrapper-padding-top: 40px;
            --max-width-container: 960px
          }
        `}
			</style>
			<HeaderCover
				headerCoverUrl={headerCoverUrl}
				headerCoverPosition={headerCoverPosition}
			/>
			<div>
				<input
					id='upload-avatar'
					type='file'
					accept='image/*'
					onChange={handleFileChange}
					style={{ display: 'none' }}
				/>
				<div className={styles.header__avatar}>
					<div className={styles.headerAvatar}>
						<div className={styles.headerAvatar__media} onClick={handleToggle}>
							<Button
								className={styles.buttonAvatar}
								ref={anchorRef}
								aria-controls={open ? 'menu-list-grow' : undefined}
								aria-haspopup='true'
								onClick={handleToggle}
							>
								{userData?.avatarUrl !== null ? (
									<Avatar
										className={styles.headerAvatar__media}
										src={userData?.avatarUrl}
										aria-controls='avatar-menu'
										aria-haspopup='true'
									/>
								) : (
									<Avatar className={styles.headerAvatar__media}>
										{userData.fullName[0]}
									</Avatar>
								)}

								<div className={styles.headerAvatarManage}>
									<AddPhotoIcon />
								</div>
							</Button>
						</div>
					</div>
					<div>
						<Popper
							className={styles.menuMain}
							open={open}
							anchorEl={anchorRef.current}
							role={undefined}
							transition
							disablePortal
						>
							{({ TransitionProps, placement }) => (
								<Grow
									{...TransitionProps}
									style={{
										transformOrigin:
											placement === 'bottom' ? 'center top' : 'center bottom'
									}}
								>
									<Paper className={styles.menuForm}>
										<ClickAwayListener onClickAway={handleClose}>
											<MenuList
												autoFocusItem={open}
												id='menu-list-grow'
												onKeyDown={handleListKeyDown}
											>
												<div className={styles.avatar_menu__item}>
													<MenuItem onClick={handleUploadClick}>
														<CreateIcon />
														Изменить
													</MenuItem>
												</div>
												<div className={styles.avatar_menu__item}>
													<MenuItem>
														<PhotoIcon />
														Посмотреть
													</MenuItem>
												</div>
											</MenuList>
										</ClickAwayListener>
									</Paper>
								</Grow>
							)}
						</Popper>
					</div>
				</div>
			</div>
		</div>
	)
}

export default AvatarUploader
