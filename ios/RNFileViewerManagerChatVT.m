
#import "RNFileViewerManagerChatVT.h"
#import <QuickLook/QuickLook.h>
#import <React/RCTConvert.h>

#define OPEN_EVENT @"RNFileViewerDidOpen"
#define DISMISS_EVENT @"RNFileViewerDidDismiss"

@interface FileChatVT: NSObject<QLPreviewItem>

@property(readonly, nullable, nonatomic) NSURL *previewItemURL;
@property(readonly, nullable, nonatomic) NSString *previewItemTitle;

- (id)initWithPath:(NSString *)file title:(NSString *)title;

@end

@interface RNFileViewerChatVT ()<QLPreviewControllerDelegate>
@end

@implementation FileChatVT

- (id)initWithPath:(NSString *)file title:(NSString *)title {
    if(self = [super init]) {
        _previewItemURL = [NSURL fileURLWithPath:file];
        _previewItemTitle = title;
    }
    return self;
}

@end

@interface CustomQLViewControllerChatVT: QLPreviewController<QLPreviewControllerDataSource>

@property(nonatomic, strong) FileChatVT *file;
@property(nonatomic, strong) NSNumber *invocation;

@end

@implementation CustomQLViewControllerChatVT

- (instancetype)initWithFile:(FileChatVT *)file identifier:(NSNumber *)invocation {
    if(self = [super init]) {
        _file = file;
        _invocation = invocation;
        self.dataSource = self;
    }
    return self;
}

- (BOOL)prefersStatusBarHidden {
    return UIApplication.sharedApplication.isStatusBarHidden;
}

- (NSInteger)numberOfPreviewItemsInPreviewController:(QLPreviewController *)controller{
    return 1;
}

- (id <QLPreviewItem>)previewController:(QLPreviewController *)controller previewItemAtIndex:(NSInteger)index{
    return self.file;
}

@end

@implementation RNFileViewerChatVT

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

+ (UIViewController*)topViewController {
    UIViewController *presenterViewController = [self topViewControllerWithRootViewController:UIApplication.sharedApplication.keyWindow.rootViewController];
    return presenterViewController ? presenterViewController : UIApplication.sharedApplication.keyWindow.rootViewController;
}

+ (UIViewController*)topViewControllerWithRootViewController:(UIViewController*)viewController {
    if ([viewController isKindOfClass:[UITabBarController class]]) {
        UITabBarController* tabBarController = (UITabBarController*)viewController;
        return [self topViewControllerWithRootViewController:tabBarController.selectedViewController];
    }
    if ([viewController isKindOfClass:[UINavigationController class]]) {
        UINavigationController* navContObj = (UINavigationController*)viewController;
        return [self topViewControllerWithRootViewController:navContObj.visibleViewController];
    }
    if (viewController.presentedViewController && !viewController.presentedViewController.isBeingDismissed) {
        UIViewController* presentedViewController = viewController.presentedViewController;
        return [self topViewControllerWithRootViewController:presentedViewController];
    }
    for (UIView *view in [viewController.view subviews]) {
        id subViewController = [view nextResponder];
        if ( subViewController && [subViewController isKindOfClass:[UIViewController class]]) {
            if ([(UIViewController *)subViewController presentedViewController]  && ![subViewController presentedViewController].isBeingDismissed) {
                return [self topViewControllerWithRootViewController:[(UIViewController *)subViewController presentedViewController]];
            }
        }
    }
    return viewController;
}

- (void)previewControllerDidDismiss:(CustomQLViewControllerChatVT *)controller {
    [self sendEventWithName:DISMISS_EVENT body: @{@"id": controller.invocation}];
}

RCT_EXPORT_MODULE()

- (NSArray<NSString *> *)supportedEvents {
    return @[OPEN_EVENT, DISMISS_EVENT];
}

RCT_EXPORT_METHOD(open:(NSString *)path invocation:(nonnull NSNumber *)invocationId
    options:(NSDictionary *)options)
{
    NSString *displayName = [RCTConvert NSString:options[@"displayName"]];
    FileChatVT *file = [[FileChatVT alloc] initWithPath:path title:displayName];

    QLPreviewController *controller = [[CustomQLViewControllerChatVT alloc] initWithFile:file identifier:invocationId];
    controller.delegate = self;

    typeof(self) __weak weakSelf = self;
    [[RNFileViewerChatVT topViewController] presentViewController:controller animated:YES completion:^{
        [weakSelf sendEventWithName:OPEN_EVENT body: @{@"id": invocationId}];
    }];
}

@end
