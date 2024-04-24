import { Post } from '../components/Post'
import { MainLayout } from '../layouts/MainLayout'
import { Api } from '../utils/api'
import { GetServerSideProps, NextPage } from 'next'
import { PostItem, RatingItem, ResponseUser } from '../utils/api/types'
import { useState } from 'react'

interface HomeProps {
	posts: PostItem[]
	user: ResponseUser
	postRating: RatingItem[]
}

const Home: NextPage<HomeProps> = ({ posts, user, postRating }) => {
	const [postList, setPostList] = useState(posts)

	const handleRemovePost = (id: number) => {
		const updatedList = postList.filter(post => post.id !== id)
		setPostList(updatedList)
	}

	return (
		<MainLayout>
			{postList.map(obj => (
				<Post
					key={obj.id}
					id={obj.id}
					rating={obj.rating}
					title={obj.title}
					incut={obj.body
						.filter(
							item =>
								item.type === 'incut' &&
								item.tunes?.anyTuneName?.ShowOnHomepage === true
						)
						.map(item => item.data.text)}
					quote={obj.body
						.filter(
							item =>
								item.type === 'quote' &&
								item.tunes?.anyTuneName?.ShowOnHomepage === true
						)
						.map(item => item.data.text)}
					caption={obj.body
						.filter(
							item =>
								item.type === 'quote' &&
								item.tunes?.anyTuneName?.ShowOnHomepage === true
						)
						.map(item => item.data.caption)}
					video={obj.body
						.filter(
							item =>
								item.type === 'video' &&
								item.tunes?.anyTuneName?.ShowOnHomepage === true
						)
						.map(item => item.data.file.url)}
					description={obj.body
						.filter(
							item =>
								item.type === 'paragraph' &&
								item.tunes?.anyTuneName?.ShowOnHomepage === true
						)
						.map(item => item.data.text)}
					images={obj.body
						.filter(
							item =>
								item.type === 'image' &&
								item.tunes?.anyTuneName?.ShowOnHomepage === true
						)
						.map(item => ({
							url: item.data.file.url,
							width: item.data.file.width,
							height: item.data.file.height,
							caption: item.data.caption
						}))}
					user={obj.user}
					createdAt={obj.createdAt}
					onRemove={handleRemovePost}
				/>
			))}
		</MainLayout>
	)
}

export const getServerSideProps: GetServerSideProps = async ctx => {
	try {
		const posts = await Api().post.getAll()
		return {
			props: {
				posts
			}
		}
	} catch (err) {
		console.log(err)
	}
	return {
		props: {
			posts: null
		}
	}
}

export default Home
