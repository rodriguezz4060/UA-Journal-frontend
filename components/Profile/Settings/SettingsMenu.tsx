import styles from './Settings.module.scss'
import ProfileIcon from '@material-ui/icons/PersonOutline'
import React, { useState } from 'react'
import SettingsIcon from '@material-ui/icons/SettingsOutlined'

interface SettingsMenuProps {
	activeTab: string
	onTabChange: (tab: string) => void
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({
	activeTab,
	onTabChange
}) => {
	return (
		<div>
			<div className={styles.island__header}>
				<span className={styles.island__title}>Настройки</span>
			</div>
			<div
				className={`${styles.listTab} ${
					activeTab === 'profile' ? styles.listTab__active : ''
				}`}
			>
				<span className={styles.listTab__icon}>
					<ProfileIcon style={{ width: 28, height: 28 }} />
				</span>
				<div
					className={styles.listTab__label}
					onClick={() => onTabChange('profile')}
				>
					<span className={styles.listTtab__labelText}>Профиль</span>
				</div>
			</div>
			<div
				className={`${styles.listTab} ${
					activeTab === 'general' ? styles.listTab__active : ''
				}`}
			>
				<span className={styles.listTab__icon}>
					<SettingsIcon style={{ width: 26, height: 26 }} />
				</span>
				<div
					className={styles.listTab__label}
					onClick={() => onTabChange('general')}
				>
					<span className={styles.listTtab__labelText}>Основное</span>
				</div>
			</div>
		</div>
	)
}

export default SettingsMenu
