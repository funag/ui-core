/**
 * Created by tushar.mathur on 24/04/16.
 */

'use strict'

import Cycle from '@cycle/rx-run'
import {makeDOMDriver} from '@cycle/dom'
import {makeHTTPDriver} from '@cycle/http'
import manifestFile from 'file!./manifest.json'
import sw from 'serviceworker!./sw.js'
import './less/main.less'
import Main from './components/Main'
import {audioDriver} from './drivers/audio'
import {eventSinkDriver} from './drivers/eventSink'
import {documentTitleDriver} from './drivers/documentTitle'

const manifest = document.createElement('link')
manifest.href = manifestFile
manifest.rel = 'manifest'
document.head.appendChild(manifest)

sw({scope: '/'})

Cycle.run(Main, {
  DOM: makeDOMDriver('#container'),
  AUDIO: audioDriver,
  EVENTS: eventSinkDriver,
  title: documentTitleDriver,
  HTTP: makeHTTPDriver()
})
