package com.serverless_fullstack_starter.app;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    // https://capacitorjs.com/docs/android/custom-code
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(Setup.class);

        // load called inside onCreate, after registering themes.
        super.onCreate(savedInstanceState);
    }
}
