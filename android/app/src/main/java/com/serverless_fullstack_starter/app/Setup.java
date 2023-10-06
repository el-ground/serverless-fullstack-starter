package com.serverless_fullstack_starter.app;

// import com.facebook.appevents.AppEventsLogger;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import android.graphics.Color;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsControllerCompat;

@CapacitorPlugin(name = "Setup")
public class Setup extends Plugin {

    @Override
    public void load() {
        // https://developers.facebook.com/docs/app-events/hybrid-app-events
        // IMPLEMENT_IF_FACEBOOK
        // AppEventsLogger.augmentWebView(this.bridge.getWebView(), this.getContext());

        // add javascript interface
        this.bridge.getWebView().addJavascriptInterface( new DefaultInterface(this.bridge), "Android");

        // enable zoom
        this.bridge.getWebView().getSettings().setBuiltInZoomControls(true);
        // disables zoom in/zoom out buttons in the webview, to only allow pinch to zoom
        this.bridge.getWebView().getSettings().setDisplayZoomControls(false);


        this.setStatusBarAndNavBar();
    }

    private void setStatusBarAndNavBar() {
        var activity = this.bridge.getActivity();
        Window window = activity.getWindow();
        View decorView = window.getDecorView();
        WindowInsetsControllerCompat windowInsetsControllerCompat = WindowCompat.getInsetsController(window, decorView);

        // 1. statusBar content color dark (light mode)
        windowInsetsControllerCompat.setAppearanceLightStatusBars(true);
        // 2. navBar content color dark (light mode)
        windowInsetsControllerCompat.setAppearanceLightNavigationBars(true);
        // 3. statusBar background color transparent
        window.setStatusBarColor(Color.TRANSPARENT);
        // 4. navBar background color transparent
        window.setNavigationBarColor(Color.TRANSPARENT);

        // 5. set render behind statusBar / navBar
        window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
        window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
        int uiOptions = decorView.getSystemUiVisibility();
        uiOptions = uiOptions | View.SYSTEM_UI_FLAG_LAYOUT_STABLE | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN;
        decorView.setSystemUiVisibility(uiOptions);
    }


    @PluginMethod()
    public void easyCall(PluginCall call) {

        String method = call.getString("method");
        switch (method) {
            case "setStatusBarColor" :
                this.getBridge()
                        .executeOnMainThread(
                                () -> {
                                    this.setStatusBarAndNavBar();
                                }
                        );

                break;
        }
    }
}