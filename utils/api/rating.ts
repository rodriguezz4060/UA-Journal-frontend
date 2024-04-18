import { AxiosInstance } from 'axios'
import { RatingItem } from './types'

export const RatingApi = (instance: AxiosInstance) => ({
	async getAlls() {
		const { data } = await instance.get<RatingItem[]>('/rating')
		return data
	},

	async getAll(postId: number) {
		const { data } = await instance.get<RatingItem[]>('/rating', {
			params: { postId }
		})
		return data
	},

	async getPostRatingByPostId(postId: number) {
		const { data } = await instance.get<RatingItem[]>('/rating', {
			params: { postId }
		})
		return data
	},

	async getPostRatingByUserId(userId: number) {
		const { data } = await instance.get<RatingItem[]>('/rating', {
			params: { userId }
		})
		return data
	},

	async getOne(id: number) {
		const { data } = await instance.get<RatingItem>(`/rating/${id}`)
		return data
	}
})
