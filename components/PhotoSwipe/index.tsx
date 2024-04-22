import React, { useEffect } from 'react'
import PhotoSwipeLightbox from 'photoswipe/lightbox'
import 'photoswipe/style.css'
import styles from './PhotoSwipe.module.scss'

export default function SimpleGallery(props: {
	galleryID: string | undefined
	images: any[]
}) {
	useEffect(() => {
		let lightbox = new PhotoSwipeLightbox({
			gallery: '#' + props.galleryID,
			children: 'a',
			pswpModule: () => import('photoswipe')
		})
		lightbox.init()

		return () => {
			lightbox.destroy()
			lightbox = null
		}
	}, [])

	return (
		<div className='pswp-gallery' id={props.galleryID}>
			{props.images.map((image, index) => {
				let maxWidth = ''

				if (image.width > image.height + 100) {
					maxWidth = '100%'
				} else if (Math.abs(image.width - image.height) <= 10) {
					maxWidth = '462px'
				} else if (
					image.height > image.width + 200 &&
					image.height <= image.width + 300
				) {
					maxWidth = '347px'
				} else if (image.height > 400) {
					maxWidth = '176px'
				}

				return (
					<div className={styles.islanA} key={props.galleryID + '-' + index}>
						<a
							href={image.largeURL}
							data-pswp-width={image.width}
							data-pswp-height={image.height}
							key={props.galleryID + '-' + index}
							target='_blank'
							rel='noreferrer'
						>
							<img
								src={image.thumbnailURL}
								alt=''
								style={{ maxWidth }}
								key={props.galleryID + '-' + index}
								loading='lazy'
							/>
						</a>
					</div>
				)
			})}
		</div>
	)
}
