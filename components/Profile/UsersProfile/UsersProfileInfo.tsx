import React, { useState } from 'react'
import Link from 'next/link'
import {
	SettingsOutlined as SettingsIcon,
	TextsmsOutlined as MessageIcon
} from '@material-ui/icons'
import styles from '../Porfile.module.scss'
import { FollowItem, ResponseUser } from '../../../utils/api/types'
import FollowIcon from '@material-ui/icons/PersonAddOutlined'
import AddIcon from '@material-ui/icons/AddOutlined'
import CheckIcon from '@material-ui/icons/CheckOutlined'

import moment from 'moment'
import 'moment/locale/ru'
import { followUser, unfollowUser } from '../../../utils/api/follow'
import { useDispatch, useSelector } from 'react-redux'
import { selectUserData } from '../../../redux/slices/user'
import { updateFollowers } from '../../../redux/slices/usersFollowersSlice'

moment.locale('ru')

interface UsersProfileInfoProps {
	user: ResponseUser
	followers: FollowItem[]
}

export const UsersProfileInfo: React.FC<UsersProfileInfoProps> = ({
	user,
	followers
}) => {
	const userData = useSelector(selectUserData)
	const followersCount = followers.length

	const [isFollowing, setIsFollowing] = useState(
		followers.some(item => item.id === userData?.id)
	)

	const dispatch = useDispatch()

	const handleFollowUnfollow = async () => {
		if (isFollowing) {
			// Выполнить отписку пользователя
			const success = await unfollowUser(user.id)
			if (success) {
				setIsFollowing(false)
				const updatedFollowers = followers.filter(
					item => item.id !== userData?.id
				)
				dispatch(updateFollowers(updatedFollowers))
			}
		} else {
			// Выполнить подписку пользователя
			const isAlreadyFollowing = followers.some(
				item => item.id === userData?.id
			)
			if (!isAlreadyFollowing) {
				const success = await followUser(user.id)
				if (success) {
					setIsFollowing(true)
					const updatedFollowers = [
						...followers,
						{ followUserId: userData?.id }
					]
					dispatch(updateFollowers(updatedFollowers))
				}
			}
		}
	}

	const [isHovered, setIsHovered] = useState(false)

	const handleMouseEnter = () => {
		setIsHovered(true)
	}

	const handleMouseLeave = () => {
		setIsHovered(false)
	}

	let followersText = ''

	if (followersCount === 0) {
		followersText = '0 подписчиков'
	} else if (followersCount === 1) {
		followersText = '1 подписчик'
	} else if (followersCount >= 2 && followersCount <= 4) {
		followersText = `${followersCount} подписчика`
	} else {
		followersText = `${followersCount} подписчиков`
	}

	return (
		<div className={styles.headerWithActions}>
			<div className={styles.header__title}>
				<div className={styles.headerTitle}>
					<div className={styles.headerTitle_main}>{user?.fullName}</div>
				</div>
			</div>
			<div className={styles.header__description}>
				<div className={styles.headerDescription}>
					{user?.description && (
						<div
							dangerouslySetInnerHTML={{
								__html: user.description
									.replace(
										/(https?:\/\/[^\s]+)/g,
										(match, url) =>
											`<a href='${url}' target='_blank'>${url}</a>`
									)
									.replace(
										/(^|\s)([a-zA-Z0-9]+\.([a-zA-Z]{2,}\/[^\s]+))/g,
										(match, space, url) =>
											`${space}<a href='https://${url}' target='_blank'>${url}</a>`
									)
							}}
						/>
					)}
				</div>
			</div>

			<div className={`${styles.header__actions} ${styles.headerActions}`}>
				<button
					className={`${styles.button} ${styles.buttonDefault} ${styles.buttonSize_default}`}
				>
					<div className={styles.button__icon}>
						<MessageIcon className={styles.svgMessage} />
					</div>
					<span className={styles.button__lable}>Написать</span>
				</button>

				{isFollowing ? (
					<button
						onClick={handleFollowUnfollow}
						onMouseEnter={handleMouseEnter}
						onMouseLeave={handleMouseLeave}
						className={`${styles.button} ${styles.buttonDefault} ${styles.button__subscribed}`}
					>
						<div className={styles.button__icon}>
							{isHovered ? (
								<AddIcon className={styles.svgUnfollow} />
							) : (
								<CheckIcon className={styles.svgsubscribed} />
							)}
						</div>
					</button>
				) : (
					<button
						onClick={handleFollowUnfollow}
						className={`${styles.button} ${styles.buttonBlue} ${styles.buttonSize_default}`}
					>
						<div className={styles.button__icon}>
							<FollowIcon className={styles.svgMessage} />
						</div>
						<span className={styles.button__lable}>Подписаться</span>
					</button>
				)}
			</div>
			<div className={styles.header__stats}>
				<div className={styles.header__stat}>
					<div className={styles.headerStat}>
						<div
							className={`${styles.numberChange} ${styles.numberChange__positive}`}
						>
							{user?.rating}
						</div>
					</div>
					<Link href='/profile/#' className={styles.headerStat}>
						{followersText}
					</Link>
				</div>
				<div className={styles.header__stat}>
					На проекте с {moment(user.createdAt).format('D MMM YYYY')}
				</div>
			</div>
		</div>
	)
}
