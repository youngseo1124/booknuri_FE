package com.booknuri;

import android.content.ContentValues;
import android.content.Context;
import android.net.Uri;
import android.provider.MediaStore;
import android.util.Log;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.File;
import java.io.FileInputStream;
import java.io.OutputStream;

public class MediaStoreModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    public MediaStoreModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "MediaStoreModule";
    }

    @ReactMethod
    public void saveImage(String imagePath, Promise promise) {
        try {
            Context context = getReactApplicationContext();
            ContentValues values = new ContentValues();

            values.put(MediaStore.Images.Media.DISPLAY_NAME, "quote_" + System.currentTimeMillis() + ".png");
            values.put(MediaStore.Images.Media.MIME_TYPE, "image/png");
            values.put(MediaStore.Images.Media.RELATIVE_PATH, "Pictures/booknuri");

            Uri uri = context.getContentResolver().insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, values);
            if (uri == null) {
                promise.resolve(false);
                return;
            }

            FileInputStream inputStream = new FileInputStream(new File(imagePath.replace("file://", "")));
            OutputStream outputStream = context.getContentResolver().openOutputStream(uri);

            byte[] buffer = new byte[4096];
            int length;

            while ((length = inputStream.read(buffer)) > 0) {
                outputStream.write(buffer, 0, length);
            }

            inputStream.close();
            outputStream.close();

            promise.resolve(true);

        } catch (Exception e) {
            Log.e("MediaStoreModule", "Failed to save image", e);
            promise.reject("SAVE_ERROR", e);
        }
    }
}
