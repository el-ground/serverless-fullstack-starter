package com.serverless_fullstack_starter.app;

import android.webkit.JavascriptInterface;
import com.getcapacitor.Bridge;
import android.content.res.Resources;
import android.graphics.Insets;
import android.os.Build;
import android.view.DisplayCutout;
import android.view.WindowInsets;

public class DefaultInterface {
    Bridge mBridge;
    DefaultInterface(Bridge b) {
        mBridge = b;
    }

    @JavascriptInterface
    public String getSafeAreaInsets() {
        // https://github.com/Aashu-Dubey/capacitor-statusbar-safe-area/blob/main/android/src/main/java/dev/ashu/capacitor/statusbar/safearea/SafeAreaPlugin.java
        var activity = mBridge.getActivity();

        float leftInset = 0, rightInset = 0, topInset = 0, bottomInset = 0;
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
            Resources res = activity.getApplicationContext().getResources();
            WindowInsets windowInsets = activity.getWindow().getDecorView().getRootWindowInsets();

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                if (windowInsets != null) {
                    final DisplayCutout cutout = windowInsets.getDisplayCutout();

                    leftInset = cutout != null ? cutout.getSafeInsetLeft() : 0;
                    rightInset = cutout != null ? cutout.getSafeInsetRight() : 0;
                    topInset = cutout != null ? cutout.getSafeInsetTop() : 0;
                    bottomInset = cutout != null ? cutout.getSafeInsetBottom() : 0;

                    Insets insets = windowInsets.getSystemWindowInsets();
                    leftInset = Math.max(leftInset, insets.left) / res.getDisplayMetrics().density;
                    rightInset = Math.max(rightInset, insets.right) / res.getDisplayMetrics().density;
                    topInset = Math.max(topInset, insets.top) / res.getDisplayMetrics().density;
                    bottomInset = Math.max(bottomInset, insets.bottom) / res.getDisplayMetrics().density;
                }
            }
        }

        /*
            Below android 13, (12 and below),
            Making navigation bar transparent doesn't work.
            So we set bottomInset to zero.
        */
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU) {
            bottomInset = 0;
        }

        return String.format("{\"top\":%f,\"right\":%f,\"bottom\":%f,\"left\":%f}", topInset, rightInset, bottomInset, leftInset);
    }
}
