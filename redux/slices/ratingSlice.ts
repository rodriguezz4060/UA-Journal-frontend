import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { PostItem } from '../../utils/api/types'

export interface PostState {
	data?: PostItem | null
}

const initialState: PostState = {
	data: null
}

export const postSlice = createSlice({
	name: 'post',
	initialState,
	reducers: {
		setPostData: (state, action: PayloadAction<PostItem>) => {
			state.data = action.payload
		}
	}
})

export const { setPostData } = postSlice.actions

export const selectPostData = (state: RootState) => state.post.data

export const postReducer = postSlice.reducer
