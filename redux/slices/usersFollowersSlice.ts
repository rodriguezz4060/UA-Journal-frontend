import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { ResponseUser } from '../../utils/api/types'

export interface FollowState {
	data?: ResponseUser[]
	userFollowers: ResponseUser[]
}

const initialState: FollowState = {
	data: null,
	userFollowers: []
}

const followersSlice = createSlice({
	name: 'followers',
	initialState,
	reducers: {
		updateFollowers: (state, action: PayloadAction<ResponseUser[]>) => {
			state.userFollowers = action.payload // Обновление состояния userFollowers
		},
		setFollowersData: (state, action: PayloadAction<ResponseUser[]>) => {
			state.data = action.payload
		}
	}
})

export const { updateFollowers, setFollowersData } = followersSlice.actions

export const followersReducer = followersSlice.reducer

export const selectFollowers = (state: RootState) =>
	state.followers.userFollowers
