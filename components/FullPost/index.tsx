import React, { useEffect, useRef, useState } from 'react'
import { PostActions } from '../PostActions'
import MessageIcon from '@material-ui/icons/TextsmsOutlined'
import QuoteIcon from '@material-ui/icons/FormatQuote'
import styles from './FullPost.module.scss'
import buttonStyles from '../Profile/Porfile.module.scss'
import { Avatar, Paper, Typography } from '@material-ui/core'
import FollowIcon from '@material-ui/icons/PersonAddOutlined'
import AddIcon from '@material-ui/icons/AddOutlined'
import CheckIcon from '@material-ui/icons/CheckOutlined'
import SimpleGallery from '../PhotoSwipe'
import { useAppSelector } from '../../redux/hooks'
import { selectUserData } from '../../redux/slices/user'
import { HeaderUser } from '../HeaderPostUserInfo'
import { useDispatch } from 'react-redux'
import { followUser, unfollowUser } from '../../utils/api/follow'
import { updateFollowers } from '../../redux/slices/usersFollowersSlice'
import Link from 'next/link'
import { FollowItem } from '../../utils/api/types'
import { NextPage } from 'next'
import { useUserFollowing } from '../../hooks/useFollowing'
import { FullPostProps } from './FullPostProps'

interface FullPost {
	followers: FollowItem[]
	onRemove: () => void
}

export const FullPost: NextPage<FullPostProps> = ({
	title,
	blocks,
	user,
	userId,
	id,
	rating,
	createdAt,
	onRemove,
	followers
}) => {
	const userData = useAppSelector(selectUserData)

	const { userFollowing } = useUserFollowing(userData?.id)

	const dispatch = useDispatch()

	const [buttonVisible, setButtonVisible] = React.useState(false)
	React.useEffect(() => {
		if (buttonVisible && userData) {
			setButtonVisible(false)
		}
	}, [buttonVisible, userData])

	const [isFollowing, setIsFollowing] = useState(
		userFollowing?.some(item => item.id === userId)
	)

	useEffect(() => {
		setIsFollowing(userFollowing?.some(item => item.id === userId))
	}, [userFollowing, userId])

	const handleFollowUnfollow = async () => {
		if (isFollowing) {
			// Выполнить отписку пользователя
			const success = await unfollowUser(userId)
			if (success) {
				const updatedFollowers = followers.filter(
					item => item.id !== userData?.id
				)
				dispatch(updateFollowers(updatedFollowers))
				setIsFollowing(false)
			}
		} else {
			// Выполнить подписку пользователя
			const isAlreadyFollowing = followers.some(
				item => item.id === userData?.id
			)
			if (!isAlreadyFollowing) {
				const success = await followUser(userId)
				if (success) {
					const updatedFollowers = [
						...followers,
						{ followUserId: userData?.id }
					]
					dispatch(updateFollowers(updatedFollowers))
					setIsFollowing(true)
				}
			}
		}
	}

	const ratingClassName =
		user?.rating > 0
			? styles.numberChange__positive
			: user?.rating < 0
			? styles.numberChange__negative
			: ''

	const [isHovered, setIsHovered] = useState(false)

	const handleMouseEnter = () => {
		setIsHovered(true)
	}

	const handleMouseLeave = () => {
		setIsHovered(false)
	}

	const handleRepost = () => {
		// Здесь должна быть логика для репоста поста
		// Например, отправка запроса на сервер
		console.log(`Репост поста с id ${id}`)
	}

	return (
		<div>
			<Paper
				elevation={0}
				className={styles.paper}
				style={{ borderRadius: 10 }}
			>
				<div className={styles.islandC}>
					<HeaderUser
						showTime={true}
						id={id}
						createdAt={createdAt}
						user={user}
						onRemove={onRemove}
					/>
				</div>
				<div className={styles.container}>
					<Typography className={styles.title}>{title}</Typography>
					<div>
						<div className={styles.text}>
							{blocks.map(obj => {
								if (obj.type === 'paragraph') {
									return (
										<div className={styles.figure}>
											<div className={styles.paragraph}>
												<Typography
													key={obj.id}
													dangerouslySetInnerHTML={{ __html: obj.data.text }}
												/>
											</div>
										</div>
									)
								}
								if (obj.type === 'quote') {
									return (
										<div className={styles.figure}>
											<blockquote className={styles.block_quote}>
												<div className={styles.quote__content}>
													<QuoteIcon />
													<Typography
														key={obj.id}
														className={styles.quote_text}
														dangerouslySetInnerHTML={{ __html: obj.data.text }}
													/>
													<div
														className={styles.quote_author}
														dangerouslySetInnerHTML={{
															__html: obj.data.caption
														}}
													/>
												</div>
											</blockquote>
										</div>
									)
								}
								if (obj.type === 'list') {
									return (
										<div className={styles.figure}>
											<div className={styles.list}>
												<ul>
													{obj.data.items.map((item: any, index: number) => (
														<li key={index}>{item}</li>
													))}
												</ul>
											</div>
										</div>
									)
								}
								if (obj.type === 'incut') {
									return (
										<div className={styles.figure}>
											<div className={styles.block_incut}>
												<div className={styles.content_incut}>
													<Typography
														key={obj.id}
														className={styles.quote_text}
														dangerouslySetInnerHTML={{ __html: obj.data.text }}
													/>
												</div>
											</div>
										</div>
									)
								}
								if (obj.type === 'code') {
									return (
										<div className={styles.figure}>
											<div className={styles.block_code}>{obj.data.code}</div>
										</div>
									)
								}
								if (obj.type === 'image') {
									const imageStyle =
										obj.data.file.width > obj.data.file.height + 100
											? styles.islandA
											: styles.islandB
									return (
										<div className={styles.figure}>
											<div className={imageStyle}>
												<div className={styles.images}>
													<SimpleGallery
														galleryID='postsGallery'
														images={[
															{
																largeURL: obj.data.file.url,
																width: obj.data.file.width,
																height: obj.data.file.height,
																thumbnailURL: obj.data.file.url
															}
														]}
													/>
													<div className={styles.image_caption}>
														{obj.data.caption}
													</div>
												</div>
											</div>
										</div>
									)
								}
								if (obj.type === 'video') {
									const videoClass =
										obj.data.file.width < 640
											? styles.small_image
											: obj.data.file.width < 950
											? styles.image
											: styles.stretched_image
									return (
										<div className={styles.figure}>
											<div className={videoClass}>
												<video controls>
													<source src={obj.data.file.url} type='video/mp4' />
												</video>
												<div className={styles.video_caption}>
													{obj.data.caption}
												</div>
											</div>
										</div>
									)
								}
								return null
							})}
						</div>
						<div className={styles.PostActions}>
							<PostActions id={id} rating={rating} onRepost={handleRepost} />
						</div>
						<div className={styles.subsiteCardEntry}>
							<div className={styles.islandB}>
								<div className={styles.subsiteard}>
									<div className={styles.subsiteCard__main}>
										<Link href={`/profile/${user.id}`}>
											{user.avatarUrl !== '' ? (
												<div
													className={styles.subsiteCard__avatar}
													style={{
														backgroundImage: `url(${user.avatarUrl})`
													}}
												></div>
											) : (
												<Avatar
													className={styles.userAvatar}
													src={user.fullName[0]}
												/>
											)}
										</Link>
										<div className={styles.subsiteCard__authorInfo}>
											<div className={styles.subsiteCardTitle}>
												<Link
													href={`/profile/${user.id}`}
													className={`${styles.subsiteCardTitle__item__name} ${styles.subsiteCardTitle__item}`}
												>
													{user.fullName}
												</Link>
												<div
													className={`${styles.subsiteCardTitle__item__karma} 
													${styles.subsiteCardTitle__item} ${ratingClassName}`}
												>
													{user?.rating > 0
														? `+${user?.rating}`
														: user?.rating < 0
														? `-${Math.abs(user?.rating)}`
														: user?.rating}
												</div>
											</div>

											{user?.description && (
												<div
													className={styles.subsiteCard__description}
													dangerouslySetInnerHTML={{
														__html: user.description
															.replace(
																/(https?:\/\/[^\s]+)/g,
																(match: any, url: any) =>
																	`<a href="${url}" target="_blank">${url}</a>`
															)
															.replace(
																/(^|\s)([a-zA-Z0-9]+\.([a-zA-Z]{2,}\/[^\s]+))/g,
																(match: any, space: any, url: any) =>
																	`${space}<a href="https://${url}" target="_blank">${url}</a>`
															)
													}}
												/>
											)}
										</div>
									</div>
									{userData && user.id === userData.id ? null : (
										<div className={styles.subsiteCard__actions}>
											<button
												className={`${styles.subsiteCard__messenger} ${buttonStyles.button} ${buttonStyles.buttonDefault} ${buttonStyles.buttonSize_default}`}
											>
												<div className={buttonStyles.button__icon}>
													<MessageIcon />
												</div>
											</button>

											{isFollowing ? (
												<button
													onClick={handleFollowUnfollow}
													onMouseEnter={handleMouseEnter}
													onMouseLeave={handleMouseLeave}
													className={`${buttonStyles.button} ${buttonStyles.buttonDefault} ${buttonStyles.button__subscribed}`}
												>
													<div className={buttonStyles.button__icon}>
														{isHovered ? (
															<AddIcon className={buttonStyles.svgUnfollow} />
														) : (
															<CheckIcon
																className={buttonStyles.svgsubscribed}
															/>
														)}
													</div>
												</button>
											) : (
												<button
													onClick={handleFollowUnfollow}
													className={`${buttonStyles.button} ${buttonStyles.buttonDefault} ${buttonStyles.buttonSize_default}`}
												>
													<div className={buttonStyles.button__icon}>
														<FollowIcon className={buttonStyles.svgMessage} />
													</div>
													<span className={buttonStyles.button__lable}>
														Подписаться
													</span>
												</button>
											)}
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</Paper>
		</div>
	)
}
