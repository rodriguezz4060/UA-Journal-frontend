import React, { CSSProperties, useEffect, useState } from 'react'
import { IconButton } from '@material-ui/core'
import CommentsIcon from '@material-ui/icons/ModeCommentOutlined'
import RepostIcon from '@material-ui/icons/RepeatOutlined'
import FavoriteIcon from '@material-ui/icons/BookmarkBorderOutlined'
import styles from './PostActions.module.scss'
import ArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import ArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import ShareIcon from '@material-ui/icons/Share'
import { NextPage } from 'next'
import axios from 'axios'
import { parseCookies } from 'nookies'
import { usePostRating } from '../../hooks/usePostRating'
import { useAppSelector } from '../../redux/hooks'
import { selectUserData } from '../../redux/slices/user'
import { useComments } from '../../hooks/useComments'
import Link from 'next/link'

interface PostActionsProps {
	rating: number
	id: number
	onRepost: () => void
}

export const PostActions: NextPage<PostActionsProps> = ({
	rating,
	id,
	onRepost
}) => {
	const [currentRating, setCurrentRating] = useState(rating)
	const [userRatedUp, setUserRatedUp] = useState(false)
	const [userRatedDown, setUserRatedDown] = useState(false)

	const userData = useAppSelector(selectUserData)
	const { postsRating, setPostsRating } = usePostRating(id)
	const { comments, setComments } = useComments(id)

	const handleRatingChange = async (increment: number) => {
		try {
			const cookies = parseCookies()
			const token = cookies.rtoken

			const response = await axios.patch(
				`http://localhost:7777/posts/${id}/rating`,
				{
					increment: increment
				},
				{
					headers: {
						Authorization: `Bearer ${token}`
					}
				}
			)
			const updatedRating = response.data.rating
			setCurrentRating(updatedRating)
			console.log('Updated rating:', updatedRating)

			// Установить состояние для изменения стилей
			if (increment === 1) {
				setUserRatedUp(true)
				setUserRatedDown(false)
			} else if (increment === -1) {
				setUserRatedUp(false)
				setUserRatedDown(true)
			}
		} catch (error) {
			console.error(error)
		}
	}

	const userHasRated = postsRating.some(item => item.user.id === userData?.id)
	const userIncrement = postsRating.find(
		item => item.user.id === userData?.id
	)?.increment

	useEffect(() => {
		// Обновить состояние стилей при изменении рейтинга
		if (userHasRated && userIncrement === 1) {
			setUserRatedUp(true)
			setUserRatedDown(false)
		} else if (userHasRated && userIncrement === -1) {
			setUserRatedUp(false)
			setUserRatedDown(true)
		} else {
			setUserRatedUp(false)
			setUserRatedDown(false)
		}
	}, [userHasRated, userIncrement])

	const handleShare = () => {
		// Получаем текущий URL страницы
		const currentUrl = window.location.href

		// Добавляем 'news/postid' к текущему URL
		const postUrl = `${currentUrl}news/${id}`

		if (navigator.share) {
			navigator
				.share({
					title: 'Поделиться постом',
					url: postUrl // Используем полный URL поста
				})
				.then(() => console.log('Успешно поделились'))
				.catch(error => console.error('Ошибка при поделии:', error))
		} else {
			// Если браузер не поддерживает Web Share API, можно использовать другие стратегии, например, копирование URL в буфер обмена
			navigator.clipboard
				.writeText(postUrl)
				.then(() => alert('Ссылка скопирована в буфер обмена'))
				.catch(error => console.error('Ошибка при копировании:', error))
		}
	}

	return (
		<div
			className={`${styles.contentFooter} ${styles.contentFooter__short} ${styles.islandA}`}
		>
			<div className={styles.contentFooter__item}>
				<div
					className={`${styles.comments_counter} 
					${styles.comments_counter__num} 
					${styles.comments_counter__nonzero}`}
				>
					<Link
						className={`${styles.comments_counter__count}`}
						href={`/news/${id}#comments`}
					>
						<IconButton className={`${styles.buttonSvg}`}>
							<CommentsIcon style={{ width: 20, height: 20 }} />
						</IconButton>
						{comments.length === 0 ? (
							<span className={styles.comments_counter__count__value}>
								Обсудить
							</span>
						) : (
							<span className={styles.comments_counter__count__value}>
								{comments.length}
							</span>
						)}
					</Link>
				</div>
			</div>
			<div className={styles.contentFooter__item}>
				<div
					className={`${styles.comments_counter} 
					${styles.comments_counter__num} 
					${styles.comments_counter__nonzero}`}
				>
					<IconButton
						onClick={onRepost}
						className={`${styles.buttonSvg} ${styles.comments_counter}`}
					>
						<RepostIcon style={{ width: 20, height: 20 }} />
					</IconButton>
				</div>
			</div>

			<div className={styles.contentFooter__item}>
				<div
					className={`${styles.comments_counter} 
					${styles.comments_counter__num} 
					${styles.comments_counter__nonzero}`}
				>
					<IconButton
						className={`${styles.buttonSvg} ${styles.comments_counter}`}
					>
						<FavoriteIcon style={{ width: 20, height: 20 }} />
					</IconButton>
				</div>
			</div>
			<div className={styles.contentFooter__item}>
				<div
					className={`${styles.comments_counter} 
					${styles.comments_counter__num} 
					${styles.comments_counter__nonzero}`}
				>
					<IconButton
						className={`${styles.buttonSvg} ${styles.comments_counter}`}
						onClick={handleShare}
					>
						<ShareIcon style={{ width: 20, height: 20 }} />
					</IconButton>
				</div>
			</div>
			<div
				className={`${styles.contentFooter__item} ${styles.contentFooter__item__right}`}
			>
				<IconButton
					className={`${styles.ratingUp} ${styles.ratingUp_counter} 
					${userRatedUp ? styles.userRatedUp : ''}`}
					onClick={() => handleRatingChange(1)}
				>
					<ArrowUpIcon style={{ width: 25, height: 25 }} />
				</IconButton>
				<span
					className={`${styles.comments_counter__count__value} ${styles.likeButton}`}
				>
					{currentRating}
				</span>

				<IconButton
					className={`${styles.ratingDown} ${styles.ratingDown_counter}
					${userRatedDown ? styles.userRatedDown : ''}`}
					onClick={() => handleRatingChange(-1)}
				>
					<ArrowDownIcon style={{ width: 25, height: 25 }} />
				</IconButton>
			</div>
		</div>
	)
}
