import styles from './Settings.module.scss'
import Link from 'next/link'
import { MainLayout } from '../../../layouts/MainLayout'
import ArrowBackIcon from '@material-ui/icons/ArrowBackIosOutlined'
import { useState } from 'react'
import React from 'react'
import Profile from './Profile'
import SettingsMenu from './SettingsMenu'
import General from './General'
import SaveButton from './SaveButton'
import { parseCookies } from 'nookies'
import { useAppSelector } from '../../../redux/hooks'
import { selectUserData, setUserData } from '../../../redux/slices/user'
import { useDispatch } from 'react-redux'
import axios from 'axios'

interface SettingsMainProps {
	id: string
}

const SettingsMain: React.FC<SettingsMainProps> = ({ id }) => {
	const [activeTab, setActiveTab] = useState('profile')

	const handleTabChange = tab => {
		setActiveTab(tab)
	}
	const [error, setError] = useState('')
	const userData = useAppSelector(selectUserData)
	const [fullName, setFullName] = useState(userData.fullName)
	const [description, setDescription] = useState(userData.description)
	const [feed, setFeed] = useState(userData.feed)
	const dispatch = useDispatch()

	const handleSubmit = async () => {
		try {
			const cookies = parseCookies()
			const token = cookies.rtoken
			const formData = {
				fullName: fullName,
				description: description,
				feed: feed
			}

			const response = await axios.patch(
				'http://localhost:7777/users/me',
				formData,
				{
					headers: {
						Authorization: `Bearer ${token}`
					}
				}
			)
			if (response.data && response.data.fullName) {
				setFullName(response.data.fullName)
				setDescription(response.data.description)
				setFeed(response.data.feed)
				setError('')
				dispatch(setUserData(response.data)) // Обновление состояния userData
			}
		} catch (error) {
			setError('Ошибка при сохранении данных')
			console.error(error)
		}
	}

	return (
		<div>
			<style>
				{`
          :root {
      --wrapper-padding-top: 70px;
			.content {
				--max-width-content: 960px;
			}
          }
        `}
			</style>
			<MainLayout>
				<div
					className={`${styles.page} ${styles.userSettings} ${styles.page__contentSidebar}`}
				>
					<div className={styles.page__content}>
						<div
							className={`${styles.userSettings__content} ${styles.islandBg} ${styles.islandRound} ${styles.island}`}
						>
							<Link
								className={`${styles.settingsHeader} ${styles.userSettings__header}`}
								href={`/profile/${id}`}
							>
								<ArrowBackIcon
									style={{ width: 15, height: 15 }}
									className={`${styles.settingsHeader__icon} ${styles.icon} ${styles.icon__arrow_left}`}
								/>
							</Link>
							<div className={styles.userSettings__container}>
								<div className={styles.userProfile}>
									{activeTab === 'profile' && <Profile />}
									{activeTab === 'general' && <General />}
								</div>
							</div>
						</div>
					</div>
					<div
						className={`${styles.userSettings__sidebar} ${styles.userSettings__sidebar}`}
					>
						<div className={`${styles.userSettings__stickyContainer}`}>
							<div
								className={`${styles.islandBg} ${styles.island} ${styles.islandRound} ${styles.sidebarNavigation__desktop}`}
							>
								<SettingsMenu
									activeTab={activeTab}
									onTabChange={handleTabChange}
								/>
							</div>
						</div>
					</div>
				</div>
			</MainLayout>
		</div>
	)
}

export default SettingsMain
