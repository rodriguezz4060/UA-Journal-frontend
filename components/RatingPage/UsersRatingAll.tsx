import { Paper, makeStyles } from '@material-ui/core'
import { NextPage } from 'next'
import { FollowItem, ResponseUser } from '../../utils/api/types'
import styles from './RatingPage.module.scss'
import { useState } from 'react'
import React from 'react'
import UsersRatingTableAll from './UsersRatingTableAll'

interface UsersRatingAllPageProps {
	users: ResponseUser[]
	followers: FollowItem[]
}

const useStyles = makeStyles({
	paper: {
		borderRadius: 0
	}
})

const UsersRatingAll: NextPage<UsersRatingAllPageProps> = ({
	users,
	followers
}) => {
	const classes = useStyles()

	const [usertList, setUserList] = useState(users)
	usertList.sort((a, b) => b.rating - a.rating)

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
			{usertList.map((obj, index) => (
				<UsersRatingTableAll
					key={obj.id}
					index={index}
					userId={obj.id}
					fullName={obj.fullName}
					avatarUrl={obj.avatarUrl}
					rating={obj.rating}
					followers={followers}
				/>
			))}
		</Paper>
	)
}

export default UsersRatingAll
