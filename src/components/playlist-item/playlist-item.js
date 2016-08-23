/**
 * Created by imamudin.naseem on 27/04/16.
 */

'use strict'

import {Observable as O} from 'rx'
import {DefaultArtwork, PausedArtwork, PlayingArtwork} from '../artwork/artwork'
import TrackDetail from '../track-details/track-details'
import isolate from '@cycle/isolate'
import {DEFAULT, PLAYING, PAUSED} from '../../lib/OverlayStatus'
import css from './playlist-item.style'
import DoubleClick from '../../lib/DoubleClick'
const view = ({icon$, trackDetail, track}) => {
  return icon$.map(icon =>
    <div key={track.id} className={css(css.playlistItem, 'playlist-item')}>
      <div className={css(css.trackInfo, 'flb row jc_sb ai_c')}>
        {icon}
        {trackDetail}
      </div>
    </div>
  )
}

const model = ({track: {artwork_url}, status}) => {
  const OverlayMap = {
    [DEFAULT]: DefaultArtwork(artwork_url),
    [PAUSED]: PausedArtwork,
    [PLAYING]: PlayingArtwork
  }

  const icon$ = O.just(OverlayMap[status])
  return {icon$}
}

const intent = ({DOM, track}) => {
  const click$ = DoubleClick(DOM.select('.playlist-item')).map(track)
  return {click$}
}

const PlayListItem = ({DOM, ROW: {track, status}}) => {
  const {icon$} = model({track, status})
  const trackDetail = TrackDetail(track)
  const vTree$ = view({icon$, trackDetail, track})
  const {click$} = intent({DOM, track})
  return {click$, DOM: vTree$}
}

// TODO: Rename file PlayListItem => Track
export default sources => isolate(PlayListItem)(sources)
