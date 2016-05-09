/**
 * Created by imamudin.naseem on 03/05/16.
 */

'use strict'

import {ul, li, div} from '@cycle/dom'
import * as S from '../utils/StyleUtils'
import * as T from '../utils/Themes'

const style = {
  ...S.absolute(),
  ...S.block(T.BlockHeight - T.BlockSpace),
  backgroundColor: 'rgba(255, 255, 255, 0.8)'
}
const overlay = (isAnimated = '') =>
  div({className: 'fade-in', style}, [
    ul('.playing-animation' + isAnimated, {style: {...S.size(17)}}, [
      li(), li(), li()
    ])
  ])

export const AnimatedOverlay = overlay()
export const PausedOverlay = overlay('.pause-animation')