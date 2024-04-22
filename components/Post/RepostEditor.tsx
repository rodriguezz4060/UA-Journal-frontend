import React, { useRef, useEffect } from 'react'
import EditorJS, { OutputData } from '@editorjs/editorjs'
import Quote from '@editorjs/quote'
import List from '@editorjs/list'
import IncutTool from './../EditorTools/incut'
import ImageTool from '@editorjs/image'
import VideoTool from '@medistream/editorjs-video'
import { IconStar } from '@codexteam/icons'
import ShowOnHomepagePlugin from './../EditorTools/tunes'

const Paragraph = require('@editorjs/paragraph')
const CodeTool = require('@editorjs/code')

interface RepostEditorProps {
	initialBlocks?: OutputData['blocks']
	onSave: (data: OutputData) => void
}

const RepostEditor: React.FC<RepostEditorProps> = ({
	initialBlocks,
	onSave
}) => {
	const editorRef = useRef<EditorJS | null>(null)

	useEffect(() => {
		if (!editorRef.current) {
			const editor = new EditorJS({
				holder: 'repost-editor',
				minHeight: 0,
				data: {
					blocks: initialBlocks || []
				},
				autofocus: true,
				placeholder: 'Добавьте комментарий к репосту',
				hideToolbar: false,
				// Используйте те же инструменты, что и в основном редакторе
				tools: {
					// ... ваши инструменты ...
				}
				// Используйте те же настройки, что и в основном редакторе
				// ... ваши настройки ...
			})

			editorRef.current = editor
		}

		return () => {
			if (editorRef.current) {
				editorRef.current.destroy()
				editorRef.current = null
			}
		}
	}, [initialBlocks])

	const handleSave = async () => {
		if (editorRef.current) {
			const data = await editorRef.current.save()
			onSave(data)
		}
	}

	return (
		<div>
			<div id='repost-editor' />
			<button onClick={handleSave}>Сохранить репост</button>
		</div>
	)
}

export default RepostEditor
