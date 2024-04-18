import { Paper, makeStyles } from '@material-ui/core'
import { NextPage } from 'next'
import { FollowItem, ResponseUser } from '../../utils/api/types'
import styles from './RatingPage.module.scss'
import { useEffect, useState } from 'react'
import React from 'react'
import UsersRatingTable from './UsersRatingTable'

interface UsersRatingPageProps {
	users: ResponseUser[]
	followers: FollowItem[]
}

const useStyles = makeStyles({
	paper: {
		borderRadius: 0
	}
})

const UsersRating: NextPage<UsersRatingPageProps> = ({ users, followers }) => {
	const classes = useStyles()

	const [filteredUserList, setFilteredUserList] = useState(users)

	useEffect(() => {
		const fetchRating = async () => {
			const updatedUserList = await Promise.all(
				filteredUserList.map(async user => {
					const response = await fetch(
						`http://localhost:7777/posts/${user.id}/ratings/${
							new Date().getMonth() + 1
						}/${new Date().getFullYear()}`
					)
					const data = await response.json()
					return {
						...user,
						monthlyRating: data
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
				<UsersRatingTable
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

export default UsersRating
