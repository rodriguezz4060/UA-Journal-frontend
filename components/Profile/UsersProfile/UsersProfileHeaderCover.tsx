import React, { useEffect, useState } from 'react'
import styles from '../Porfile.module.scss'
import { ResponseUser } from '../../../utils/api/types'

interface HeaderCoverProps {
	user: ResponseUser
}

const UsersProfileHeaderCover = ({ user }: HeaderCoverProps) => {
	const [style, setStyle] = useState({})

	useEffect(() => {
		if (user?.headerCoverUrl) {
			setStyle({
				backgroundImage: `url(${user?.headerCoverUrl})`,
				backgroundPosition: `${user?.headerCoverPosition}`
			})
		} else {
			setStyle({})
		}
	}, [user?.headerCoverUrl, user?.headerCoverPosition])

	return (
		<div>
			<div
				className={`${styles.headerCover} ${styles.header__cover} ${
					!user?.headerCoverUrl && styles.headerCoverNoImage
				}`}
				style={style}
			>
				<div className={`${styles.headerCoverManage}`}></div>
			</div>
		</div>
	)
}

export default UsersProfileHeaderCover
