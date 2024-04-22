import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { FollowItem, ResponseUser } from '../../utils/api/types'

export interface FollowState {
	data: FollowItem[] | null
	userFollowers: FollowItem[]
}

const initialState: FollowState = {
	data: null,
	userFollowers: []
}

const followersSlice = createSlice({
	name: 'followers',
	initialState,
	reducers: {
		updateFollowers: (state, action: PayloadAction<FollowItem[]>) => {
			state.userFollowers = action.payload // Обновление состояния userFollowers
		},
		setFollowersData: (state, action: PayloadAction<FollowItem[]>) => {
			state.data = action.payload
		}
	}
})

export const { updateFollowers, setFollowersData } = followersSlice.actions

export const followersReducer = followersSlice.reducer

export const selectFollowers = (state: RootState) =>
	state.followers.userFollowers
