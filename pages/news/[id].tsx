import { MainLayout } from '../../layouts/MainLayout'
import { FullPost } from '../../components/FullPost/'
import React, { useState } from 'react'
import { PostComments } from '../../components/PostComments'
import { GetServerSideProps, NextPage } from 'next'
import { Api } from '../../utils/api'
import { FollowItem, PostItem, ResponseUser } from '../../utils/api/types'
import { useRouter } from 'next/router'

interface FullPostPageProps {
	users: ResponseUser[]
	post: PostItem
	followers: FollowItem[]
}

const FullPostPage: NextPage<FullPostPageProps> = ({ post, followers }) => {
	const router = useRouter()

	const [postList, setPostList] = React.useState([post])

	const handleRemovePost = (postId: number) => {
		const updatedList = postList.filter(post => post.id !== postId)
		setPostList(updatedList)
		if (router.pathname.includes('/news/')) {
			router.push('/')
		}
	}

	const handleRepost = () => {
		// Здесь должна быть логика для репоста поста
		// Например, отправка запроса на сервер
		console.log(`Репост поста с id ${post.id}`)
	}

	return (
		<MainLayout className='mb-50' contentFullWidth>
			<FullPost
				id={post.id}
				title={post.title}
				blocks={post.body}
				user={post.user}
				rating={post.rating}
				createdAt={post.createdAt}
				onRemove={() => handleRemovePost(post.id)}
				onRepost={handleRepost}
				followers={followers}
				userId={post.user.id}
			/>
			<div id='comments'>
				<PostComments postId={post.id} />
			</div>
		</MainLayout>
	)
}

export const getServerSideProps: GetServerSideProps = async ctx => {
	try {
		const id = ctx.params?.id

		// Check if id is defined before making the API call
		if (!id) {
			return {
				redirect: {
					destination: '/',
					permanent: false
				}
			}
		}

		const post = await Api(ctx).post.getOne(+id)
		const users = await Api().user.getAll()
		const followers = await Promise.all(
			users.map(user => Api().follow.getUserFollowing(user.id))
		)

		return {
			props: {
				post,
				users,
				followers
			}
		}
	} catch (err) {
		console.log('Full post page', err)
		return {
			redirect: {
				destination: '/',
				permanent: false
			}
		}
	}
}
