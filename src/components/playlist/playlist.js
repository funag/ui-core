/**
 * Created by tushar.mathur on 24/04/16.
 */
// TODO: Rename to TrackList
'use strict'
import {div} from '@cycle/dom'
import R from 'ramda'
import {Observable} from 'rx'
import {mux} from 'muxer'
import PlayListItem from '../PlayListItem'
import * as SC from '../../lib/SoundCloud'
import * as P from '../placeholders/placeholders'
import {getStatus$} from '../../lib/OverlayStatus'
import css from './playlist.style'
export const Audio = ({url$}) => url$.scan((last, src) => {
  const canPlay = R.anyPass([
    ({last}) => !last,
    ({last}) => last.type === 'PAUSE',
    ({last, src}) => last.src !== src
  ])
  if (canPlay({last, src})) return {src, type: 'PLAY'}
  return {src, type: 'PAUSE'}
}, null)

const view = ({playlistItem$}) => {
  return playlistItem$
    .map(tracks => tracks.map(x => x.DOM))
    .flatMapLatest(tracks => Observable.combineLatest(tracks))
    .startWith([
      div([
        P.PlaylistItem,
        P.PlaylistItem,
        P.PlaylistItem
      ])
    ])
    .map(view =>
      <div className={css.playlist}>
        {view}
      </div>
    )
}

const model = ({tracks$, DOM, audio$, selectedTrack$}) => {
  const selectedTrackId$ = selectedTrack$.pluck('id')
  const playlistItem$ = getStatus$({selectedTrackId$, audio$, tracks$})
    .map(R.map(R.compose(PlayListItem, R.merge({DOM}))))

  const click$ = playlistItem$
    .map(tracks => tracks.map(x => x.click$))
    .flatMapLatest(clicks => Observable.merge(clicks))
    .shareReplay(1)

  const url$ = click$.map(SC.trackStreamURL)

  const audioAction$ = Audio({url$})
  const ofType = R.compose(R.whereEq, R.objOf('type'))
  const play = audioAction$.filter(ofType('PLAY'))
  const pause = audioAction$.filter(ofType('PAUSE'))
  return {
    selectedTrack$: click$,
    audio$: mux({play, pause}),
    playlistItem$
  }
}

export default sources => {
  const {playlistItem$, audio$, selectedTrack$} = model(sources)
  const vTree$ = view({playlistItem$})
  return {
    DOM: vTree$, audio$, selectedTrack$
  }
}