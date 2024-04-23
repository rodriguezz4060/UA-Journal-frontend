import { GetServerSideProps, NextPage } from 'next'
import SettingsMain from '../../components/Profile/Settings'
import { ResponseUser } from '../../utils/api/types'
import { Api } from '../../utils/api'

interface SettingsProps {
	user: ResponseUser
}

const Settings: NextPage<SettingsProps> = ({ user }) => {
	return (
		<SettingsMain
			id={user.id}
			fullName={user.fullName}
			description={user.description}
		/>
	)
}

export const getServerSideProps: GetServerSideProps = async ctx => {
	try {
		const api = Api(ctx)
		const userData = await api.user.getMe()
		return {
			props: {
				user: userData
			}
		}
	} catch (err) {
		console.log(err)
	}
	return {
		props: {
			user: null
		}
	}
}

export default Settings
