import { IconAlignCenter } from '@codexteam/icons'

export default class Incut {
	static get isReadOnlySupported() {
		return true
	}

	static get toolbox() {
		return {
			icon: IconAlignCenter,
			title: 'Incut'
		}
	}

	static get contentless() {
		return true
	}

	static get enableLineBreaks() {
		return true
	}

	static get DEFAULT_INCUT_PLACEHOLDER() {
		return 'Enter a Incut'
	}

	static get ALIGNMENTS() {
		return {
			left: 'left',
			center: 'center'
		}
	}

	static get DEFAULT_ALIGNMENT() {
		return Incut.ALIGNMENTS.center
	}

	static get conversionConfig() {
		return {
			import: 'text',
			export: function (incutData) {
				return incutData.caption
					? `${incutData.text} ${incutData.caption}`
					: incutData.text
			}
		}
	}

	get CSS() {
		return {
			baseClass: this.api.styles.block,
			wrapper: 'cdx-incut',
			text: 'cdx-incut__text',
			input: this.api.styles.input
		}
	}

	constructor({ data = {}, config = {}, api, readOnly = false }) {
		const { ALIGNMENTS, DEFAULT_ALIGNMENT } = Incut

		this.api = api
		this.readOnly = readOnly
		this.incutPlaceholder =
			config.incutPlaceholder || Incut.DEFAULT_INCUT_PLACEHOLDER

		this.data = {
			text: data.text || '',
			alignment:
				Object.values(ALIGNMENTS).includes(data.alignment) && data.alignment
					? data.alignment
					: config.defaultAlignment || DEFAULT_ALIGNMENT
		}
	}

	render() {
		const container = this._make('div', [this.CSS.baseClass, this.CSS.wrapper])
		const incut = this._make('p', [this.CSS.input, this.CSS.text], {
			contentEditable: !this.readOnly,
			innerHTML: this.data.text
		})

		// Add an event listener to update the text property when the user types
		if (!this.readOnly) {
			incut.addEventListener('keyup', event => {
				this.data.text = event.target.innerHTML
			})
		}

		incut.dataset.placeholder = this.incutPlaceholder
		container.appendChild(incut)

		return container
	}

	save(incutElement) {
		const text = incutElement.querySelector(`.${this.CSS.text}`)

		return {
			text: text.innerHTML,
			alignment: this.data.alignment
		}
	}

	static get sanitize() {
		return {
			text: {
				br: true
			},
			alignment: {}
		}
	}

	toggleAlignment(alignment) {
		this.data.alignment = alignment
		this.api.blocks.insert('incut', this.data)
	}

	_make(tagName, classNames, attributes = {}) {
		const element = document.createElement(tagName)
		classNames.forEach(className => element.classList.add(className))
		for (const key in attributes) {
			if (attributes.hasOwnProperty(key)) {
				element.setAttribute(key, attributes[key])
			}
		}
		return element
	}
}
