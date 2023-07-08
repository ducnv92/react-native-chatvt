import React, { forwardRef, useCallback, useMemo, useRef, useState } from 'react';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import chatStore from './ChatStore';
import CameraRollPicker from '../../components/cameraRollPicker';
import { observer } from 'mobx-react-lite';
import { Log } from '../../utils';
import { View } from 'react-native';


const CameraRoll =observer(function CameraRoll ( props) {

  return(
    <CameraRollPicker
      assetType={'All'}
      include={['playableDuration']}
      selected={chatStore.images}
      callback={(images) => {
        console.log('image picked', images)
        chatStore.images = images
      }} />
  )
})



export const AttachScreen =forwardRef(function AttachScreen(props, ref) {
  const snapPoints = useMemo(() => ['50%', '80%'], []);
  const [tab, setTab] = useState(1);

  return(<>
    <BottomSheetModal
      ref={ref}
      index={0}
      bottomInset={0}
      snapPoints={snapPoints}
      // onChange={handleSheetChanges}
      onDismiss={() => {
        chatStore.images = []
      }}
    >
      {
        chatStore.tab === 0 && <CameraRoll/>
      }
    </BottomSheetModal>
  </>)
})
