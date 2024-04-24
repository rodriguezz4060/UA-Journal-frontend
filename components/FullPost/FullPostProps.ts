import { OutputData } from '@editorjs/editorjs'
import { ResponseUser } from '../../utils/api/types'

export type FullPostProps = {
	// Определите свойства здесь
	id: number
	user: ResponseUser
	userId: number
	title: string
	blocks: OutputData['blocks']
	rating: number
	createdAt: string
	onRemove: () => void
	followers: any[] // Замените 'any' на правильный тип, если он известен
}
