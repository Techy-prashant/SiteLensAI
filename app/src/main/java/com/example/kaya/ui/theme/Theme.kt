package com.example.kaya.ui.theme

import android.app.Activity
import android.os.Build
import androidx.compose.ui.graphics.Color
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.dynamicDarkColorScheme
import androidx.compose.material3.dynamicLightColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.platform.LocalContext

private val SiteLensColorScheme = darkColorScheme(
    primary = SafetyYellow,
    onPrimary = Black,
    secondary = SafetyOrange,
    onSecondary = Black,
    tertiary = SafeGreen,
    background = Black,
    surface = DarkGray,
    onBackground = HighContrastWhite,
    onSurface = HighContrastWhite,
    error = AlertRed,
    onError = HighContrastWhite
)

@Composable
fun SiteLensTheme(
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = SiteLensColorScheme,
        typography = Typography,
        content = content
    )
}

@Composable
fun KayaTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    // Dynamic color is available on Android 12+
    dynamicColor: Boolean = true,
    content: @Composable () -> Unit
) {
    val colorScheme = when {
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            val context = LocalContext.current
            if (darkTheme) dynamicDarkColorScheme(context) else dynamicLightColorScheme(context)
        }

        darkTheme -> darkColorScheme(
            primary = Color(0xFFD0BCFF),
            secondary = Color(0xFFCCC2DC),
            tertiary = Color(0xFFEFB8C8)
        )
        else -> lightColorScheme(
            primary = Color(0xFF6650a4),
            secondary = Color(0xFF625b71),
            tertiary = Color(0xFF7D5260)
        )
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}