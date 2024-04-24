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

		if (!id || isNaN(Number(id))) {
			return {
				notFound: true
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
		console.log('Fulll post page', err)
		return {
			props: {},
			redirect: {
				destination: '/',
				permanent: false
			}
		}
	}
}

export default FullPostPage
