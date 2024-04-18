import { createTheme } from '@material-ui/core'
import shadows from '@material-ui/core/styles/shadows'

export const theme = createTheme({
	props: {
		MuiButtonBase: {
			disableRipple: true
		}
	},

	palette: {
		primary: {
			main: '#4683d9'
		}
	},

	overrides: {
		MuiPaper: {
			rounded: {
				borderRadius: '8px'
			}
		},
		MuiMenu: {
			paper: {
				borderRadius: '8px'
			}
		},

		MuiMenuItem: {
			root: { fontSize: '15px' }
		},

		MuiDialog: {
			paper: {
				boxShadow: 'none',
				borderRadius: '3px'
			}
		},

		MuiButton: {
			root: {
				borderRadius: '8px',
				textTransform: 'inherit',
				fontSize: '16',
				transition: 'none',
				'&:active': {
					boxShadow:
						'0 1px 1px rgb(0 0 0 / 15%), 0 4px 7px rgb(0 0 0 / 0%), 0 -1px 0 rgb(0 0 0 / 5%), -1px 0 0 rgb(0 0 0 / 5%), 1px 0 0 rgb(0 0 0 / 5%)',
					transform: 'translateY(1px)'
				}
			},
			contained: {
				backgroundColor: 'white',
				boxShadow:
					'0 1px 1px rgb(0 0 0 / 15%), 0 4px 7px rgb(0 0 0 / 5%), 0 -1px 0 rgb(0 0 0 / 5%), -1px 0 0 rgb(0 0 0 / 5%), 1px 0 0 rgb(0 0 0 / 5%)',
				'&:hover': {
					backgroundColor: 'white',
					boxShadow: 'none'
				}
			},
			containedPrimary: {
				backgroundColor: '#4683d9',
				'&:hover': {
					backgroundColor: '#437CCE'
				}
			}
		}
	}
})
