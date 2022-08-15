package be.floca.beping;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;
import com.getcapacitor.community.fcm.FCMPlugin;
import com.servicesight.capacitor.startnavigation.StartNavigationPlugin;

import java.util.ArrayList;

import de.einfachhans.emailcomposer.EmailComposerPlugin;
import com.getcapacitor.community.firebaserc.FirebaseRemoteConfig;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Initializes the Bridge
        this.registerPlugins(
                new ArrayList<Class<? extends Plugin>>() {
                    {
                        add(EmailComposerPlugin.class);
                        add(StartNavigationPlugin.class);
                        add(FirebaseRemoteConfig.class);
                        add(FCMPlugin.class);
                    }
                }
        );
    }
}
