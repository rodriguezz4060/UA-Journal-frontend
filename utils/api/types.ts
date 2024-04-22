import { OutputData } from '@editorjs/editorjs'

export type LoginDto = {
	email: string
	password: string
}

export type CreateUserDto = {
	fullName: string
} & LoginDto

export type ResponseUser = {
	id: number
	avatarUrl: undefined | string
	headerCoverUrl: null | string
	headerCoverPosition: null | string
	description: null | string
	email: string
	fullName: string
	commentsCount?: number
	rating: number
	follow: FollowItem[]
	token: string
	createdAt: string
	updatedAt: string
	monthlyRating: number
}

export type PostItem = {
	title: string
	body: OutputData['blocks']
	description: string
	tags: null | string
	id: number
	views: number
	tunes: string[]
	items: string
	incut: string[]
	quote: string[]
	caption: string
	code: string
	images?: string[]
	user: ResponseUser
	postRating: RatingItem
	rating: number
	createdAt: string
	updatedAt: string
}

export type UpdateRatingDto = {
	rating: number
}
export type CommentItem = {
	id: number
	text: string
	post: PostItem
	user: ResponseUser
	createdAt: string
	updatedAt: string
}

export type RatingItem = {
	id: number
	post: PostItem
	user: ResponseUser
	increment: number
	date: string
}

export type FollowItem = {
	fullName: string
	followUserId: number
	avatarUrl: string | undefined
	id: number
	user: ResponseUser
	following: number[]
	followers: number[]
}
