package com.booknuri_front

import android.app.Activity
import android.content.Intent
import android.graphics.Bitmap
import android.net.Uri
import android.provider.MediaStore
import androidx.core.content.FileProvider
import com.facebook.react.bridge.*
import java.io.File
import java.io.FileOutputStream

class MyIntentModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext), ActivityEventListener {

    private var imagePickerPromise: Promise? = null
    private var tempImageFile: File? = null

    override fun getName(): String = "MyIntentModule"

    init {
        reactContext.addActivityEventListener(this)
    }

    @ReactMethod
    fun openChooser(promise: Promise) {
        val activity = currentActivity ?: return promise.reject("NO_ACTIVITY", "Activity is null")
        imagePickerPromise = promise

        // 카메라용 파일 URI 준비
        tempImageFile = File.createTempFile("camera_", ".jpg", reactContext.cacheDir)
        val cameraUri: Uri = FileProvider.getUriForFile(
            reactContext,
            "${reactContext.packageName}.fileprovider",
            tempImageFile!!
        )

        val intentCamera = Intent(MediaStore.ACTION_IMAGE_CAPTURE).apply {
            putExtra(MediaStore.EXTRA_OUTPUT, cameraUri)
            addFlags(Intent.FLAG_GRANT_WRITE_URI_PERMISSION)
        }

        val intentGallery = Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI)
        val chooser = Intent.createChooser(intentGallery, "이미지를 선택하세요").apply {
            putExtra(Intent.EXTRA_INITIAL_INTENTS, arrayOf(intentCamera))
        }

        activity.startActivityForResult(chooser, 4321)
    }

    override fun onActivityResult(activity: Activity?, requestCode: Int, resultCode: Int, data: Intent?) {
        if (requestCode == 4321 && resultCode == Activity.RESULT_OK) {
            val uri: Uri? = data?.data
            if (uri != null) {
                imagePickerPromise?.resolve(uri.toString())
            } else if (tempImageFile?.exists() == true) {
                val fileUri = FileProvider.getUriForFile(
                    reactContext,
                    "${reactContext.packageName}.fileprovider",
                    tempImageFile!!
                )
                imagePickerPromise?.resolve(fileUri.toString())
            } else {
                imagePickerPromise?.reject("NO_URI", "이미지 경로를 가져오지 못했어요.")
            }
            imagePickerPromise = null
        }
    }

    override fun onNewIntent(intent: Intent?) {}
}
