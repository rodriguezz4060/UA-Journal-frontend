const { make } = require('./util')
import { IconStar } from '@codexteam/icons'

export default class ShowOnHomepagePlugin {
	static trueCount = 0
	static get isTune() {
		return true
	}

	constructor({ api, data, block }) {
		this.api = api
		this.block = block

		this.data = data || { ShowOnHomepage: false }
		this._CSS = {
			ShowOnHomepage: 'show-on-homepage',
			Button: 'ce-popover-item',
			Icon: 'ce-popover-item__icon',
			Text: 'ce-popover-item__title',
			ActiveButton: 'ce-block-settings__item--active'
		}
	}

	wrap(blockContent) {
		this.wrapper = make('div')
		this.wrapper.classList.toggle(
			this._CSS.ShowOnHomepage,
			this.data.ShowOnHomepage
		)
		this.wrapper.append(blockContent)
		return this.wrapper
	}

	render() {
		const wrapper = make('div')
		const button = document.createElement('div')
		const icon = document.createElement('span')
		icon.classList.add(this._CSS.Icon)
		icon.innerHTML = IconStar
		button.appendChild(icon)
		const buttonText = document.createElement('div')
		buttonText.innerText = 'Вывести на главную'
		buttonText.classList.add(this._CSS.Text)
		button.appendChild(buttonText)
		button.addEventListener('click', () => {
			if (ShowOnHomepagePlugin.trueCount < 2 || this.data.ShowOnHomepage) {
				if (this.data.ShowOnHomepage) {
					ShowOnHomepagePlugin.trueCount--
				} else {
					ShowOnHomepagePlugin.trueCount++
				}
				this.data.ShowOnHomepage = !this.data.ShowOnHomepage
				this.wrapper.classList.toggle(
					this._CSS.ShowOnHomepage,
					this.data.ShowOnHomepage
				)
				button.classList.toggle(this._CSS.ActiveButton)
			}
		})
		button.classList.add(this._CSS.Button)
		button.classList.toggle(this._CSS.ActiveButton, this.data.ShowOnHomepage)
		wrapper.appendChild(button)
		return wrapper
	}

	save() {
		if (ShowOnHomepagePlugin.trueCount >= 2 && this.data.ShowOnHomepage) {
			this.data.ShowOnHomepage = false
			this.wrapper.classList.remove(this._CSS.ShowOnHomepage)
		}
		return this.data
	}
}

module.exports = ShowOnHomepagePlugin
