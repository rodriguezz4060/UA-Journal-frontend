import { FollowItem } from '../utils/api/types'
import React from 'react'
import { Api } from '../utils/api'

type UseUserFollowersProps = {
	setUserFollowers: React.Dispatch<React.SetStateAction<FollowItem[]>>
	userFollowers: FollowItem[]
}

export const useUserFollowers = (userId: number): UseUserFollowersProps => {
	const [userFollowers, setUserFollowers] = React.useState<FollowItem[]>([])

	React.useEffect(() => {
		const fetchFollowers = async () => {
			try {
				const followers = await Api().follow.getUserFollowers(userId)
				setUserFollowers(followers)
			} catch (err) {
				console.warn('Fetch followers', err)
			}
		}

		fetchFollowers()
	}, [userId, setUserFollowers])

	return { userFollowers, setUserFollowers }
}
