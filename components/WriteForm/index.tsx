import React from 'react'
import { Button, Input } from '@material-ui/core'
import styles from './WriteForm.module.scss'
import dynamic from 'next/dynamic'
import { Api } from '../../utils/api'
import { PostItem } from '../../utils/api/types'
import { useRouter } from 'next/router'

const Editor = dynamic(() => import('../Editor'), { ssr: false })

interface WriteFormProps {
	data?: PostItem
}

export const WriteForm: React.FC<WriteFormProps> = ({ data }) => {
	const router = useRouter()
	const [isLoading, setLoading] = React.useState(false)
	const [title, setTitle] = React.useState(data?.title || '')
	const [blocks, setBlocks] = React.useState(data?.body || [])

	const onAddPost = async () => {
		try {
			setLoading(true)
			const obj = {
				title,
				body: blocks,
				items: blocks
			}
			if (!data) {
				const post = await Api().post.create(obj)
				await router.push(`/news/${post.id}`)
			} else {
				await Api().post.update(data.id, obj)
			}
		} catch (err) {
			console.warn('Create post', err)
			alert(err)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div>
			<div className={styles.container}>
				<Input
					value={title}
					onChange={e => setTitle(e.target.value)}
					classes={{ root: styles.titleField }}
					placeholder='Заголовок'
				/>
				<div className={styles.editor}>
					<Editor initialBlocks={blocks} onChange={arr => setBlocks(arr)} />
				</div>
				<div className={styles.codex_editor__bottom}></div>
			</div>
			<div className={styles.writing__footer}>
				<div className={styles.buttonContainer}>
					<Button
						disabled={isLoading || !blocks.length || !title}
						onClick={onAddPost}
						variant='contained'
						color='primary'
					>
						{data ? 'Сохранить' : 'Опубликовать'}
					</Button>
				</div>
			</div>
		</div>
	)
}
