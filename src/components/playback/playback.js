/**
 * Created by tushar.mathur on 23/04/16.
 */

'use strict'

import {Observable} from 'rx'
import {h} from '@cycle/dom'
import PlaybackInfo from '../PlaybackInfo'
import PlaybackButtons from '../PlaybackButtons'

export default ({STORE, AUDIO, DOM}) => {
  const playbackButtons = PlaybackButtons({AUDIO, STORE, DOM})
  return {
    AUDIO: playbackButtons.audio$,
    DOM: Observable
      .combineLatest(
        playbackButtons.DOM,
        PlaybackInfo({STORE}).DOM
      )
      .map(views => h(`div.flb.row.jc_s.ai_c`, views))
  }
}
