import { CommentItem } from '../utils/api/types'
import React from 'react'
import { Api } from '../utils/api'

type UseUserCommentsProps = {
	setUserComments: React.Dispatch<React.SetStateAction<CommentItem[]>>
	userComments: CommentItem[]
}

export const useUserComments = (userId?: number): UseUserCommentsProps => {
	const [userComments, setUserComments] = React.useState<CommentItem[]>([])

	React.useEffect(() => {
		const fetchUserComments = async () => {
			try {
				const comments = await Api().comment.getCommentsByUserId(userId)
				setUserComments(comments)
			} catch (err) {
				console.warn('Ошибка при получении комментариев пользователя', err)
			}
		}

		fetchUserComments()
	}, [userId])

	return { userComments, setUserComments }
}
