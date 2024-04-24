import React, { useState } from 'react'
import {
	Button,
	Paper,
	IconButton,
	Avatar,
	List,
	ListItem,
	Menu,
	MenuItem,
	ListSubheader
} from '@material-ui/core'
import styles from './Header.module.scss'
import SearchIcon from '@material-ui/icons/Search'
import Link from 'next/link'
import CreateIcon from '@material-ui/icons/CreateOutlined'
import MessageIcon from '@material-ui/icons/SmsOutlined'
import NotificationIcon from '@material-ui/icons/NotificationsOutlined'
import SideMenu from '@material-ui/icons/MenuOutlined'
import ArrowBottom from '@material-ui/icons/KeyboardArrowDownOutlined'
import LogoutIcon from '@material-ui/icons/ExitToAppRounded'
import SettingsIcon from '@material-ui/icons/SettingsOutlined'
import logo from '/pages/static/img/logo.svg'
import Image from 'next/image'
import { AuthDialog } from '../AuthDialog'
import UserIcon from '@material-ui/icons/AccountCircleOutlined'
import { useAppSelector } from '../../redux/hooks'
import { selectUserData } from '../../redux/slices/user'
import { PostItem } from '../../utils/api/types'
import { Api } from '../../utils/api'
import { destroyCookie } from 'nookies'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { toggleMenu } from '../../redux/slices/menuSlice'

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = ({}) => {
	const userData = useAppSelector(selectUserData)
	const [authVisible, setAuthVisible] = React.useState(false)
	const [searchValue, setSearchValue] = React.useState('')
	const [posts, setPosts] = React.useState<PostItem[]>([])
	const [anchorEl, setAnchorEl] = useState<null | HTMLButtonElement>(null)
	const [avatarUrl, setAvatarUrl] = React.useState(userData?.avatarUrl || '')

	const dispatch = useDispatch()

	React.useEffect(() => {
		if (userData && userData.avatarUrl) {
			setAvatarUrl(userData.avatarUrl)
		}
	}, [userData])

	const handleToggleMenu = () => {
		dispatch(toggleMenu())
	}

	const openAuthDialog = () => {
		setAuthVisible(true)
	}

	const closeAuthDialog = () => {
		setAuthVisible(false)
	}

	React.useEffect(() => {
		if (authVisible && userData) {
			setAuthVisible(false)
		}
	}, [authVisible, userData])

	const handleChangeInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const inputValue = e.target.value
		setSearchValue(inputValue)
		try {
			if (inputValue) {
				const { items } = await Api().post.search({ title: inputValue })
				setPosts(items)
			} else {
				setPosts([])
			}
		} catch (error) {
			console.warn(error)
		}
	}

	const handleClick = (
		event: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		setAnchorEl(event.currentTarget)
	}

	const handleClose = () => {
		setAnchorEl(null)
	}

	const router = useRouter()

	const handleLogout = () => {
		// Очистите токен аутентификации на стороне клиента
		destroyCookie(null, 'rtoken')
		destroyCookie(null, 'authToken')

		// Перенаправьте пользователя на страницу входа
		router.reload()
	}

	return (
		<Paper classes={{ root: styles.root }} elevation={0}>
			<div className='d-flex align-center'>
				<IconButton
					className={`${styles.sideMenu} ${styles.profile_button}`}
					onClick={handleToggleMenu}
				>
					<SideMenu style={{ width: 24, height: 24 }} />
				</IconButton>
				<Link href='/'>
					<Image className={styles.logo} src={logo} alt='Logo' />
				</Link>

				<div className={styles.searchBlock}>
					<SearchIcon />
					<input
						value={searchValue}
						onChange={handleChangeInput}
						placeholder='Поиск'
					/>
					{posts.length > 0 && (
						<Paper className={styles.searchBlockPopup}>
							<List>
								{posts.map(obj => (
									<Link key={obj.id} href={`/news/${obj.id}`}>
										<ListItem button>{obj.title}</ListItem>
									</Link>
								))}
							</List>
						</Paper>
					)}
				</div>

				<Link href={'/write'}>
					<Button variant='contained' className={styles.penBottom}>
						<CreateIcon /> Написать
					</Button>
				</Link>
			</div>

			<div className='d-flex align-center'>
				<IconButton>
					<MessageIcon />
				</IconButton>
				<IconButton>
					<NotificationIcon />
				</IconButton>
				{userData ? (
					<div className='d-flex align-center'>
						<Link href={`/profile/${userData.id}`}>
							{avatarUrl !== '' ? (
								<div
									className={styles.avatar}
									style={{ backgroundImage: `url(${userData.avatarUrl})` }}
								></div>
							) : (
								<Avatar className={styles.avatar}>
									{userData.fullName[0]}
								</Avatar>
							)}
						</Link>
						<div>
							<Button
								className={styles.profile_button}
								aria-controls='menu'
								aria-haspopup='true'
								onClick={handleClick}
							>
								<ArrowBottom style={{ width: 20, height: 20 }} />
							</Button>
							<Menu
								id='menu'
								elevation={0}
								className={styles.profile_menu}
								PaperProps={{
									style: {
										width: '300px'
									}
								}}
								disableScrollLock={true}
								anchorEl={anchorEl}
								keepMounted
								open={Boolean(anchorEl)}
								onClose={handleClose}
							>
								{anchorEl && (
									<>
										<ListSubheader className={styles.account_menu_title}>
											Мой профиль
										</ListSubheader>
										<Link
											href={`/profile/${userData.id}`}
											className={styles.account_menu__user_card}
											onClick={handleClose}
										>
											<div className={styles.user_card}>
												<div>
													{avatarUrl !== '' ? (
														<div
															className={styles.avatar}
															style={{
																backgroundImage: `url(${userData.avatarUrl})`
															}}
														></div>
													) : (
														<Avatar className={styles.avatar}>
															{userData.fullName[0]}
														</Avatar>
													)}
												</div>
												<span className={styles.user_card__text}>
													<p className={styles.user_card__name}>
														<span>{userData.fullName}</span>
													</p>
													<p className={styles.user_card__sub_label}>
														Личный блог
													</p>
												</span>
											</div>
										</Link>
										<div className={styles.account_menu__item}>
											<MenuItem onClick={handleClose}>Menu Item 1</MenuItem>
										</div>
										<div className={styles.account_menu__item}>
											<Link href={`/profile/settings`}>
												<MenuItem onClick={handleClose}>
													<SettingsIcon />
													Настройки
												</MenuItem>
											</Link>
										</div>
										<div className={styles.account_menu__item}>
											<div onClick={handleLogout}>
												<MenuItem onClick={handleClose}>
													<LogoutIcon />
													Выйти
												</MenuItem>
											</div>
										</div>
									</>
								)}
							</Menu>
						</div>
					</div>
				) : (
					<div className={styles.loginButton} onClick={openAuthDialog}>
						<UserIcon />
						Войти
					</div>
				)}
			</div>
			<AuthDialog onClose={closeAuthDialog} visible={authVisible} />
		</Paper>
	)
}
