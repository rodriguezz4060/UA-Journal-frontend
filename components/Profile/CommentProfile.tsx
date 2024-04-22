import React, { useState } from 'react'
import Link from 'next/link'
import {
	Typography,
	IconButton,
	MenuItem,
	Menu,
	Avatar
} from '@material-ui/core'
import MoreIcon from '@material-ui/icons/MoreHorizOutlined'
import styles from './CommentProfile.module.scss'

import { PostItem, ResponseUser } from '../../utils/api/types'
import { Api } from '../../utils/api'
import moment from 'moment'
import 'moment/locale/ru'
moment.locale('ru')

interface CommentProfileProps {
	id: number
	user: ResponseUser
	text: string
	createdAt: string
	currentUserId: number
	onRemove: (id: number) => void
	post: PostItem
}

export const CommentProfile: React.FC<CommentProfileProps> = ({
	id,
	user,
	text,
	createdAt,
	currentUserId,
	onRemove,
	post
}) => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget)
	}

	const handleClose = () => {
		setAnchorEl(null)
	}

	const handleClickRemove = async () => {
		if (window.confirm('Удалить комментарий?')) {
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
			<div>
				<Link
					href={`/news/${post.id}`}
					className={styles.profile_comment_favorite__title}
				>
					<span className={styles.postTitle}>{post.title}</span>
				</Link>
			</div>
			<div className={styles.profile_comment_favorite__header}>
				<Link href={`/profile/${user.id}`}>
					{user.avatarUrl !== '' ? (
						<div
							className={styles.profile_comment_favorite__user__image}
							style={{
								backgroundImage: `url(${user.avatarUrl})`
							}}
						></div>
					) : (
						<Avatar
							className={styles.profile_comment_favorite__user__image}
							src={user.fullName[0]}
						/>
					)}
					<p className={styles.profile_comment_favorite__user__name}>
						{user.fullName}
					</p>
				</Link>
				<span className={styles.profile_comment_favorite__date}>
					{moment(createdAt).fromNow()}
				</span>
			</div>
			<Typography className={styles.text}>{text}</Typography>

			<span className={styles.replyBtn}>Ответить</span>
			{user.id === currentUserId && (
				<>
					<IconButton onClick={handleClick} className={styles.buttonSvg}>
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
