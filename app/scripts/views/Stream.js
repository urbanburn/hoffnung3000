import fetch from 'isomorphic-fetch'
import PropTypes from 'prop-types'
import React, { Component } from 'react'

import { PreloadImage } from '../components'
import { translate } from '../../../common/services/i18n'
import { withFlash, withConfig } from '../containers'

const REFRESH_INTERVAL = 60000

function fetchStream(marker, streamServerUrl) {
  const markerStr = marker ? `?marker=${marker}` : ''

  return new Promise((resolve, reject) => {
    fetch(`${streamServerUrl}/api/stream${markerStr}`)
      .then(response => {
        if (response.status === 200) {
          response.json().then(json => resolve(json))
        } else {
          reject()
        }
      })
      .catch(error => reject(error))
  })
}

class Stream extends Component {
  static propTypes = {
    config: PropTypes.object.isRequired,
    flash: PropTypes.func.isRequired,
  }

  componentDidMount() {
    this.next()

    this._interval = setInterval(() => {
      if (!this.state.isRefreshingAutomatically) {
        this.next(true)
      }
    }, REFRESH_INTERVAL)
  }

  componentWillUnmount() {
    clearInterval(this._interval)
  }

  onClick() {
    this.next()
  }

  onUpdateClick() {
    this.next(true)
  }

  renderSpinner() {
    if (!this.state.isLoading) {
      return null
    }

    return (
      <div className="gif-stream__spinner">
        { translate('common.loading') }
      </div>
    )
  }

  renderImages() {
    return this.state.images.map((image, index) => {
      return (
        <PreloadImage
          className="gif-stream__image"
          key={index}
          src={image.url}
        />
      )
    })
  }

  renderButtons() {
    if (this.state.isLoading && this.state.images.length === 0) {
      return null
    }

    return (
      <div className="gif-stream__buttons">
        <button
          className="button"
          disabled={!this.state.nextMarker || this.state.isLoading}
          onClick={this.onClick}
        >
          { translate('views.stream.loadOlderImagesButton') }
        </button>

        <button
          className="button button--blue"
          disabled={this.state.isLoading}
          onClick={this.onUpdateClick}
        >
          { translate('views.stream.updateButton') }
        </button>
      </div>
    )
  }

  render() {
    return (
      <div className="gif-stream">
        <div className="gif-stream__container">
          { this.renderImages() }
        </div>

        { this.renderButtons() }
        { this.renderSpinner() }
      </div>
    )
  }

  next(ignoreMarker = false) {
    if (ignoreMarker) {
      this.setState({
        images: [],
        isLoading: true,
        isRefreshingAutomatically: false,
      })
    } else {
      this.setState({
        isLoading: true,
        isRefreshingAutomatically: this.state.nextMarker !== undefined,
      })
    }

    const marker = ignoreMarker ? null : this.state.nextMarker

    fetchStream(marker, this.props.config.gifStreamServerUrl)
      .then(stream => {
        this.setState({
          images: this.state.images.concat(stream.data),
          isLoading: false,
          nextMarker: stream.nextMarker,
        })
      })
      .catch(() => {
        this.props.flash({
          text: translate('views.stream.error'),
          type: 'error',
        })
      })
  }

  constructor(props) {
    super(props)

    this.state = {
      images: [],
      isLoading: false,
      isRefreshingAutomatically: false,
      nextMarker: undefined,
    }

    this._interval = null

    this.onClick = this.onClick.bind(this)
    this.onUpdateClick = this.onUpdateClick.bind(this)
  }
}

export default withFlash(withConfig('gifStreamServerUrl', true, Stream))
