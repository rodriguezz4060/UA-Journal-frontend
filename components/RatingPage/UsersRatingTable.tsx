import { Avatar, Link, Paper, makeStyles } from '@material-ui/core'
import { NextPage } from 'next'
import { FollowItem } from '../../utils/api/types'
import styles from './RatingPage.module.scss'
import buttonStyles from '../Profile/Porfile.module.scss'
import FollowIcon from '@material-ui/icons/PersonAddOutlined'
import AddIcon from '@material-ui/icons/AddOutlined'
import CheckIcon from '@material-ui/icons/CheckOutlined'
import { selectUserData } from '../../redux/slices/user'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import {
	selectFollowers,
	updateFollowers
} from '../../redux/slices/usersFollowersSlice'
import { followUser, unfollowUser } from '../../utils/api/follow'
import React from 'react'
import { useUserFollowing } from '../../hooks/useFollowing'

interface UsersRatingTablePageProps {
	userId: number
	fullName: string
	avatarUrl?: string
	followers: FollowItem[]
	index: number
	monthlyRating: number
}

const UsersRatingTable: NextPage<UsersRatingTablePageProps> = ({
	userId,
	fullName,
	avatarUrl,
	followers,
	index,
	monthlyRating
}) => {
	const userData = useSelector(selectUserData)

	const { userFollowing } = useUserFollowing(userData?.id)

	const dispatch = useDispatch()

	const [totalRating, setTotalRating] = useState(0)

	// useEffect(() => {
	// 	const fetchRating = async () => {
	// 		const response = await fetch(
	// 			`http://localhost:7777/posts/${userId}/ratings/${
	// 				new Date().getMonth() + 1
	// 			}/${new Date().getFullYear()}`
	// 		)
	// 		const data = await response.json()
	// 		setTotalRating(data)
	// 	}

	// 	fetchRating()
	// }, [userId])

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
					const updatedFollowers = { ...followers, followUserId: userData?.id }
					dispatch(updateFollowers(updatedFollowers))
					setIsFollowing(true)
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

	return (
		<div className={styles.table__content}>
			<div className={`${styles.table__row} ${styles.islandA}`}>
				<div className={styles.table__cell}>
					<Link href={`/profile/${userId}`} className={styles.subsite}>
						<span className={styles.subsite__rank}>
							<small>{index + 1}</small>
						</span>
						<Avatar className={styles.subsite__avatar} src={avatarUrl} />
						<div className={styles.subsite__name}>
							<strong>{fullName}</strong>
						</div>
					</Link>
				</div>
				<div className={styles.table__cell}>
					<small>
						<span>{monthlyRating}</span>
					</small>
				</div>
				<div className={styles.table__cell}>
					{isFollowing ? (
						<button
							onClick={handleFollowUnfollow}
							onMouseEnter={handleMouseEnter}
							onMouseLeave={handleMouseLeave}
							className={`${buttonStyles.button} ${buttonStyles.buttonDefault} `}
						>
							<div className={buttonStyles.button__icon}>
								{isHovered ? (
									<AddIcon className={buttonStyles.svgUnfollow} />
								) : (
									<CheckIcon className={buttonStyles.svgsubscribed} />
								)}
							</div>
						</button>
					) : (
						<button
							onClick={handleFollowUnfollow}
							className={`${buttonStyles.button} ${buttonStyles.buttonDefault} ${buttonStyles.buttonSize_default}`}
						>
							<div className={buttonStyles.button__icon}>
								<FollowIcon className={styles.FollowIcon} />
							</div>
						</button>
					)}
				</div>
			</div>
		</div>
	)
}

export default UsersRatingTable
