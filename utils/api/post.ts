import { AxiosInstance } from 'axios'
import { OutputData } from '@editorjs/editorjs'
import { PostItem } from './types'

type CreatePostDto = {
	title: string
	body: OutputData['blocks']
}

type SearchPostDto = {
	title?: string
	body?: string
	views?: 'DESC' | 'ASC'
	limit?: number
	take?: number
	tag?: string
}

type UpdateRatingDto = {
	rating: number
}

export const PostApi = (instance: AxiosInstance) => ({
	async getAll() {
		const { data } = await instance.get<PostItem[]>('/posts')
		return data
	},

	async search(query: SearchPostDto) {
		const { data } = await instance.get<{ items: PostItem[]; total: number }>(
			'/posts/search',
			{
				params: query
			}
		)
		return data
	},
	async getOne(id: number) {
		const { data } = await instance.get<PostItem>(`/posts/${id}`)
		return data
	},
	async create(dto: CreatePostDto) {
		const { data } = await instance.post<CreatePostDto, { data: PostItem }>(
			'/posts',
			dto
		)
		return data
	},
	async update(id: number, dto: CreatePostDto) {
		const { data } = await instance.patch<CreatePostDto, { data: PostItem }>(
			`/posts/${id}`,
			dto
		)
		return data
	},
	async updateRating(id: number, dto: UpdateRatingDto) {
		const { data } = await instance.patch<{ data: PostItem }>(
			`/posts/${id}/rating`,
			dto
		)
		return data
	},
	async remove(id: number) {
		const { data } = await instance.delete(`/posts/${id}`)
		return data
	}
})
