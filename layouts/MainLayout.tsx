import React, { useState } from 'react'
import clsx from 'clsx'
import { LeftMenu } from '../components/LeftMenu'
import { SideComments } from '../components/SideComments'
import { useSelector } from 'react-redux'
import { selectMenuIsOpen } from '../redux/slices/menuSlice'

interface MainLayoutProps {
	hideComments?: boolean
	hideMenu?: boolean
	contentFullWidth?: boolean
	className?: string
	children: React.ReactNode
}

export const MainLayout: React.FC<MainLayoutProps> = ({
	children,
	contentFullWidth,
	hideComments,
	hideMenu,
	className
}) => {
	const isLeftMenuVisible = useSelector(selectMenuIsOpen)

	return (
		<div>
			<div className={clsx('wrapper', className)}>
				{!hideMenu && (
					<div className='leftSide'>{isLeftMenuVisible && <LeftMenu />}</div>
				)}
				<div className={clsx('content', { 'content--full': contentFullWidth })}>
					{children}
				</div>
				{!hideComments && (
					<div className='rightSide'>
						<SideComments />
					</div>
				)}
			</div>
		</div>
	)
}
