
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@class UIViewController;

@interface RNFileViewerChatVT : RCTEventEmitter <RCTBridgeModule>

+ (UIViewController*)topViewController;
+ (UIViewController*)topViewControllerWithRootViewController:(UIViewController*)viewController;

@end
