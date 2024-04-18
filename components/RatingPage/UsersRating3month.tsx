import { Paper, makeStyles } from '@material-ui/core'
import { NextPage } from 'next'
import { FollowItem, ResponseUser } from '../../utils/api/types'
import styles from './RatingPage.module.scss'
import { useEffect, useState } from 'react'
import React from 'react'
import UsersRatingTable3month from './UsersRatingTable3month'

interface UsersRatingPageProps {
	users: ResponseUser[]
	followers: FollowItem[]
}

const useStyles = makeStyles({
	paper: {
		borderRadius: 0
	}
})

const UsersRating3month: NextPage<UsersRatingPageProps> = ({
	users,
	followers
}) => {
	const classes = useStyles()

	const [filteredUserList, setFilteredUserList] = useState(users)

	useEffect(() => {
		const fetchRating = async () => {
			const updatedUserList = await Promise.all(
				filteredUserList.map(async user => {
					let totalRating = 0
					const currentMonth = new Date().getMonth() + 1
					const currentYear = new Date().getFullYear()

					// Получение рейтинга за последние 3 месяца
					for (let i = 0; i < 3; i++) {
						const month = currentMonth - i
						const year = month > 0 ? currentYear : currentYear - 1
						const response = await fetch(
							`http://localhost:7777/posts/${user.id}/ratings/${month}/${year}`
						)
						const data = await response.json()
						totalRating += data
					}

					return {
						...user,
						monthlyRating: totalRating
					}
				})
			)
			// Сортировка списка пользователей по рейтингу от наибольшего к наименьшему
			updatedUserList.sort((a, b) => b.monthlyRating - a.monthlyRating)
			setFilteredUserList(updatedUserList)
		}

		fetchRating()
	}, [filteredUserList])

	return (
		<Paper className={`${classes.paper} ${styles.table}`} elevation={0}>
			<div
				className={`${styles.table__row} ${styles.table__row__header} ${styles.islandA}`}
			>
				<div className={styles.table__cell}>
					<strong>Пользователи</strong>
				</div>
				<div className={styles.table__cell}>
					<small>Рейтинг</small>
				</div>
				<div className={styles.table__cell}></div>
			</div>
			{filteredUserList.map((obj, index) => (
				<UsersRatingTable3month
					key={obj.id}
					index={index}
					userId={obj.id}
					fullName={obj.fullName}
					avatarUrl={obj.avatarUrl}
					monthlyRating={obj.monthlyRating}
					followers={followers}
				/>
			))}
		</Paper>
	)
}

export default UsersRating3month
