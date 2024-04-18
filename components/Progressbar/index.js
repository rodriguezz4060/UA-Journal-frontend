import React from 'react'
import NProgress from 'nprogress'
import Router from 'next/router'
import PropTypes from 'prop-types'

/* eslint-disable react/prefer-stateless-function */
class NextNProgress extends React.Component {
  static defaultProps = {
    color: '#29D',
    startPosition: 0.3,
    stopDelayMs: 200,
    height: 1,
  }

  timer = null

  routeChangeStart = () => {
    NProgress.set(this.props.startPosition)
    NProgress.start()
  }

  routeChangeEnd = () => {
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      NProgress.done(true)
    }, this.props.stopDelayMs)
  }

  render() {
    const { color, height } = this.props

    return (
      <style jsx global>{`
        #nprogress {
          pointer-events: none;
        }
        #nprogress .bar {
          background: ${color};
          margin-top: 55px;
          position: fixed;
          z-index: 1031;
          top: 0;
          left: 0;
          width: 100%;
          height: ${height}px;
        }
        #nprogress .peg {
          display: block;
          position: absolute;
          right: 0px;
          width: 100px;
          height: 100%;

          opacity: 1;
        }
      `}</style>
    )
  }

  componentDidMount() {
    const { options } = this.props

    if (options) {
      NProgress.configure(options)
    }

    Router.events.on('routeChangeStart', this.routeChangeStart)
    Router.events.on('routeChangeComplete', this.routeChangeEnd)
    Router.events.on('routeChangeError', this.routeChangeEnd)
  }
}

NextNProgress.propTypes = {
  color: PropTypes.string,
  startPosition: PropTypes.number,
  stopDelayMs: PropTypes.number,
  options: PropTypes.object,
}

export default NextNProgress
