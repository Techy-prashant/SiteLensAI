package com.example.kaya.data.repo

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "settings")

class SettingsRepository(private val context: Context) {

    companion object {
        val SERVER_ADDRESS = stringPreferencesKey("server_address")
        val USERNAME = stringPreferencesKey("username")
        val LAST_SITE_NAME = stringPreferencesKey("last_site_name")
    }

    val serverAddress: Flow<String?> = context.dataStore.data
        .map { preferences ->
            preferences[SERVER_ADDRESS]
        }

    val username: Flow<String?> = context.dataStore.data
        .map { preferences ->
            preferences[USERNAME]
        }

    val lastSiteName: Flow<String?> = context.dataStore.data
        .map { preferences ->
            preferences[LAST_SITE_NAME]
        }

    suspend fun saveServerAddress(address: String) {
        context.dataStore.edit { preferences ->
            preferences[SERVER_ADDRESS] = address
        }
    }

    suspend fun saveUsername(name: String) {
        context.dataStore.edit { preferences ->
            preferences[USERNAME] = name
        }
    }

    suspend fun saveLastSiteName(siteName: String) {
        context.dataStore.edit { preferences ->
            preferences[LAST_SITE_NAME] = siteName
        }
    }
}
