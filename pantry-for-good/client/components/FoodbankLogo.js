import React from 'react'
import {connect} from 'react-redux'

import selectors from '../store/selectors'

const mapStateToProps = state => ({
  settings: selectors.settings.getSettings(state),
  media: selectors.media.getMedia(state)
})

const FoodbankLogo = ({settings, media}) =>
  <img
    alt={settings && settings.organization}
    src={`/${media && media.path + media.logo}`}
  />

export default connect(mapStateToProps)(FoodbankLogo)
