package com.example.kaya.camera

import android.graphics.Bitmap
import android.util.Base64
import androidx.camera.core.ImageProxy
import java.io.ByteArrayOutputStream

object ImageUtils {

    /**
     * Converts a CameraX [ImageProxy] to a compressed JPEG Base64 string.
     * Handles resizing to a max dimension and quality compression.
     *
     * @param image The image proxy from CameraX.
     * @param quality Compression quality (0-100).
     * @param maxDimension The maximum width or height of the output image.
     * @return Base64 encoded string or null if conversion fails.
     */
    fun imageProxyToBase64(image: ImageProxy, quality: Int = 75, maxDimension: Int = 1280): String? {
        return try {
            // toBitmap() converts YUV_420_888 to Bitmap and respects rotation
            val bitmap = image.toBitmap()
            
            val scaledBitmap = scaleBitmap(bitmap, maxDimension)
            
            val outputStream = ByteArrayOutputStream()
            scaledBitmap.compress(Bitmap.CompressFormat.JPEG, quality, outputStream)
            val byteArray = outputStream.toByteArray()
            
            // Cleanup bitmaps
            if (scaledBitmap != bitmap) {
                scaledBitmap.recycle()
            }
            bitmap.recycle()
            
            Base64.encodeToString(byteArray, Base64.NO_WRAP)
        } catch (e: Exception) {
            e.printStackTrace()
            null
        } finally {
            image.close()
        }
    }

    private fun scaleBitmap(bitmap: Bitmap, maxDimension: Int): Bitmap {
        val width = bitmap.width
        val height = bitmap.height
        
        if ((width <= maxDimension) && (height <= maxDimension)) {
            return bitmap
        }
        
        val ratio = width.toFloat() / height.toFloat()
        val newWidth: Int
        val newHeight: Int
        
        if (width > height) {
            newWidth = maxDimension
            newHeight = (maxDimension / ratio).toInt()
        } else {
            newHeight = maxDimension
            newWidth = (maxDimension * ratio).toInt()
        }
        
        return Bitmap.createScaledBitmap(bitmap, newWidth, newHeight, true)
    }
}
