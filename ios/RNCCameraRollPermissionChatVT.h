//
//  CameraRollPermissionModule.h
//  RNCCameraRoll
//
//  Created by sakhi idris on 16/08/2022.
//  Copyright © 2022 Facebook. All rights reserved.
//
#import <AVFoundation/AVFoundation.h>
#ifdef RCT_NEW_ARCH_ENABLED
#import <rncameraroll/rncameraroll.h>
#else
#import <React/RCTBridge.h>
#endif
#import <React/RCTEventEmitter.h>
#import <Photos/Photos.h>
#import "RNCPermissionHelperChatVT.h"


@interface RNCCameraRollPermissionChatVT : RCTEventEmitter <RCTBridgeModule, PHPhotoLibraryChangeObserver>
@end
