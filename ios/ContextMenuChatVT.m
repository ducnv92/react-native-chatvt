#import "ContextMenuChatVT.h"
#import "ContextMenuViewChatVT.h"

@implementation ContextMenu

RCT_EXPORT_MODULE()

- (UIView *) view {
    ContextMenuViewChatVT *contextMenuView = [[ContextMenuViewChatVT alloc] init];
    return contextMenuView;
}

RCT_EXPORT_VIEW_PROPERTY(title, NSString)
RCT_EXPORT_VIEW_PROPERTY(onPress, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onCancel, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(actions, NSArray<ContextMenuAction>)
RCT_EXPORT_VIEW_PROPERTY(disabled, BOOL)
RCT_CUSTOM_VIEW_PROPERTY(previewBackgroundColor, UIColor, ContextMenuViewChatVT) {
  view.previewBackgroundColor = json != nil ? [RCTConvert UIColor:json] : nil;
}
RCT_CUSTOM_VIEW_PROPERTY(dropdownMenuMode, BOOL, ContextMenuViewChatVT) {
    if (@available(iOS 14.0, *)) {
        view.showsMenuAsPrimaryAction = json != nil ? [RCTConvert BOOL:json] : view.showsMenuAsPrimaryAction;
    } else {
        // This is not available on other versions... sorry!
    }
}

@end
