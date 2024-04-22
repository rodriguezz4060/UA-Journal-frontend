import React from 'react'
import {
	Typography,
	IconButton,
	MenuItem,
	Menu,
	Avatar
} from '@material-ui/core'
import MoreIcon from '@material-ui/icons/MoreHorizOutlined'

import styles from './Comment.module.scss'
import { ResponseUser } from '../../utils/api/types'
import { Api } from '../../utils/api'

import moment from 'moment'
import 'moment/locale/ru'
moment.locale('ru')

interface CommentPostProps {
	id: number
	user: ResponseUser
	text: string
	createdAt: string
	currentUserId?: number
	onRemove: (id: number) => void
	confirmRemove?: (message: string) => boolean
}

export const Comment: React.FC<CommentPostProps> = ({
	id,
	user,
	text,
	createdAt,
	currentUserId,
	onRemove,
	confirmRemove = window.confirm
}) => {
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget)
	}

	const handleClose = () => {
		setAnchorEl(null)
	}

	const handleClickRemove = async () => {
		if (confirmRemove('Удалить комментарий?')) {
			try {
				await Api().comment.remove(id)
				onRemove(id)
			} catch (err) {
				console.warn('Error remove comment', err)
				alert('Не удалось удалить комментарий')
			} finally {
				handleClose()
			}
		}
	}

	return (
		<div className={styles.comment}>
			<div className={styles.userInfo}>
				{user.avatarUrl !== '' ? (
					<div
						className={styles.userAvatar}
						style={{
							backgroundImage: `url(${user.avatarUrl})`
						}}
					></div>
				) : (
					<Avatar className={styles.userAvatar} src={user.fullName[0]} />
				)}
				<b>{user.fullName}</b>
				<span>
					<span>{moment(createdAt).fromNow()}</span>
				</span>
			</div>
			<Typography className={styles.text}>{text}</Typography>
			{user.id === currentUserId && (
				<>
					<span className={styles.replyBtn}>Ответить</span>
					<IconButton onClick={handleClick}>
						<MoreIcon />
					</IconButton>
					<Menu
						anchorEl={anchorEl}
						elevation={2}
						open={Boolean(anchorEl)}
						onClose={handleClose}
						keepMounted
					>
						<MenuItem onClick={handleClickRemove}>Удалить</MenuItem>
						<MenuItem onClick={handleClose}>Редактировать</MenuItem>
					</Menu>
				</>
			)}
		</div>
	)
}
