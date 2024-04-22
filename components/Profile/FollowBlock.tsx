import React from 'react'
import { Avatar } from '@material-ui/core'
import { FollowItem, ResponseUser } from '../../utils/api/types'
import styles from './Porfile.module.scss'
import Link from 'next/link'

interface FollowInfoProps {
	following: FollowItem[]
	followers: FollowItem[]
	userId: number
	user: ResponseUser
}

export const FollowInfo: React.FC<FollowInfoProps> = ({
	following,
	followers,
	userId,
	user
}) => {
	return (
		<>
			<div
				className={`${styles.islandBg} ${styles.islandRound} ${styles.island} `}
			>
				<div className={styles.follow__header}>
					<span className={styles.follow_title}>Подписчики</span>
					<span className={styles.follow_counter}>{followers.length}</span>
				</div>
				<div className={`${styles.list} ${styles.list__images}`}>
					<div className={styles.list__content}>
						{followers.slice(-12).map(item => (
							<Link href={`/profile/${item.id}`} className={styles.list__item}>
								<div key={item.id}>
									{item.avatarUrl !== '' ? (
										<Avatar
											src={item.avatarUrl}
											className={styles.list__image}
										/>
									) : (
										<Avatar className={styles.list__image}>
											{item.fullName[0]}
										</Avatar>
									)}
								</div>
							</Link>
						))}
					</div>
					<Link
						href={`http://localhost:3000/profile/1`}
						className={styles.list_more}
					>
						Показать всех
					</Link>
				</div>
			</div>

			<div
				className={`${styles.islandBg} ${styles.islandRound} ${styles.island} `}
			>
				<div className={styles.follow__header}>
					<span className={styles.follow_title}>Подписки</span>
					<span className={styles.follow_counter}>{following.length}</span>
				</div>
				<div className={`${styles.list} ${styles.list__default}`}>
					<div className={styles.list__content}>
						{following.slice(-5).map(item => (
							<div key={item.id}>
								<Link
									href={`/profile/${item.id}`}
									className={styles.list__item}
								>
									{item.avatarUrl !== '' ? (
										<Avatar
											src={item.avatarUrl}
											className={styles.list__image}
										/>
									) : (
										<Avatar className={styles.list__image}>
											{item.fullName[0]}
										</Avatar>
									)}
									<div className={styles.followLable}>{item.fullName}</div>
								</Link>
							</div>
						))}
					</div>
					<Link
						href={`http://localhost:3000/profile/1`}
						className={styles.list_more}
					>
						Показать все
					</Link>
				</div>
			</div>
		</>
	)
}
