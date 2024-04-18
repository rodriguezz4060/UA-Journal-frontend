import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import { createWrapper } from 'next-redux-wrapper'

import { userReducer } from './slices/user'
import { menuReducer } from './slices/menuSlice'
import { postReducer } from './slices/ratingSlice'
import { followersReducer } from './slices/usersFollowersSlice'

export function makeStore() {
	return configureStore({
		reducer: {
			user: userReducer,
			menu: menuReducer,
			post: postReducer,
			followers: followersReducer
		}
	})
}

export const store = makeStore()

export type RootStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<RootStore['getState']>
export type AppDispatch = typeof store.dispatch
export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	RootState,
	unknown,
	Action<string>
>

export const wrapper = createWrapper<RootStore>(makeStore)
