import React from 'react'
import styles from './Porfile.module.scss'
import { useAppSelector } from '../../redux/hooks'
import { selectUserData } from '../../redux/slices/user'
import { Avatar, Link, Paper } from '@material-ui/core'
import ImageIcon from '@material-ui/icons/ImageOutlined'
import LinkIcon from '@material-ui/icons/Link'
import { useRouter } from 'next/router'

interface CreateNewPostProps {}

export const CreateNewPost: React.FC<CreateNewPostProps> = () => {
	const userData = useAppSelector(selectUserData)
	const [avatarUrl, setAvatarUrl] = React.useState(userData?.avatarUrl || '')

	const router = useRouter()

	const handleButtonClick = () => {
		router.push('/write')
	}

	return (
		<div>
			<Paper
				className=' pr-20  mb-30'
				elevation={0}
				style={{ borderRadius: 10 }}
			>
				<div
					className={`${styles.miniEditor} 
					${styles.miniEditor} ${styles.island} 
					${styles.islandBg} ${styles.islandRound}`}
					onClick={handleButtonClick}
				>
					{avatarUrl !== '' ? (
						<div
							className={styles.miniEditor__avatar}
							style={{ backgroundImage: `url(${userData?.avatarUrl})` }}
						></div>
					) : (
						<Avatar className={styles.miniEditor__avatar}>
							{userData?.fullName[0]}
						</Avatar>
					)}
					<div className={styles.miniEditor__placeholder}>Новая запись</div>

					<div className={styles.miniEditor__buttons}>
						<div className={styles.miniEditor__button}>
							<ImageIcon style={{ width: 20, height: 20 }} /> Фото и видео
						</div>

						<div className={styles.miniEditor__button}>
							<LinkIcon
								className={styles.rotareSvg}
								style={{ width: 20, height: 20 }}
							/>
							Ссылка
						</div>
					</div>
				</div>
			</Paper>
		</div>
	)
}
