package com.example.kaya.ui

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.example.kaya.ui.screens.*

sealed class Screen(val route: String) {
    object Splash : Screen("splash")
    object Login : Screen("login")
    object ServerConnection : Screen("server_connection")
    object SiteEntry : Screen("site_entry")
    object CameraConnect : Screen("camera_connect")
    object LiveMonitoring : Screen("live_monitoring")
}

@Composable
fun SiteLensNavHost(
    viewModel: MainViewModel,
    navController: NavHostController = rememberNavController()
) {
    NavHost(
        navController = navController,
        startDestination = Screen.Splash.route
    ) {
        composable(Screen.Splash.route) {
            SplashScreen(onTimeout = {
                navController.navigate(Screen.Login.route) {
                    popUpTo(Screen.Splash.route) { inclusive = true }
                }
            })
        }
        
        composable(Screen.Login.route) {
            LoginScreen(
                viewModel = viewModel,
                onLoginSuccess = {
                    navController.navigate(Screen.ServerConnection.route)
                }
            )
        }
        
        composable(Screen.ServerConnection.route) {
            ServerConnectionScreen(
                viewModel = viewModel,
                onSuccess = {
                    navController.navigate(Screen.SiteEntry.route)
                }
            )
        }
        
        composable(Screen.SiteEntry.route) {
            SiteEntryScreen(
                viewModel = viewModel,
                onSuccess = {
                    navController.navigate(Screen.CameraConnect.route)
                }
            )
        }
        
        composable(Screen.CameraConnect.route) {
            CameraConnectScreen(
                onCameraReady = {
                    navController.navigate(Screen.LiveMonitoring.route)
                }
            )
        }
        
        composable(Screen.LiveMonitoring.route) {
            LiveMonitoringScreen(
                viewModel = viewModel,
                onStop = {
                    navController.popBackStack(Screen.SiteEntry.route, inclusive = false)
                }
            )
        }
    }
}
