import { RatingItem } from '../utils/api/types'
import React from 'react'
import { Api } from '../utils/api'

type UsePostRatingProps = {
	setPostsRating: React.Dispatch<React.SetStateAction<RatingItem[]>>
	postsRating: RatingItem[]
}

export const usePostRating = (postId?: number): UsePostRatingProps => {
	const [postsRating, setPostsRating] = React.useState<RatingItem[]>([])

	React.useEffect(() => {
		const fetchComments = async () => {
			try {
				const arr = await Api().postRating.getAll(postId)
				setPostsRating(arr)
			} catch (err) {
				console.warn('Fetch comments', err)
			}
		}

		fetchComments()
	}, [postId])

	return { postsRating, setPostsRating }
}
