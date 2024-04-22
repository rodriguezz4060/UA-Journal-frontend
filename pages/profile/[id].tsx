import { GetServerSideProps, NextPage } from 'next'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { MainLayout } from '../../layouts/MainLayout'
import { selectUserData } from '../../redux/slices/user'
import { Api } from '../../utils/api'
import { Paper, Tab, Tabs } from '@material-ui/core'
import AvatarUploader from '../../components/Profile/AvatarUploader'
import { UserInfo } from '../../components/Profile/UserInfo'
import {
	CommentItem,
	FollowItem,
	PostItem,
	RatingItem,
	ResponseUser
} from '../../utils/api/types'
import { UsersProfileInfo } from '../../components/Profile/UsersProfile/UsersProfileInfo'
import UsersProfileAvatar from '../../components/Profile/UsersProfile/UsersProfileAvatar'
import { useState } from 'react'
import { Post } from '../../components/Post'
import { UsersProfilePost } from '../../components/Profile/UsersProfile/UsersProfilePost'
import { useUserComments } from '../../hooks/useUserComments'
import { CommentProfile } from '../../components/Profile/CommentProfile'
import { makeStyles } from '@material-ui/core/styles'
import { CreateNewPost } from '../../components/Profile/CreateNewPost'
import { UsersFollowInfo } from '../../components/Profile/UsersProfile/UsersFollowBlock'
import { selectFollowers } from '../../redux/slices/usersFollowersSlice'
import { FollowInfo } from '../../components/Profile/FollowBlock'

const useStyles = makeStyles({
	paper: {
		padding: '15px',
		marginBottom: '20px',
		borderRadius: '10px',
		boxShadow: '0 2px 4px rgba(0,0,0,.06)',
		transition: 'box-shadow 0.3s ease-in-out',
		'&:hover': {
			boxShadow: '0 4px 8px rgba(0,0,0,.12)'
		}
	}
})

interface ProfilePage {
	posts: PostItem[]
	coments: CommentItem[]
	user: ResponseUser
	postRating: RatingItem[]
	followers: FollowItem[]
	following: FollowItem[]
}

const ProfilePage: NextPage<ProfilePage> = ({
	user,
	coments,
	posts,
	followers,
	following
}) => {
	const classes = useStyles()
	const router = useRouter()
	const { id } = router.query

	const [selectedTab, setSelectedTab] = useState(0)
	const [postList, setPostList] = useState(posts)

	const userData = useSelector(selectUserData)
	const userPosts = posts.filter(post => post.user.id === user.id)
	const isOwnProfile = userData && id && Number(id) === userData.id
	const [userFollowers, setUserFollowers] = useState([])
	const { userComments } = useUserComments(Number(id))

	const followersData = useSelector(selectFollowers)
	const currentUserFollowers = followersData

	const handleRemovePost = (id: number) => {
		const updatedList = postList.filter(post => post.id !== id)
		setPostList(updatedList)
	}

	const filteredComments = userComments.filter(
		comment => comment.user.id === user.id
	)

	const sortedComments = filteredComments.sort(
		(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
	)
	// заглушка которая выдает ошибку кекв
	const [CommentsList, setComments] = useState(coments)

	const handleRemoveComment = (commentId: number) => {
		setComments(prevComments =>
			prevComments.filter(comment => comment.id !== commentId)
		)
	}

	return (
		<div>
			<MainLayout contentFullWidth>
				{isOwnProfile ? (
					<div>
						<Paper
							className='pl-20 pr-20 pt-20 mb-30'
							elevation={0}
							style={{ borderRadius: 10 }}
						>
							<div className='justify-between'>
								<AvatarUploader
									headerCoverUrl={userData.headerCoverUrl}
									headerCoverPosition={userData.headerCoverPosition}
								/>
							</div>
							<UserInfo followers={followers} />
							<Tabs
								className='mt-20'
								value={selectedTab}
								indicatorColor='primary'
								textColor='primary'
								onChange={(_, newValue) => setSelectedTab(newValue)}
							>
								<Tab label='Статьи' />
								<Tab label='Комментарии' />
								<Tab label='Закладки' />
							</Tabs>
						</Paper>
						<div className='contentProfileSidebar ProfilePage'>
							<div className='ProfilePage__content'>
								{selectedTab === 0 && (
									<div>
										<CreateNewPost />

										{userPosts.map(obj => (
											<Post
												key={obj.id}
												id={obj.id}
												onRemove={handleRemovePost}
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
													.map(item => item.data.file.url)}
												user={obj.user}
												createdAt={obj.createdAt}
											/>
										))}
									</div>
								)}
								{selectedTab === 1 && (
									<div className='ProfilePage__content'>
										{sortedComments.map(comment => (
											<Paper className={classes.paper} elevation={0}>
												<CommentProfile
													id={comment.id}
													onRemove={handleRemoveComment}
													user={user}
													text={comment.text}
													createdAt={comment.createdAt}
													post={comment.post}
													currentUserId={userData.id}
												/>
											</Paper>
										))}
									</div>
								)}
							</div>
							<div className=' ProfilePage__sideBar'>
								<FollowInfo
									following={following}
									followers={followers}
									user={userData}
									userId={user.id}
								/>
							</div>
						</div>
					</div>
				) : (
					<div>
						<Paper className='pl-20 pr-20 pt-20 mb-30' elevation={0}>
							<UsersProfileAvatar user={user} />
							<UsersProfileInfo user={user} followers={followers} />
							<Tabs
								className='mt-20'
								value={selectedTab}
								indicatorColor='primary'
								textColor='primary'
								onChange={(_, newValue) => setSelectedTab(newValue)}
							>
								<Tab label='Статьи' />
								<Tab label='Комментарии' />
								<Tab label='Закладки' />
							</Tabs>
						</Paper>
						<div className='contentProfileSidebar ProfilePage'>
							<div className='ProfilePage__content'>
								{selectedTab === 0 && (
									<div>
										{userPosts.map(obj => (
											<UsersProfilePost
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
													.map(item => item.data.file.url)}
												user={obj.user}
												createdAt={obj.createdAt}
												onRemove={handleRemovePost}
											/>
										))}
									</div>
								)}

								<div className='ProfilePage__content'>
									{selectedTab === 1 && (
										<div className='mr-20 flex'>
											{filteredComments.map(comment => (
												<Paper className={classes.paper} elevation={0}>
													<CommentProfile
														id={comment.id}
														user={user}
														text={comment.text}
														createdAt={comment.createdAt}
														currentUserId={comment.user.id}
														post={comment.post}
														onRemove={function (id: number): void {
															throw new Error('Function not implemented.')
														}}
													/>
												</Paper>
											))}
										</div>
									)}
								</div>
							</div>
							<div className=' ProfilePage__sideBar'>
								<UsersFollowInfo
									following={following}
									followers={followers}
									userId={user.id}
								/>
							</div>
						</div>
					</div>
				)}
			</MainLayout>
		</div>
	)
}

export const getServerSideProps: GetServerSideProps = async ctx => {
	try {
		const api = Api(ctx)
		const { id } = ctx.query
		const userData = await api.user.getUserById(Number(id))

		const posts = await api.post.getAll()
		const userComments = await api.comment.getCommentsByUserId(Number(id))

		const following = await api.follow.getUserFollowing(Number(id))
		const followers = await api.follow.getUserFollowers(Number(id))

		return {
			props: {
				posts,
				user: userData,
				userComments,
				followers: followers,
				following: following
			}
		}
	} catch (err) {
		console.log(err)
	}
	return {
		props: {
			posts: null,
			user: null,
			userComments: null,
			followers: [],
			following: []
		}
	}
}

export default ProfilePage
