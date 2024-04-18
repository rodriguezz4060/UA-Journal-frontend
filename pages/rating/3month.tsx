import {
	Paper,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Typography,
	Tabs,
	Tab,
	makeStyles
} from '@material-ui/core'
import { NextPage } from 'next'
import { MainLayout } from '../../layouts/MainLayout'
import { FollowItem, ResponseUser } from '../../utils/api/types'
import TabsRating from '../../components/RatingPage/TabsRating'
import { FollowButton } from '../../components/FollowButton'
import { Api } from '../../utils/api'
import UsersRating3month from '../../components/RatingPage/UsersRating3month'

interface treeMonthRatingPageProps {
	users: ResponseUser[]
	followers: FollowItem[]
}

const useStyles = makeStyles({
	paper: {
		borderRadius: 0
	}
})

const treeMonthRating: NextPage<treeMonthRatingPageProps> = ({
	users,
	followers
}) => {
	const classes = useStyles()

	return (
		<MainLayout>
			<Paper
				className={`${classes.paper} pl-20 pt-20 pr-20 mb-20`}
				elevation={0}
			>
				<Typography
					variant='h5'
					style={{ fontWeight: 'bold', fontSize: 30, marginBottom: 6 }}
				>
					Рейтинг сообществ и блогов
				</Typography>
				<Typography style={{ fontSize: 15 }}>
					Десять лучших авторов и комментаторов, а также администраторы первых
					десяти сообществ из рейтинга по итогам месяца бесплатно получают
					Plus-аккаунт на месяц.
				</Typography>
				<TabsRating />
			</Paper>
			<UsersRating3month users={users} followers={followers} />
		</MainLayout>
	)
}

export const getServerSideProps = async () => {
	try {
		const users = await Api().user.getAll()
		return {
			props: {
				users
			}
		}
	} catch (err) {
		console.log(err)
	}
	return {
		props: {
			users: null
		}
	}
}

export default treeMonthRating
