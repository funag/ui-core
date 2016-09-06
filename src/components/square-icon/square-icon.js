/**
 * Created by imamudin.naseem on 29/08/16.
 */

'use strict'
import {h} from '@cycle/dom'
import css from './square-icon.style'

export default (icon) =>
  h(`div.${css.squareIcon}.${icon}`, [
    h('i.material-icons', [icon])
  ])