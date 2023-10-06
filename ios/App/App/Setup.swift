//
//  SEtup.swift
//  App
//
//  Created by Jae Won Jang on 2023/04/01.
//


import Foundation
import Capacitor
import FBSDKCoreKit


@objc(SetupPlugin)
public class SetupPlugin: CAPPlugin {
    override public func load() {
        // enable swipe to back / forward
        bridge?.webView?.allowsBackForwardNavigationGestures = true;
        bridge?.statusBarStyle = .darkContent;
        
        AppEvents.shared.augmentHybridWebView(bridge!.webView!);
    }
    
}
