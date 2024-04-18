import React, { useEffect, useState } from 'react'
import styles from '../Porfile.module.scss'

import { ResponseUser } from '../../../utils/api/types'

interface HeaderCoverProps {
	user: ResponseUser
}

const UsersProfileHeaderCover = ({ user }: HeaderCoverProps) => {
	return (
		<div>
			<div
				className={`${styles.headerCover} ${styles.header__cover} ${
					!user?.headerCoverUrl && styles.headerCoverNoImage
				}`}
				style={{
					backgroundImage: `url(${user?.headerCoverUrl})`,
					backgroundPosition: `${user?.headerCoverPosition}`
				}}
			>
				<div className={`${styles.headerCoverManage}`}></div>
			</div>
		</div>
	)
}

export default UsersProfileHeaderCover
