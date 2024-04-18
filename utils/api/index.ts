import Cookies, { parseCookies } from 'nookies'
import axios from 'axios'
import { GetServerSidePropsContext, NextPageContext } from 'next'
import { UserApi } from './user'
import { PostApi } from './post'
import { CommentApi } from './comment'
import { RatingApi } from './rating'
import { FollowApi } from './follows'

export type ApiReturnType = {
	user: ReturnType<typeof UserApi>
	post: ReturnType<typeof PostApi>
	comment: ReturnType<typeof CommentApi>
	postRating: ReturnType<typeof RatingApi>
	follow: ReturnType<typeof FollowApi>
}

export const Api = (
	ctx?: NextPageContext | GetServerSidePropsContext
): ApiReturnType => {
	const cookies = ctx ? Cookies.get(ctx) : parseCookies()
	const token = cookies.rtoken

	const instance = axios.create({
		baseURL: 'http://localhost:7777',
		headers: {
			Authorization: 'Bearer ' + token
		}
	})

	const apis = {
		user: UserApi,
		post: PostApi,
		comment: CommentApi,
		postRating: RatingApi,
		follow: FollowApi
	}

	const result = Object.entries(apis).reduce((prev, [key, f]) => {
		return {
			...prev,
			[key]: f(instance)
		}
	}, {} as ApiReturnType)

	return result
}
