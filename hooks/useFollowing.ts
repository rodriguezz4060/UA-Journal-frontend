import { FollowItem } from '../utils/api/types'
import React from 'react'
import { Api } from '../utils/api'

type UseUserFollowingProps = {
	setUserFollowing: React.Dispatch<React.SetStateAction<FollowItem[]>>
	userFollowing: FollowItem[]
}

export const useUserFollowing = (userId?: number): UseUserFollowingProps => {
	const [userFollowing, setUserFollowing] = React.useState<FollowItem[]>([])

	React.useEffect(() => {
		const fetchFollowing = async () => {
			if (userId !== undefined) {
				// Проверяем, что userId определен
				try {
					const Following = await Api().follow.getUserFollowing(userId)
					setUserFollowing(Following)
				} catch (err) {
					console.warn('Fetch followers', err)
				}
			}
		}

		fetchFollowing()
	}, [userId, setUserFollowing])

	return { userFollowing, setUserFollowing }
}
