//
//  ContextMenuAction.h
//  reactnativeuimenu
//
//  Created by Matthew Iannucci on 10/6/19.
//  Copyright © 2019 Matthew Iannucci. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface ContextMenuActionChatVT : NSObject

@property (nonnull, nonatomic, copy) NSString* title;
@property (nonnull, nonatomic, copy) NSString* subtitle;
@property (nullable, nonatomic, copy) NSString* systemIcon;
@property (nonatomic, assign) BOOL destructive;
@property (nonatomic, assign) BOOL disabled;
@property (nonatomic, assign) BOOL inlineChildren;
@property (nullable, nonatomic, copy) NSArray<ContextMenuActionChatVT*>* actions;

@end
