export type FullPostProps = {
	// Определите свойства здесь
	title: string
	blocks: any[] // Замените 'any' на правильный тип, если он известен
	user: any // Замените 'any' на правильный тип, если он известен
	userId: number
	id: number
	rating: number
	createdAt: string
	onRemove: () => void
	followers: any[] // Замените 'any' на правильный тип, если он известен
}
