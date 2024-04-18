import { FollowItem } from './types'
import { AxiosInstance } from 'axios'

export const FollowApi = (instance: AxiosInstance) => ({
  async getUserFollowing(id: number) {
    const { data } = await instance.get<FollowItem[]>(`/users/${id}/following`)
    return data
  },
  async getUserFollowers(id: number) {
    const { data } = await instance.get<FollowItem[]>(`/users/${id}/followers`)
    return data
  },

  async followUser(id: number) {
    const { data } = await instance.post(`/users/${id}/follow`)
    return data
  },
  async unfollowUser(id: number) {
    const { data } = await instance.delete(`/users/${id}/unfollow`)
    return data
  },
})
