package com.chatvt;

import androidx.annotation.NonNull;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class ChatvtPackage implements ReactPackage {
  @NonNull
  @Override
  public List<NativeModule> createNativeModules(@NonNull ReactApplicationContext reactContext) {
    List<NativeModule> modules = new ArrayList<>();
    modules.add(new ContextMenuManager());
    modules.add(new CreateThumbnailModule(reactContext));
    modules.add(new DocumentPickerModule(reactContext));
    modules.add(new MvcpScrollViewManagerModule(reactContext));
    modules.add(new CameraRollModule(reactContext));
    modules.add(new ChatvtModule(reactContext));
    modules.add(new RNAudioRecorderPlayerModule(reactContext));
    return modules;
  }

  @NonNull
  @Override
  public List<ViewManager> createViewManagers(@NonNull ReactApplicationContext reactContext) {
    return Collections.emptyList();
  }
}
