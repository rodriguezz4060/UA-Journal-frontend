import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { setUserData } from '../redux/slices/user'
import { Api } from '../utils/api'
import { Header } from '../components/Header'
import { MuiThemeProvider } from '@material-ui/core/styles'
import { theme } from '../theme'
import { wrapper } from '../redux/store'
import { AppProps } from 'next/app'
import '../styles/globals.css'
import 'macro-css'
import NextNProgress from '../components/Progressbar'

function App({ Component, pageProps }: AppProps) {
	const dispatch = useAppDispatch()

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const userData = await Api().user.getMe()
				dispatch(setUserData(userData))
			} catch (err) {
				console.log(err)
			}
		}

		fetchUserData()
	}, [dispatch])

	return (
		<MuiThemeProvider theme={theme}>
			<Header />
			<Component {...pageProps} />
			<NextNProgress />
		</MuiThemeProvider>
	)
}

export default wrapper.withRedux(App)
