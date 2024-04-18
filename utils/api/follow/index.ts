import { parseCookies } from 'nookies'

export const followUser = async (userId: number) => {
	try {
		const cookies = parseCookies()
		const token = cookies.rtoken
		const response = await fetch(
			`http://localhost:7777/users/${userId}/follow`,
			{
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`
				}
			}
		)

		if (response.ok) {
			return true
		} else {
			console.error('Ошибка при подписке:', response.statusText)
			return false
		}
	} catch (error) {
		console.error('Ошибка при подписке:', error)
		return false
	}
}

export const unfollowUser = async (userId: number) => {
	try {
		const cookies = parseCookies()
		const token = cookies.rtoken
		const response = await fetch(
			`http://localhost:7777/users/${userId}/unfollow`,
			{
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${token}`
				}
			}
		)

		if (response.ok) {
			return true
		} else {
			console.error('Ошибка при отписке:', response.statusText)
			return false
		}
	} catch (error) {
		console.error('Ошибка при отписке:', error)
		return false
	}
}
