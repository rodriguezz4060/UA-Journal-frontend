import Link from 'next/link'
import styles from './RatingPage.module.scss'
import { useRouter } from 'next/router'
import { NextPage } from 'next'
import { Button } from '@material-ui/core'

interface TabsProps {}

const currentDate = new Date()
const currentMonth = currentDate.toLocaleString('default', { month: 'long' })

const capitalizedMonth =
	currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1)

const tabs = [
	{ text: capitalizedMonth, path: '/rating' },
	{ text: '3 месяца', path: '/rating/3month' },
	{ text: 'За все время', path: '/rating/all' }
]
const TabsRating: NextPage<TabsProps> = ({}) => {
	const router = useRouter()

	const isActive = (path: string) => {
		return router.asPath === path ? styles.uiTab__active : styles.inactiveSvg
	}

	return (
		<div
			className={`${styles.uiTabs} ${styles.uiTabs__default} 
			${styles.uiTabs__noScroll}`}
		>
			<div className={styles.uiTabs__scroll}>
				<div className={`${styles.uiTabs__content} `}>
					{tabs.map(obj => (
						<Link
							href={obj.path}
							key={obj.path}
							className={`${isActive(obj.path)} ${styles.uiTab}`}
						>
							<span className={` ${styles.uiTab__label}`}>{obj.text}</span>
						</Link>
					))}
				</div>
			</div>
		</div>
	)
}

export default TabsRating
