package be.floca.beping;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;
import com.getcapacitor.community.fcm.FCMPlugin;
import com.getcapacitor.community.firebaseanalytics.FirebaseAnalytics;
import com.getcapacitor.community.firebasecrashlytics.FirebaseCrashlyticsPlugin;
import com.servicesight.capacitor.startnavigation.StartNavigationPlugin;

import java.util.ArrayList;

import de.einfachhans.emailcomposer.EmailComposerPlugin;
import dev.robingenz.capacitor.androiddarkmodesupport.AndroidDarkModeSupportPlugin;
import com.getcapacitor.community.firebaserc.FirebaseRemoteConfig;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Initializes the Bridge
        this.registerPlugins(
                new ArrayList<Class<? extends Plugin>>() {
                    {
                        add(FirebaseCrashlyticsPlugin.class);
                        add(EmailComposerPlugin.class);
                        add(StartNavigationPlugin.class);
                        add(AndroidDarkModeSupportPlugin.class);
                        add(FirebaseAnalytics.class);
                        add(FirebaseRemoteConfig.class);
                        add(FCMPlugin.class);
                    }
                }
        );
    }
}
