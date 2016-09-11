/**
 * Created by tushar.mathur on 09/09/16.
 */

'use strict'

import h from 'snabbdom/h'
import R from 'ramda'
import {Request} from '../http/http.events'
import {toURI, trackStreamURL} from '../../lib/SoundCloud'
import {FunagInputValue} from '../input/input.events'
import {TrackChanged} from '../track-list/track-list.events'
import {
  MediaPlaying,
  MediaStopped
} from '../mini-audio-control/mini-audio-control.events'

export default {
  init () {
    return {
      tracks: [],
      selected: null,
      playing: false,
      search: ''
    }
  },

  update (state, {type, params}) {
    switch (type) {
      case '@@rwc/attached':
        return [state, Request.of(toURI('/tracks', {q: state.search}))]
      case `SEARCH`:
        return [
          R.merge(state, {search: params.detail, tracks: []}),
          Request.of(toURI('/tracks', {q: params.detail}))
        ]
      case 'TRACK_CHANGE':
        return R.assoc('selected', params.detail, state)
      case 'TRACKS':
        return R.merge(state, {
          tracks: params.response,
          selected: state.selected ? state.selected : params.response[0]
        })
      case 'MEDIA_PLAYING':
        return R.assoc('playing', true, state)
      case 'MEDIA_STOPPED':
        return R.assoc('playing', false, state)
      default:
        return state
    }
  },

  view ({tracks, selected, playing}, dispatch) {
    return h(`div.container`, [
      h(`fg-http`, {
        props: {debounce: 300},
        on: {'http-response': dispatch('TRACKS')}
      }),
      h('fg-app-bar', [
        h(`div.search-box-container`, [
          h('fg-input', {
            on: {[FunagInputValue.type]: dispatch('SEARCH')},
            attrs: {placeholder: 'Search', icon: 'search'}
          })
        ])
      ]),
      h('fg-track-list', {
        props: {tracks, playing, selected},
        on: {[TrackChanged]: dispatch('TRACK_CHANGE')}
      }),
      selected ? h(`div.control-container`, [
        h(`fg-mini-audio-control`,
          {
            attrs: {src: trackStreamURL(selected)},
            on: {
              [MediaPlaying]: dispatch('MEDIA_PLAYING'),
              [MediaStopped]: dispatch('MEDIA_STOPPED')
            }
          }, [
            h(`div.control-track-detail`, [
              h(`div.track-title.text-overflow`, [selected.title]),
              h(`div.artist.text-overflow`, [selected.user.username])
            ])
          ])
      ]) : ''
    ])
  }
}
