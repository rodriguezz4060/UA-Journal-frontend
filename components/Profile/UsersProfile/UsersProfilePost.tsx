import React, { useState } from 'react'
import Link from 'next/link'
import { Avatar, IconButton, Menu, MenuItem, Paper } from '@material-ui/core'
import { useRouter } from 'next/router'
import styles from '../../Post/Post.module.scss'
import stylesMedia from '../../FullPost/FullPost.module.scss'
import MoreIcon from '@material-ui/icons/MoreHorizOutlined'
import moment from 'moment'
import QuoteIcon from '@material-ui/icons/FormatQuote'
import { ResponseUser } from '../../../utils/api/types'
import { useAppSelector } from '../../../redux/hooks'
import { selectUserData } from '../../../redux/slices/user'
import { Api } from '../../../utils/api'
import { PostActions } from '../../PostActions'
import { HeaderUser } from '../../HeaderPostUserInfo'
import SimpleGallery from '../../PhotoSwipe'

interface UsersProfilePostProps {
	title: string
	id: number
	description: string[]
	incut: string[]
	quote: string[]
	caption: string[]
	images: string[]
	video: string[]
	onRemove: (id: number) => void
	user: ResponseUser
	createdAt: string
	rating: number
}

export const UsersProfilePost: React.FC<UsersProfilePostProps> = ({
	id,
	title,
	description,
	images,
	video,
	user,
	createdAt,
	incut,
	quote,
	caption,
	rating,
	onRemove
}) => {
	const handleRepost = () => {
		// Здесь должна быть логика для репоста поста
		// Например, отправка запроса на сервер
		console.log(`Репост поста с id ${id}`)
	}

	return (
		<Paper elevation={0} classes={{ root: styles.paper }}>
			<div className={styles.postContent}>
				<div className={styles.userInfoContent}>
					<div className={styles.userInfo}>
						<HeaderUser
							showTime={false}
							id={id}
							createdAt={createdAt}
							user={user}
							onRemove={onRemove}
						/>
					</div>
				</div>
			</div>
			<div className={styles.figure}>
				<div className={styles.title}>
					<Link href={`/news/${id}`}>{title}</Link>
				</div>
			</div>
			{images.length > 0 && (
				<div className={`${stylesMedia.imagePost} ${stylesMedia.contentImage}`}>
					{images.map((image: any, index: number) => {
						const obj = {
							type: 'image',
							data: {
								caption: image.caption,

								file: {
									url: image.url,
									width: image.width,
									height: image.height
								}
							}
						}

						const imageStyle =
							obj.data.file.width > obj.data.file.height + 100
								? stylesMedia.islandA
								: stylesMedia.islandB

						return (
							<div className={stylesMedia.figure} key={index}>
								<div className={imageStyle}>
									<div className={stylesMedia.images}>
										<SimpleGallery
											galleryID='postsGallery'
											images={[
												{
													largeURL: obj.data.file.url,
													width: obj.data.file.width,
													height: obj.data.file.height,
													thumbnailURL: obj.data.file.url
												}
											]}
										/>
										<div className={stylesMedia.image_caption}>
											{obj.data.caption}
										</div>
									</div>
								</div>
							</div>
						)
					})}
				</div>
			)}
			{video.length > 0 && (
				<div className={styles.figure}>
					<div className={styles.imagePost}>
						<video controls>
							<source src={video[0]} type='video/mp4' />
						</video>
					</div>
				</div>
			)}
			{incut.length > 0 && (
				<div className={styles.figure}>
					<div className={styles.block_incut}>
						<div
							className={styles.content_incut}
							dangerouslySetInnerHTML={{ __html: incut }}
						/>
					</div>
				</div>
			)}
			{quote.length > 0 && (
				<div className={styles.figure}>
					<blockquote className={stylesMedia.block_quote}>
						<div className={stylesMedia.quote__content}>
							<QuoteIcon />
							<div
								className={stylesMedia.quote_text}
								dangerouslySetInnerHTML={{ __html: quote }}
							/>
							<div
								className={stylesMedia.quote_author}
								dangerouslySetInnerHTML={{ __html: caption }}
							/>
						</div>
					</blockquote>
				</div>
			)}
			{description && (
				<div className={styles.content}>
					{description.map((paragraph, index) => (
						<p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
					))}
				</div>
			)}
			<PostActions id={id} rating={rating} onRepost={handleRepost} />
		</Paper>
	)
}
