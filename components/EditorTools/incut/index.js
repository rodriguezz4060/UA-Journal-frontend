/**
 * Build styles
 */

import { IconAlignCenter } from '@codexteam/icons'

/**
 * @class Incut
 * @classdesc Incut Tool for Editor.js
 * @property {IncutData} data - Tool`s input and output data
 * @propert {object} api - Editor.js API instance
 *
 * @typedef {object} IncutData
 * @description Incut Tool`s input and output data
 * @property {string} text - quote`s text
 * @property {string} caption - quote`s caption
 * @property {'center'|'left'} alignment - quote`s alignment
 *
 * @typedef {object} IncutConfig
 * @description Incut Tool`s initial configuration
 * @property {string} incutPlaceholder - placeholder to show in quote`s text input
 * @property {string} captionPlaceholder - placeholder to show in quote`s caption input
 * @property {'center'|'left'} defaultAlignment - alignment to use as default
 *
 * @typedef {object} TunesMenuConfig
 * @property {string} icon - menu item icon
 * @property {string} label - menu item label
 * @property {boolean} isActive - true if item should be in active state
 * @property {boolean} closeOnActivate - if true tunes menu should close once any item is selected
 * @property {() => void} onActivate - item activation callback
 */
export default class Incut {
  /**
   * Notify core that read-only mode is supported
   *
   * @returns {boolean}
   */
  static get isReadOnlySupported() {
    return true
  }

  /**
   * Get Tool toolbox settings
   * icon - Tool icon's SVG
   * title - title to show in toolbox
   *
   * @returns {{icon: string, title: string}}
   */
  static get toolbox() {
    return {
      icon: IconAlignCenter,
      title: 'Incut',
    }
  }

  /**
   * Empty Incut is not empty Block
   *
   * @public
   * @returns {boolean}
   */
  static get contentless() {
    return true
  }

  /**
   * Allow to press Enter inside the Incut
   *
   * @public
   * @returns {boolean}
   */
  static get enableLineBreaks() {
    return true
  }

  /**
   * Default placeholder for Incut text
   *
   * @public
   * @returns {string}
   */
  static get DEFAULT_INCUT_PLACEHOLDER() {
    return 'Enter a Incut'
  }

  /**
   * Allowed Incut alignments
   *
   * @public
   * @returns {{left: string, center: string}}
   */
  static get ALIGNMENTS() {
    return {
      left: 'left',
      center: 'center',
    }
  }

  /**
   * Default Incut alignment
   *
   * @public
   * @returns {string}
   */
  static get DEFAULT_ALIGNMENT() {
    return Incut.ALIGNMENTS.center
  }

  /**
   * Allow Incut to be converted to/from other blocks
   */
  static get conversionConfig() {
    return {
      /**
       * To create Incut data from string, simple fill 'text' property
       */
      import: 'text',
      /**
       * To create string from Incut data, concatenate text and caption
       *
       * @param {IncutData} incutData
       * @returns {string}
       */
      export: function (incutData) {
        return incutData.caption ? `${incutData.text} ` : incutData.text
      },
    }
  }

  /**
   * Tool`s styles
   *
   * @returns {{baseClass: string, wrapper: string, quote: string, input: string, string}}
   */
  get CSS() {
    return {
      baseClass: this.api.styles.block,
      wrapper: 'cdx-quote',
      text: 'cdx-quote__text',
      input: this.api.styles.input,
    }
  }

  /**
   * Render plugin`s main Element and fill it with saved data
   *
   * @param {{data: IncutData, config: IncutConfig, api: object}}
   *   data — previously saved data
   *   config - user config for Tool
   *   api - Editor.js API
   *   readOnly - read-only mode flag
   */
  constructor({ data, config, api, readOnly }) {
    const { ALIGNMENTS, DEFAULT_ALIGNMENT } = Incut

    this.api = api
    this.readOnly = readOnly

    this.incutPlaceholder = config.incutPlaceholder || Incut.DEFAULT_INCUT_PLACEHOLDER

    this.data = {
      text: data.text || '',
      alignment:
        (Object.values(ALIGNMENTS).includes(data.alignment) && data.alignment) ||
        config.defaultAlignment ||
        DEFAULT_ALIGNMENT,
    }
  }

  /**
   * Create Incut Tool container with inputs
   *
   * @returns {Element}
   */
  render() {
    const container = this._make('blockincut', [this.CSS.baseClass, this.CSS.wrapper])
    const incut = this._make('p', [this.CSS.input, this.CSS.text], {
      contentEditable: !this.readOnly,
      innerHTML: this.data.text,
    })

    incut.dataset.placeholder = this.incutPlaceholder

    container.appendChild(incut)

    return container
  }

  /**
   * Extract incut data from Quote Tool element
   *
   * @param {HTMLDivElement} incutElement - element to save
   * @returns {IncutData}
   */
  save(incutElement) {
    const text = incutElement.querySelector(`.${this.CSS.text}`)
    const caption = incutElement.querySelector(`.${this.CSS.caption}`)

    return Object.assign(this.data, {
      text: text.innerHTML,
    })
  }

  /**
   * Sanitizer rules
   */
  static get sanitize() {
    return {
      text: {
        br: true,
      },
      alignment: {},
    }
  }

  /**
   * Create wrapper for Tool`s settings buttons:
   * 1. Left alignment
   * 2. Center alignment
   *
   * @returns {TunesMenuConfig}
   *
   */

  /**
   * Toggle quote`s alignment
   *
   * @param {string} tune - alignment
   * @private
   */
  _toggleTune(tune) {
    this.data.alignment = tune
  }

  /**
   * Helper for making Elements with attributes
   *
   * @param  {string} tagName           - new Element tag name
   * @param  {Array|string} classNames  - list or name of CSS classname(s)
   * @param  {object} attributes        - any attributes
   * @returns {Element}
   */
  _make(tagName, classNames = null, attributes = {}) {
    const el = document.createElement(tagName)

    if (Array.isArray(classNames)) {
      el.classList.add(...classNames)
    } else if (classNames) {
      el.classList.add(classNames)
    }

    for (const attrName in attributes) {
      el[attrName] = attributes[attrName]
    }

    return el
  }
}
