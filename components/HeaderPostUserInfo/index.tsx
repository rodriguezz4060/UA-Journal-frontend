import React, { useState } from 'react'
import Link from 'next/link'
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
import { useRouter } from 'next/router'
import styles from './HederPostUserInfo.module.scss'
import { Api } from '../../utils/api'
import { ResponseUser } from '../../utils/api/types'
import MoreIcon from '@material-ui/icons/MoreHorizOutlined'
import { useAppSelector } from '../../redux/hooks'
import { selectUserData } from '../../redux/slices/user'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'

import moment from 'moment'
import 'moment/locale/ru'
moment.locale('ru')

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

interface HeaderUserProps {
	id: number
	onRemove: (id: number) => void
	user: ResponseUser
	createdAt: string
	showTime: boolean
}

export const HeaderUser: React.FC<HeaderUserProps> = ({
	id,
	onRemove,
	user,
	createdAt,
	showTime
}) => {
	const classes = useStyles()
	const [open, setOpen] = React.useState(false)
	const anchorRef = React.useRef<HTMLButtonElement>(null)
	const userData = useAppSelector(selectUserData)

	const [buttonVisible, setButtonVisible] = React.useState(false)

	React.useEffect(() => {
		if (!buttonVisible && userData && user.id === userData.id) {
			setButtonVisible(true)
		}
	}, [buttonVisible, userData, user.id])

	const handleRemove = async () => {
		try {
			await Api().post.remove(id)
			onRemove(id)
		} catch (err) {
			console.warn('Remove post', err)
		}
	}

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

	const router = useRouter()
	const [anchorEl, setAnchorEl] = React.useState(null)

	const handleClick = event => {
		setAnchorEl(event.currentTarget)
	}

	const handleEdit = () => {
		router.push(`/write/${id}`)
	}

	const timeDifference = moment()
		.startOf('day')
		.diff(moment(createdAt).startOf('day'), 'days')
	let displayTime

	if (timeDifference < 1) {
		displayTime = moment(createdAt).fromNow()
	} else if (timeDifference === 1 && showTime) {
		displayTime = `вчера в ${moment(createdAt).format('HH:mm')}`
	} else {
		displayTime = showTime
			? moment(createdAt).format('DD MMM в HH:mm')
			: moment(createdAt).format('DD MMM')
	}

	return (
		<div className={styles.postContent}>
			<div className={styles.userInfoContent}>
				<div className={styles.userInfo}>
					<Link className={styles.profileLink} href={`/profile/${user.id}`}>
						{user.avatarUrl !== '' ? (
							<Avatar className={styles.userAvatar} src={user.avatarUrl} />
						) : (
							<Avatar className={`${styles.userAvatar}`}>
								{user.fullName[0]}
							</Avatar>
						)}

						<b>{user.fullName}</b>
					</Link>

					<div>
						<span>{displayTime}</span>
					</div>
				</div>
				{buttonVisible && (
					<div className={styles.userInfoControl}>
						<Button
							ref={anchorRef}
							className={styles.profile_button}
							aria-controls={open ? 'menu-list-grow' : undefined}
							aria-haspopup='true'
							onClick={handleToggle}
						>
							<MoreIcon />
						</Button>

						<Popper
							open={open}
							anchorEl={anchorRef.current}
							role={undefined}
							transition
							disablePortal
							style={{
								zIndex: 1
							}}
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
											<div className={styles.menu__item}>
												<MenuList
													autoFocusItem={open}
													id='menu-list-grow'
													onKeyDown={handleListKeyDown}
												>
													<div className={styles.menu__item}>
														<MenuItem onClick={handleRemove}>Удалить</MenuItem>
													</div>
													<div className={styles.menu__item}>
														<MenuItem onClick={handleEdit}>
															Редактировать
														</MenuItem>
													</div>
												</MenuList>
											</div>
										</ClickAwayListener>
									</Paper>
								</Grow>
							)}
						</Popper>
					</div>
				)}
			</div>
		</div>
	)
}
