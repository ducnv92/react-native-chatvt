
#ifdef RCT_NEW_ARCH_ENABLED
#import "RNChatvtSpec.h"

@interface Chatvt : NSObject <NativeChatvtSpec>
#else
#import <React/RCTBridgeModule.h>

@interface Chatvt : NSObject <RCTBridgeModule>
#endif

@end
