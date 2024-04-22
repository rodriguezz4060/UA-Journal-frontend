import React, { useState } from 'react'
import Link from 'next/link'
import { Paper } from '@material-ui/core'
import styles from './Post.module.scss'
import quotecss from '../FullPost/FullPost.module.scss'
import { PostActions } from '../PostActions'
import { ResponseUser } from '../../utils/api/types'
import QuoteIcon from '@material-ui/icons/FormatQuote'
import stylesMedia from '../FullPost/FullPost.module.scss'

import moment from 'moment'
import 'moment/locale/ru'
moment.locale('ru')
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { HeaderUser } from '../HeaderPostUserInfo'
import SimpleGallery from '../PhotoSwipe'
import RepostEditor from './RepostEditor'

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			display: 'flex'
		},
		paper: {
			marginRight: theme.spacing(2)
		}
	})
)

interface PostProps {
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

export const Post: React.FC<PostProps> = ({
	id,
	title,
	description,
	images,
	video,
	onRemove,
	user,
	createdAt,
	incut,
	quote,
	caption,
	rating
}) => {
	const classes = useStyles()

	const handleRepost = () => {
		// Здесь должна быть логика для репоста поста
		// Например, отправка запроса на сервер
		console.log(`Репост поста с id ${id}`)
	}

	return (
		<div>
			<Paper elevation={0} classes={{ root: styles.paper }}>
				<div className={styles.postContent}>
					<div className={styles.userInfoContent}>
						<HeaderUser
							onRemove={onRemove}
							showTime={false}
							id={id}
							createdAt={createdAt}
							user={user}
						/>
					</div>
				</div>
				<div className={styles.figure}>
					<div className={styles.title}>
						<Link href={`/news/${id}`}>{title}</Link>
					</div>
				</div>
				{images.length > 0 && (
					<div
						className={`${stylesMedia.imagePost} ${stylesMedia.contentImage}`}
					>
						{images.map((image: any, index) => {
							const obj = {
								type: 'image',
								data: {
									caption: caption,
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
						<blockquote className={quotecss.block_quote}>
							<div className={quotecss.quote__content}>
								<QuoteIcon />
								<div
									className={quotecss.quote_text}
									dangerouslySetInnerHTML={{ __html: quote }}
								/>
								<div
									className={quotecss.quote_author}
									dangerouslySetInnerHTML={{ __html: caption }}
								/>
							</div>
						</blockquote>
					</div>
				)}
				{description && (
					<div className={styles.content}>
						{description.map((paragraph: any, index: any) => (
							<p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
						))}
					</div>
				)}
				<PostActions id={id} rating={rating} onRepost={handleRepost} />
			</Paper>
		</div>
	)
}
