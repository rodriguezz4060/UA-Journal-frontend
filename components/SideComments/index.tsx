import React from 'react'
import ArrowRightIcon from '@material-ui/icons/NavigateNextOutlined'
import styles from './SideComments.module.scss'
import { CommentItem } from './CommentItem'
import clsx from 'clsx'
import { useComments } from '../../hooks/useComments'

export const SideComments = () => {
	const { comments } = useComments()
	const [visible, setVisible] = React.useState(true)

	const toggleVisible = () => {
		setVisible(!visible)
	}

	return (
		<div className={clsx(styles.root, !visible && styles.rotated)}>
			<div className={styles.header}>
				<div className={styles.headerContent}>
					<h3 onClick={toggleVisible}>
						Комментарии <ArrowRightIcon />
					</h3>
				</div>
			</div>
			<div className={styles.commentContent}>
				{visible &&
					comments
						.slice(-20)
						.reverse()
						.map(obj => <CommentItem key={obj.id} {...obj} />)}
			</div>
		</div>
	)
}
