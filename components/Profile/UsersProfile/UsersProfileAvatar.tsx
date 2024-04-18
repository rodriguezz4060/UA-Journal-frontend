import React, { useState } from 'react'
import { Avatar } from '@material-ui/core'
import styles from '../Porfile.module.scss'
import UsersProfileHeaderCover from './UsersProfileHeaderCover'
import { ResponseUser } from '../../../utils/api/types'

interface AvatarUploaderProps {
	user: ResponseUser
}

const UsersProfileAvatar = ({ user }: AvatarUploaderProps) => {
	return (
		<div className={styles.pageWrapper}>
			<style>
				{`
          :root {
            --wrapper-padding-top: 40px;
            --max-width-container: 900px
          }
        `}
			</style>
			<UsersProfileHeaderCover user={user} />
			<div>
				<div className={styles.header__avatar}>
					<div className={styles.headerAvatar}>
						<div className={styles.headerAvatar__media}>
							{user.avatarUrl !== '' ? (
								<Avatar
									className={styles.headerAvatar__media}
									src={user.avatarUrl}
								/>
							) : (
								<Avatar className={styles.headerAvatar__media}>
									{user.fullName[0]}
								</Avatar>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default UsersProfileAvatar
