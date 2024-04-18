import React, { useEffect, useState } from 'react'
import styles from './Porfile.module.scss'
import axios from 'axios'
import SettingsIcon from '@material-ui/icons/SettingsOutlined'
import DeleteIcon from '@material-ui/icons/ClearOutlined'
import AddPhotoIcon from '@material-ui/icons/AddPhotoAlternateOutlined'
import SaveIcon from '@material-ui/icons/SaveOutlined'

interface HeaderCoverProps {
	headerCoverUrl: string | null
	headerCoverPosition: string | null
}

const HeaderCover = ({
	headerCoverUrl,
	headerCoverPosition
}: HeaderCoverProps) => {
	const [selectedFile, setSelectedFile] = useState<File | null>(null)
	const [uploadedCoverUrl, setUploadedCoverUrl] = useState<string | null>(
		headerCoverUrl
	)

	const [backgroundPosition, setBackgroundPosition] = useState<string>(
		headerCoverPosition || '50% 50%'
	)
	const [previousCoverUrl, setPreviousCoverUrl] = useState<string | null>(
		headerCoverUrl
	)

	const handleFileChange = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		if (event.target.files && event.target.files.length > 0) {
			const file = event.target.files[0]
			setSelectedFile(file)

			try {
				const formData = new FormData()
				formData.append('file', file)

				const token = document.cookie.replace(
					/(?:(?:^|.*;\s*)rtoken\s*=\s*([^;]*).*$)|^.*$/,
					'$1'
				)

				await axios.patch('http://localhost:7777/users/cover', formData, {
					headers: {
						'Content-Type': 'multipart/form-data',
						Authorization: `Bearer ${token}`
					}
				})

				setPreviousCoverUrl(uploadedCoverUrl)
				setUploadedCoverUrl(URL.createObjectURL(file))
				setIsEditing(true) // Открыть окно редактора после загрузки картинки

				console.log('Обложка успешно загружена')
			} catch (error) {
				console.error('Ошибка загрузки обложки:', error)
			}
		}
	}

	const handleSaveButtonClick = () => {
		const token = document.cookie.replace(
			/(?:(?:^|.*;\s*)rtoken\s*=\s*([^;]*).*$)|^.*$/,
			'$1'
		)

		axios
			.patch(
				'http://localhost:7777/users/me',
				{
					headerCoverPosition: backgroundPosition
				},
				{
					headers: {
						Authorization: `Bearer ${token}`
					}
				}
			)
			.then(() => {
				console.log('Данные о позиции картинки успешно отправлены на сервер')
				setIsChangesSaved(true)
				setIsEditing(false)
			})
			.catch(error => {
				console.error(
					'Ошибка при отправке данных о позиции картинки на сервер:',
					error
				)
			})
	}

	const handleUploadClick = () => {
		document.getElementById('upload-header-cover').click()
	}

	const [isEditing, setIsEditing] = useState(false)
	const [isDragging, setIsDragging] = useState(false)
	const [initialMouseY, setInitialMouseY] = useState(0)
	const [isChangesSaved, setIsChangesSaved] = useState(true)
	const [initialBackgroundPosition, setInitialBackgroundPosition] = useState('')
	const [savedBackgroundPosition, setSavedBackgroundPosition] = useState('')

	const handleSettingsButtonClick = () => {
		setIsEditing(true)
		setInitialBackgroundPosition(backgroundPosition)
	}

	const handleImageMouseDown = e => {
		if (isEditing) {
			setInitialMouseY(e.clientY)
			setInitialBackgroundPosition(backgroundPosition)
			setIsDragging(true)
		}
	}

	const handleImageMouseMove = e => {
		if (isDragging) {
			const offsetY = initialMouseY - e.clientY // Инвертируем offsetY
			const newPosition =
				parseInt(initialBackgroundPosition.split(' ')[1]) + offsetY
			const updatedPosition = Math.max(0, Math.min(100, newPosition))

			setBackgroundPosition(`50% ${updatedPosition}%`)
		}
	}

	const handleImageMouseUp = () => {
		setIsDragging(false)
	}

	const handleCloseClick = () => {
		if (previousCoverUrl) {
			setUploadedCoverUrl(previousCoverUrl)
		}

		setIsEditing(false)
		setIsChangesSaved(true)
		setPreviousCoverUrl(null)
		if (savedBackgroundPosition) {
			setBackgroundPosition(savedBackgroundPosition)
		}
	}

	useEffect(() => {
		if (isEditing) {
			setSavedBackgroundPosition(backgroundPosition)
		}
	}, [isEditing])

	const handleDeleteCover = async () => {
		try {
			const token = document.cookie.replace(
				/(?:(?:^|.*;\s*)rtoken\s*=\s*([^;]*).*$)|^.*$/,
				'$1'
			)

			await axios.delete('http://localhost:7777/users/cover', {
				headers: {
					Authorization: `Bearer ${token}`
				}
			})

			setPreviousCoverUrl(null)
			setUploadedCoverUrl(null)
			setIsEditing(false) // Закрыть окно редактора после удаления обложки

			console.log('Обложка успешно удалена')
		} catch (error) {
			console.error('Ошибка удаления обложки:', error)
		}
	}

	return (
		<div>
			<div
				className={`${styles.headerCover} ${styles.header__cover} `}
				style={{
					backgroundImage: `url(${uploadedCoverUrl})`,
					backgroundPosition: backgroundPosition
				}}
				onMouseDown={handleImageMouseDown}
				onMouseMove={handleImageMouseMove}
				onMouseUp={handleImageMouseUp}
			>
				<div
					className={`${styles.headerCoverManage} ${
						isEditing ? styles.isEditing : ''
					}`}
				>
					<div className={styles.headerCoverManage__item}>
						{!isEditing && (
							<>
								<label
									className={`${styles.button} ${styles.buttonDefault} ${styles.buttonSize_default}`}
								>
									<div className={styles.button__icon}>
										<AddPhotoIcon style={{ height: 16, width: 16 }} />
									</div>
									<span className={styles.button__lable}>
										<input
											type='file'
											id='upload-header-cover'
											style={{ display: 'none' }}
											onChange={handleFileChange}
										/>
										Сменить обложку
									</span>
								</label>
							</>
						)}
					</div>

					{!isEditing && (
						<>
							<button
								className={`${styles.button} ${styles.buttonDefault} ${styles.buttonSize_default} ${styles.headerCoverManage__item}`}
								onClick={handleSettingsButtonClick}
							>
								<div className={`${styles.button__icon} `}>
									<SettingsIcon style={{ height: 20, width: 20 }} />
								</div>
								<span className={styles.button__lable}>Настроить</span>
							</button>
							<button
								className={`${styles.button} ${styles.buttonDefault} ${styles.buttonSize_default} ${styles.headerCoverManage__item}`}
								onClick={handleDeleteCover}
							>
								<div className={`${styles.button__icon} `}>
									<DeleteIcon style={{ height: 18, width: 18 }} />
								</div>
								<span className={styles.button__lable}>Удалить</span>
							</button>
						</>
					)}
					{isEditing && (
						<>
							<button
								className={`${styles.button} ${styles.buttonDefault} ${styles.buttonSize_default} ${styles.headerCoverManage__item}`}
								onClick={handleSaveButtonClick}
							>
								<div className={`${styles.button__icon} `}>
									<SaveIcon style={{ height: 20, width: 20 }} />
								</div>
								<span className={styles.button__lable}>Сохранить</span>
							</button>
							<button
								className={`${styles.button} ${styles.buttonDefault} ${styles.buttonSize_default} ${styles.headerCoverManage__item} `}
								onClick={handleCloseClick}
							>
								<div className={`${styles.button__icon} `}>
									<DeleteIcon style={{ height: 20, width: 20 }} />
								</div>
								<span className={styles.button__lable}>Закрыть</span>
							</button>
						</>
					)}
				</div>
			</div>
		</div>
	)
}

export default HeaderCover
