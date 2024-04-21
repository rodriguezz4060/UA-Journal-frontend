import React from 'react'
import {
	IconButton,
	Menu,
	MenuItem,
	Paper,
	Typography
} from '@material-ui/core'
import MoreVertIcon from '@material-ui/icons/MoreVert'

import styles from './CommentPost.module.scss'
import Link from 'next/link'

interface CommentPostProps {
	user: {
		fullname: string
	}
	text: string
	post: {
		title: string
	}
}

export const CommentPost: React.FC<CommentPostProps> = ({
	user,
	post,
	text
}) => {
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget)
	}

	const handleClose = () => {
		setAnchorEl(null)
	}

	return (
		<Paper elevation={0} className={styles.paper}>
			<Typography variant='h6' className={styles.title}>
				<Link href='#'>{post.title}</Link>
				<IconButton onClick={handleClick}>
					<MoreVertIcon />
				</IconButton>
			</Typography>
			<Typography className={styles.text}>{text}</Typography>

			<Menu
				id='simple-menu'
				anchorEl={anchorEl}
				elevation={3}
				open={Boolean(anchorEl)}
				onClose={handleClose}
			>
				<MenuItem onClick={handleClose}>Удалить</MenuItem>
				<MenuItem onClick={handleClose}>Редактировать</MenuItem>
			</Menu>
		</Paper>
	)
}
