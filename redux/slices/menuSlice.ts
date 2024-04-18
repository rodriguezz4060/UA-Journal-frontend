import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '../store'

const menuSlice = createSlice({
	name: 'menu',
	initialState: {
		isOpen: true
	},
	reducers: {
		toggleMenu: state => {
			state.isOpen = !state.isOpen
		}
	}
})

export const { toggleMenu } = menuSlice.actions

export const menuReducer = menuSlice.reducer

export const selectMenuIsOpen = (state: RootState) => state.menu.isOpen
