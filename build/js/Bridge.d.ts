
/** 
 * Describes the JSON object returned from the Bridge API apps endpoint.
 * @see {@link JSToBridgeAPI.getAppsURL()}
 */
export interface BridgeGetAppsResponse
{
    apps: BridgeInstalledAppInfo[];
}

/**
 * Describes the application info returned from Bridge APIs.
 * @see {@link JSToBridgeAPI.getAppsURL()}
 * @see {@link BridgeEventMap.appInstalled}
 * @see {@link BridgeEventMap.appChanged}
 */
export interface BridgeInstalledAppInfo
{
    packageName: string;
    label: string;
}

/** 
 * Values for the Bridge button visibility setting.
 * @see {@link JSToBridgeAPI.getBridgeButtonVisibility}
 * @see {@link JSToBridgeAPI.requestSetBridgeButtonVisibility}
 * @see {@link BridgeEventMap.bridgeButtonVisibilityChanged}
*/
export type BridgeButtonVisibility = 'shown' | 'hidden';

/** 
 * Values for the "Draw overscroll effects" Bridge setting.
 * @see {@link JSToBridgeAPI.getOverscrollEffects}
 * @see {@link JSToBridgeAPI.requestSetOverscrollEffects}
 * @see {@link BridgeEventMap.overscrollEffectsChanged}
 */
export type OverscrollEffects = 'default' | 'none';

/** 
 * Values for the Bridge theme setting.
 * @see {@link JSToBridgeAPI.getBridgeTheme}
 * @see {@link JSToBridgeAPI.requestSetBridgeTheme}
 * @see {@link BridgeEventMap.bridgeThemeChanged}
 */
export type BridgeTheme = 'system' | 'dark' | 'light';

/** 
 * Values for the status/navigation bar appearance settings.
 * @see {@link JSToBridgeAPI.getStatusBarAppearance}
 * @see {@link JSToBridgeAPI.getNavigationBarAppearance}
 * @see {@link JSToBridgeAPI.requestSetStatusBarAppearance}
 * @see {@link JSToBridgeAPI.requestSetNavigationBarAppearance}
 * @see {@link BridgeEventMap.statusBarAppearanceChanged}
 * @see {@link BridgeEventMap.navigationBarAppearanceChanged}
 */
export type SystemBarAppearance = 'hide' | 'light-fg' | 'dark-fg';

/**
 * Values for setting the system night mode. `custom` is only available from API level 30 (Android 11).
 * @see {@link JSToBridgeAPI.requestSetSystemNightMode}
 * @see [UiModeManager.setNightMode() | Android Developers](https://developer.android.com/reference/android/app/UiModeManager#setNightMode())
 * @see {@link SystemNightModeOrError} for possible return values.
*/
export type SystemNightMode = 'no' | 'yes' | 'auto' | 'custom';

/**
 * Values that can be returned when getting the system night mode. `custom` is only available from API level 30 (Android 11).
 * 
 * **NOTE:** `unknown` should never be returned, but as `-1` (`error`) is already not described by a const I've decided to err on the side of caution and include `unknown` as a possible return string. You never know with Android.
 * 
 * @see {@link SystemNightMode}
 * @see {@link JSToBridgeAPI.getSystemNightMode}
 * @see [UiModeManager.setNightMode() | Android Developers](https://developer.android.com/reference/android/app/UiModeManager#getNightMode())
 * @see {@link BridgeEventMap.systemNightModeChanged} for requestable values.
*/
export type SystemNightModeOrError = SystemNightMode | 'error' | 'unknown';

/** 
 * {@link WindowInsets} serialized to a JSON string.
 */
export type WindowInsetsJson = string;

/** 
 * Represents offsets from each edge of the screen in `dp` (equivalent to CSS `px`).
 * @see [WindowInsets | Android Developers](https://developer.android.com/reference/kotlin/androidx/compose/foundation/layout/WindowInsets)
 */
export interface WindowInsets
{
    left: number;
    top: number;
    right: number;
    bottom: number;
}

/**
 * Describes the object Bridge injects into the WebView to allow the project to use Android functionalities.  
 * Accessible via `window.Bridge` or simply `Bridge`.  
 * 
 * This interface can be implemented to mock the Bridge API for development purposes.
 * @see [BridgeMock](https://github.com/bridgelauncher/api-mock)
 * @example
 * class BridgeMock implements JSToBridgeAPI { ... }
 * if (!window.Bridge) window.Bridge = new BridgeMock();
 */
export interface JSToBridgeAPI
{
    // system

    /** Returns the current Android API level (`Build.VERSION.SDK_INT`).
     * @see [Build.VERSION.SDK_INT | Android Developers](https://developer.android.com/reference/android/os/Build.VERSION#SDK_INT)
     */
    getAndroidAPILevel(): number;

    /**
     * Returns the current Bridge Launcher version code. This increments with every release.
     */
    getBridgeVersionCode(): number;

    /**
     * Returns the current Bridge Launcher version name. Should only be used for display purposes.
     */
    getBridgeVersionName(): string;

    /** 
     * Returns the last error message reported by one of the `request...()` API functions or `null` if no error happened yet.
     */
    getLastErrorMessage(): string | null;


    // fetch

    /** 
     * The full root URL that Bridge serves the project's startup file from. Using this is not necessary in most cases, as requests can just use paths (ex.: `/images/banner.jpg`). 
     */
    getProjectURL(): string;

    /**
     * The URL to fetch a list of apps installed on the device. The response is a JSON object described by {@link BridgeGetAppsResponse}.  
     * This function is recommended over a static URL for compatability with future versions and for easily mocking the Bridge API.
     * @example 
     * fetch(Bridge.getAppsURL())
     *   .then(resp => resp.json())
     *   .then((resp: BridgeGetAppsResponse) => {
     *      // process response
     *   })
     */
    getAppsURL(): string;

    /**
     * Creates an URL to fetch the default icon for the app with the given {@link packageName}.  
     * This function is recommended over creating the URL yourself for compatability with future versions and for easily mocking the Bridge API.
     * @example 
     * img.src = Bridge.getDefaultAppIconURL(app.packageName)
     */
    getDefaultAppIconURL(packageName: string): string;


    // apps

    /**
     * Requests the app with the given package name be uninistalled. 
     * This method will show a system prompt to the user asking for confirmation.
     * @param showToastIfFailed Set to `false` to prevent a default error toast from appearing, for example when you have implemented custom error handling. Defaults to `true`.
     * @returns `true` if the request succedeed, `false` if there was an error. You can obtain the error message by calling {@link getLastErrorMessage()}.
     */
    requestAppUninstall(packageName: string, showToastIfFailed?: boolean): boolean;

    /**
     * Requests the app info settings page for the app with the given package name be opened. 
     * @param showToastIfFailed Set to `false` to prevent a default error toast from appearing, for example when you have implemented custom error handling. Defaults to `true`.
     * @returns `true` if the request succedeed, `false` if there was an error. You can obtain the error message by calling {@link getLastErrorMessage()}.
     */
    requestOpenAppInfo(packageName: string, showToastIfFailed?: boolean): boolean;

    /**
     * Requests the app with the given package name be launched. 
     * @param showToastIfFailed Set to `false` to prevent a default error toast from appearing, for example when you have implemented custom error handling. Defaults to `true`.
     * @returns `true` if the request succedeed, `false` if there was an error. You can obtain the error message by calling {@link getLastErrorMessage()}.
     */
    requestLaunchApp(packageName: string, showToastIfFailed?: boolean): boolean;


    // wallpaper
    /**
     * Calls `wallpaperManager.setWallpaperOffsetSteps()`.
     * > "For applications that use multiple virtual screens showing a wallpaper, specify the step size between virtual screens. 
     * > For example, if the launcher has 3 virtual screens, it would specify an xStep of 0.5,
     * > since the X offset for those screens are 0.0, 0.5 and 1.0"
     * @see [WallpaperManager.setWallpaperOffsetSteps() | Android Developers](https://developer.android.com/reference/android/app/WallpaperManager#setWallpaperOffsetSteps(float,%20float))
     * @example 
     * const xPages = 3;
     * const yPages = 2;
     * const p2o = (p: number) => p > 1 ? 1 / (p - 1) : 0;
     * Bridge.setWallpaperOffsetSteps(p2o(xPages), p2o(yPages));
     */
    setWallpaperOffsetSteps(x: number, y: number): void;

    /**
     * Calls `wallpaperManager.setWallpaperOffsets()`.
     * > "Set the display position of the current wallpaper within any larger space, when that wallpaper is visible behind the given window. 
     * > The X and Y offsets are floating point numbers ranging from 0 to 1, representing where the wallpaper should be positioned within the screen space. 
     * > These only make sense when the wallpaper is larger than the display."
     * @see [WallpaperManager.setWallpaperOffsets() | Android Developers](https://developer.android.com/reference/android/app/WallpaperManager#setWallpaperOffsets(android.os.IBinder,%20float,%20float))
     * @example 
     * window.addEventListener('scroll', ev => {
     *      requestAnimationFrame(() => {
     *          const xMaxScroll = window.scrollWidth - window.innerWidth;
     *          const yMaxScroll = window.scrollHeight - window.innerHeight;
     *          const xScroll = window.scrollLeft;
     *          const yScroll = window.scrollTop;
     *          Bridge.setWallpaperOffsets(xScroll / xMaxScroll, yScroll / yMaxScroll);
     *      });
     * });
     */
    setWallpaperOffsets(x: number, y: number): void;

    /**
     * Calls `wallpaperManager.sendWallpaperCommand()` with the command `COMMAND_TAP`.
     * @see [WallpaperManager.sendWallpaperCommand() | Android Developers](https://developer.android.com/reference/android/app/WallpaperManager#sendWallpaperCommand(android.os.IBinder,%20java.lang.String,%20int,%20int,%20int,%20android.os.Bundle))
     * @see [WallpaperManager.COMMAND_TAP() | Android Developers](https://developer.android.com/reference/android/app/WallpaperManager#COMMAND_TAP)
     * @example 
     * window.addEventListener('click', ev => {
     *      Bridge.sendWallpaperTap(ev.clientX, ev.clientY);
     * });
     */
    sendWallpaperTap(x: number, y: number, z?: number): void;

    /**
     * Requests the user be prompted to select a system wallpaper.
     * @param showToastIfFailed Set to `false` to prevent a default error toast from appearing, for example when you have implemented custom error handling. Defaults to `true`.
     * @returns `true` if the request succedeed, `false` if there was an error. You can obtain the error message by calling {@link getLastErrorMessage()}.
     */
    requestChangeSystemWallpaper(showToastIfFailed?: boolean): boolean;


    // bridge button

    /**
     * Gets the current state of the Bridge button visibility setting.
     */
    getBridgeButtonVisibility(): BridgeButtonVisibility;

    /**
     * Requests the Bridge button visibility setting be set to the given value.  
     * @fires {@link BridgeEventMap.bridgeButtonVisibilityChanged} after the setting is successfully set.
     * @param showToastIfFailed Set to `false` to prevent a default error toast from appearing, for example when you have implemented custom error handling. Defaults to `true`.
     * @returns `true` if the request succedeed, `false` if there was an error. You can obtain the error message by calling {@link getLastErrorMessage()}.
     */
    requestSetBridgeButtonVisibility(newVisibility: BridgeButtonVisibility, showToastIfFailed?: boolean): boolean;


    // draw system wallpaper behind webview

    /**
     * Gets the current state of the "Draw system wallpaper behind web view" Bridge setting.
     */
    getDrawSystemWallpaperBehindWebViewEnabled(): boolean;

    /**
     * Requests the "Draw system wallpaper behind web view" Bridge setting be set to the given value.
     * @fires {@link BridgeEventMap.drawSystemWallpaperBehindWebViewChanged} after the setting is successfully set.
     * @param showToastIfFailed Set to `false` to prevent a default error toast from appearing, for example when you have implemented custom error handling. Defaults to `true`.
     * @returns `true` if the request succedeed, `false` if there was an error. You can obtain the error message by calling {@link getLastErrorMessage()}.
    */
    requestSetDrawSystemWallpaperBehindWebViewEnabled(newEnabled: boolean, showToastIfFailed?: boolean): boolean;


    /**
     * Gets the current state of the "Draw overscroll effects" Bridge setting.
     */
    getOverscrollEffects(): OverscrollEffects;

    /**
     * Requests the "Draw overscroll effects" Bridge setting be set to the given value.
     * @fires {@link BridgeEventMap.drawSystemWallpaperBehindWebViewChanged} after the setting is successfully set.
     * @param showToastIfFailed Set to `false` to prevent a default error toast from appearing, for example when you have implemented custom error handling. Defaults to `true`.
     * @returns `true` if the request succedeed, `false` if there was an error. You can obtain the error message by calling {@link getLastErrorMessage()}.
     */
    requestSetOverscrollEffects(effects: OverscrollEffects, showToastIfFailed?: boolean): boolean;

    // system theme

    /**
     * Gets the current system night mode.  
     * If you are looking for a way to change your project's theme automatically, consider using the media query `prefers-color-scheme: dark` in your CSS.
     * @see {@link BridgeEventMap.systemNightModeChanged} to react to system night mode changes.
     */
    getSystemNightMode(): SystemNightModeOrError;

    /**
     * Resolves whether the system is in dark theme or not to a simple boolean value.  
     * If you are looking for a way to change your project's theme automatically, consider using the media query `prefers-color-scheme: dark` in your CSS.
     */
    resolveIsSystemInDarkTheme(): boolean;

    /** 
     * Checks whether Bridge has the permissions necessary to set the system night mode.
     * @see {@link requestSetSystemNightMode()}
     * @see {@link BridgeEventMap.systemNightModeChanged} to react to system night mode changes.
     */
    getCanRequestSystemNightMode(): boolean;

    /**
     * Requests the system's night theme be set to the given value.  
     * The value `custom` requires API level 30 (Android 11).
     * 
     * **WARNING!** For this to work, Bridge must be granted either `android.permission.WRITE_SECURE_SETTINGS` or `android.permission.MODIFY_DAY_NIGHT_MODE`.  
     * The former can be granted via adb, by running `adb shell pm grant com.tored.bridgelauncher android.permission.WRITE_SECURE_SETTINGS`,
     * the latter can't be granted without serious effort at the time of writing this message.
     *  
     * @fires {@link BridgeEventMap.systemNightModeChanged} after the mode is successfully changed.
     * @param showToastIfFailed Set to `false` to prevent a default error toast from appearing, for example when you have implemented custom error handling. Defaults to `true`.
     * @returns `true` if the request succedeed, `false` if there was an error. You can obtain the error message by calling {@link getLastErrorMessage()}.
     * @see {@link getCanRequestSystemNightMode()} to check whether Bridge has the permissions necessary to change the system night mode.
     * @see {@link BridgeEventMap.canRequestSystemNightModeChanged} to react to permission state changes.
     * @see {@link BridgeEventMap.systemNightModeChanged} to react to system night mode changes.
     */
    requestSetSystemNightMode(mode: SystemNightMode, showToastIfFailed?: boolean): boolean;


    // Bridge theme

    /**
     * Gets the current state of the Bridge theme setting.
     */
    getBridgeTheme(): BridgeTheme;

    /**
     * Requests the Bridge theme setting be set to the given value.
     * @fires {@link BridgeEventMap.bridgeThemeChanged} after the setting is successfully set.
     * @param showToastIfFailed Set to `false` to prevent a default error toast from appearing, for example when you have implemented custom error handling. Defaults to `true`.
     * @returns `true` if the request succedeed, `false` if there was an error. You can obtain the error message by calling {@link getLastErrorMessage()}.
     */
    requestSetBridgeTheme(theme: BridgeTheme, showToastIfFailed?: boolean): boolean;


    // status bar

    /**
     * Gets the current state of the "Status bar appearance" Bridge setting.
     */
    getStatusBarAppearance(): SystemBarAppearance;

    /**
     * Requests the "Status bar appearance" Bridge setting be set to the given value.  
     * Window insets may change and the appropriate events be fired if the status bar goes from being shown to hidden or vice versa.
     * @fires {@link BridgeEventMap.statusBarAppearanceChanged} after the setting is successfully set.
     * @param showToastIfFailed Set to `false` to prevent a default error toast from appearing, for example when you have implemented custom error handling. Defaults to `true`.
     * @returns `true` if the request succedeed, `false` if there was an error. You can obtain the error message by calling {@link getLastErrorMessage()}.
     */
    requestSetStatusBarAppearance(appearance: SystemBarAppearance, showToastIfFailed?: boolean): boolean;


    // navigation bar

    /**
     * Gets the current state of the "Navigation bar appearance" Bridge setting.
     */
    getNavigationBarAppearance(): SystemBarAppearance;

    /**
     * Requests the "Navigation bar appearance" Bridge setting be set to the given value.  
     * Window insets may change and the appropriate events be fired if the navigation bar goes from being shown to hidden or vice versa.
     * @fires {@link BridgeEventMap.navigationBarAppearanceChanged} after the setting is successfully set.
     * @param showToastIfFailed Set to `false` to prevent a default error toast from appearing, for example when you have implemented custom error handling. Defaults to `true`.
     * @returns `true` if the request succedeed, `false` if there was an error. You can obtain the error message by calling {@link getLastErrorMessage()}.
     */
    requestSetNavigationBarAppearance(appearance: SystemBarAppearance, showToastIfFailed?: boolean): boolean;


    // screen locking

    /**
     * Checks if the project can lock screen.  
     * Locking the screen requires API level 28 (Android 9). The user must enable the Bridge Accessiblity Service and also allow projects to lock the screen in Bridge settings.
     */
    getCanLockScreen(): boolean;

    /**
     * Requests the screen be locked.  
     * 
     * **WARNING!** Locking the screen requires API level 28 (Android 9). The user must enable the Bridge Accessiblity Service and also allow projects to lock the screen in Bridge settings.
     * Use {@link getCanLockScreen()} to check whether the requirements are fulfilled or not.
     * 
     * @fires {@link BridgeEventMap.navigationBarAppearanceChanged} after the setting is successfully set.
     * @param showToastIfFailed Set to `false` to prevent a default error toast from appearing, for example when you have implemented custom error handling. Defaults to `true`.
     * @returns `true` if the request succedeed, `false` if there was an error. You can obtain the error message by calling {@link getLastErrorMessage()}.
     */
    requestLockScreen(showToastIfFailed?: boolean): boolean;


    // misc requests

    /**
     * Requests the Bridge settings be opened.  
     * @param showToastIfFailed Set to `false` to prevent a default error toast from appearing, for example when you have implemented custom error handling. Defaults to `true`.
     * @returns `true` if the request succedeed, `false` if there was an error. You can obtain the error message by calling {@link getLastErrorMessage()}.
     */
    requestOpenBridgeSettings(showToastIfFailed?: boolean): boolean;

    /**
     * Requests the Bridge app drawer be opened.  
     * @param showToastIfFailed Set to `false` to prevent a default error toast from appearing, for example when you have implemented custom error handling. Defaults to `true`.
     * @returns `true` if the request succedeed, `false` if there was an error. You can obtain the error message by calling {@link getLastErrorMessage()}.
     */
    requestOpenBridgeAppDrawer(showToastIfFailed?: boolean): boolean;

    /**
     * Requests the developer console be opened.  
     * @param showToastIfFailed Set to `false` to prevent a default error toast from appearing, for example when you have implemented custom error handling. Defaults to `true`.
     * @returns `true` if the request succedeed, `false` if there was an error. You can obtain the error message by calling {@link getLastErrorMessage()}.
     */
    requestOpenDeveloperConsole(showToastIfFailed?: boolean): boolean;

    /**
     * Requests the notification shade to be expanded.  
     * @param showToastIfFailed Set to `false` to prevent a default error toast from appearing, for example when you have implemented custom error handling. Defaults to `true`.
     * @returns `true` if the request succedeed, `false` if there was an error. You can obtain the error message by calling {@link getLastErrorMessage()}.
     */
    requestExpandNotificationShade(showToastIfFailed?: boolean): boolean;


    // toast

    /**
     * Shows a toast containing the given message.
     * @param long If `true`, passes `Toast.LENGTH_LONG` as the duration. Otherwise, passes `Toast.LENGTH_SHORT`. Defaults to `false`.
     * @see [Toasts overview | Android Developers](https://developer.android.com/guide/topics/ui/notifiers/toasts)
     */
    showToast(message: string, long?: boolean): void;


    // window insets and cutouts

    /**
     * Gets the latest value of `WindowInsets.statusBars` from the Compose `WindowInsets` API.  
     * @returns a JSON object described by {@link WindowInsets}.
     * @see {@link BridgeEventMap.statusBarsWindowInsetsChanged} to react to changes.  
     * @see [WindowInsets.Companion.statusBars | Android Developers](https://developer.android.com/reference/kotlin/androidx/compose/foundation/layout/WindowInsets.Companion#(androidx.compose.foundation.layout.WindowInsets.Companion).statusBars())
     * @example
     * const insets: WindowInsets = JSON.parse(Bridge.getStatusBarsWindowInsets())
     */
    getStatusBarsWindowInsets(): WindowInsetsJson;

    /**
     * Gets the latest value of `WindowInsets.statusBarsIgnoringVisibility` from the Compose `WindowInsets` API.  
     * @returns a JSON object described by {@link WindowInsets}.
     * @see {@link BridgeEventMap.statusBarsIgnoringVisibilityWindowInsetsChanged} to react to changes.  
     * @see [WindowInsets.Companion.statusBarsIgnoringVisibility | Android Developers](https://developer.android.com/reference/kotlin/androidx/compose/foundation/layout/WindowInsets.Companion#(androidx.compose.foundation.layout.WindowInsets.Companion).statusBarsIgnoringVisibility())
     * @example
     * const insets: WindowInsets = JSON.parse(Bridge.getStatusBarsIgnoringVisibilityWindowInsets())
     */
    getStatusBarsIgnoringVisibilityWindowInsets(): WindowInsetsJson;

    /**
     * Gets the latest value of `WindowInsets.navigationBars` from the Compose `WindowInsets` API.  
     * @returns a JSON object described by {@link WindowInsets}.
     * @see {@link BridgeEventMap.navigationBarsWindowInsetsChanged} to react to changes.  
     * @see [WindowInsets.Companion.navigationBars | Android Developers](https://developer.android.com/reference/kotlin/androidx/compose/foundation/layout/WindowInsets.Companion#(androidx.compose.foundation.layout.WindowInsets.Companion).navigationBars())
     * @example
     * const insets: WindowInsets = JSON.parse(Bridge.getNavigationBarsWindowInsets())
     */
    getNavigationBarsWindowInsets(): WindowInsetsJson;

    /**
     * Gets the latest value of `WindowInsets.navigationBarsIgnoringVisibility` from the Compose `WindowInsets` API.  
     * @returns a JSON object described by {@link WindowInsets}.
     * @see {@link BridgeEventMap.navigationBarsIgnoringVisibilityWindowInsetsChanged} to react to changes.  
     * @see [WindowInsets.Companion.navigationBarsIgnoringVisibility | Android Developers](https://developer.android.com/reference/kotlin/androidx/compose/foundation/layout/WindowInsets.Companion#(androidx.compose.foundation.layout.WindowInsets.Companion).navigationBarsIgnoringVisibility())
     * @example
     * const insets: WindowInsets = JSON.parse(Bridge.getNavigationBarsIgnoringVisibilityWindowInsets())
     */
    getNavigationBarsIgnoringVisibilityWindowInsets(): WindowInsetsJson;


    /**
     * Gets the latest value of `WindowInsets.captionBar` from the Compose `WindowInsets` API.  
     * @returns a JSON object described by {@link WindowInsets}.
     * @see {@link BridgeEventMap.captionBarWindowInsetsChanged} to react to changes.  
     * @see [WindowInsets.Companion.captionBar | Android Developers](https://developer.android.com/reference/kotlin/androidx/compose/foundation/layout/WindowInsets.Companion#(androidx.compose.foundation.layout.WindowInsets.Companion).captionBar())
     * @example
     * const insets: WindowInsets = JSON.parse(Bridge.getStatusBarsWindowInsets())
     */
    getCaptionBarWindowInsets(): WindowInsetsJson;

    /**
     * Gets the latest value of `WindowInsets.captionBarIgnoringVisibility` from the Compose `WindowInsets` API.  
     * @returns a JSON object described by {@link WindowInsets}.
     * @see {@link BridgeEventMap.captionBarIgnoringVisibilityWindowInsetsChanged} to react to changes.  
     * @see [WindowInsets.Companion.captionBarIgnoringVisibility | Android Developers](https://developer.android.com/reference/kotlin/androidx/compose/foundation/layout/WindowInsets.Companion#(androidx.compose.foundation.layout.WindowInsets.Companion).captionBarIgnoringVisibility())
     * @example
     * const insets: WindowInsets = JSON.parse(Bridge.getCaptionBarIgnoringVisibilityWindowInsets())
     */
    getCaptionBarIgnoringVisibilityWindowInsets(): WindowInsetsJson;


    /**
     * Gets the latest value of `WindowInsets.systemBars` from the Compose `WindowInsets` API.  
     * @returns a JSON object described by {@link WindowInsets}.
     * @see {@link BridgeEventMap.systemBarsWindowInsetsChanged} to react to changes.  
     * @see [WindowInsets.Companion.systemBars | Android Developers](https://developer.android.com/reference/kotlin/androidx/compose/foundation/layout/WindowInsets.Companion#(androidx.compose.foundation.layout.WindowInsets.Companion).systemBars())
     * @example
     * const insets: WindowInsets = JSON.parse(Bridge.getSystemBarsWindowInsets())
     */
    getSystemBarsWindowInsets(): WindowInsetsJson;

    /**
     * Gets the latest value of `WindowInsets.systemBarsIgnoringVisibility` from the Compose `WindowInsets` API.  
     * @returns a JSON object described by {@link WindowInsets}.
     * @see {@link BridgeEventMap.systemBarsIgnoringVisibilityWindowInsetsChanged} to react to changes.  
     * @see [WindowInsets.Companion.systemBarsIgnoringVisibility | Android Developers](https://developer.android.com/reference/kotlin/androidx/compose/foundation/layout/WindowInsets.Companion#(androidx.compose.foundation.layout.WindowInsets.Companion).systemBarsIgnoringVisibility())
     * @example
     * const insets: WindowInsets = JSON.parse(Bridge.getSystemBarsIgnoringVisibilityWindowInsets())
     */
    getSystemBarsIgnoringVisibilityWindowInsets(): WindowInsetsJson;


    /**
     * Gets the latest value of `WindowInsets.ime` from the Compose `WindowInsets` API.  
     * @returns a JSON object described by {@link WindowInsets}.
     * @see {@link BridgeEventMap.imeWindowInsetsChanged} to react to changes.  
     * @see [WindowInsets.Companion.ime | Android Developers](https://developer.android.com/reference/kotlin/androidx/compose/foundation/layout/WindowInsets.Companion#(androidx.compose.foundation.layout.WindowInsets.Companion).ime())
     * @example
     * const insets: WindowInsets = JSON.parse(Bridge.getImeWindowInsets())
     */
    getImeWindowInsets(): WindowInsetsJson;

    /**
     * Gets the latest value of `WindowInsets.imeAnimationSource` from the Compose `WindowInsets` API.  
     * @returns a JSON object described by {@link WindowInsets}.
     * @see {@link BridgeEventMap.imeAnimationSourceWindowInsetsChanged} to react to changes.  
     * @see [WindowInsets.Companion.imeAnimationSource | Android Developers](https://developer.android.com/reference/kotlin/androidx/compose/foundation/layout/WindowInsets.Companion#(androidx.compose.foundation.layout.WindowInsets.Companion).imeAnimationSource())
     * @example
     * const insets: WindowInsets = JSON.parse(Bridge.getImeAnimationSourceWindowInsets())
     */
    getImeAnimationSourceWindowInsets(): WindowInsetsJson;

    /**
     * Gets the latest value of `WindowInsets.imeAnimationTarget` from the Compose `WindowInsets` API.  
     * @returns a JSON object described by {@link WindowInsets}.
     * @see {@link BridgeEventMap.imeAnimationTargetWindowInsetsChanged} to react to changes.  
     * @see [WindowInsets.Companion.imeAnimationTarget | Android Developers](https://developer.android.com/reference/kotlin/androidx/compose/foundation/layout/WindowInsets.Companion#(androidx.compose.foundation.layout.WindowInsets.Companion).imeAnimationTarget())
     * @example
     * const insets: WindowInsets = JSON.parse(Bridge.getImeAnimationTargetWindowInsets())
     */
    getImeAnimationTargetWindowInsets(): WindowInsetsJson;

    /**
     * Gets the latest value of `WindowInsets.tappableElement` from the Compose `WindowInsets` API.  
     * @returns a JSON object described by {@link WindowInsets}.
     * @see {@link BridgeEventMap.tappableElementWindowInsetsChanged} to react to changes.  
     * @see [WindowInsets.Companion.tappableElement | Android Developers](https://developer.android.com/reference/kotlin/androidx/compose/foundation/layout/WindowInsets.Companion#(androidx.compose.foundation.layout.WindowInsets.Companion).tappableElement())
     * @example
     * const insets: WindowInsets = JSON.parse(Bridge.getTappableElementWindowInsets())
     */
    getTappableElementWindowInsets(): WindowInsetsJson;

    /**
     * Gets the latest value of `WindowInsets.tappableElementIgnoringVisibility` from the Compose `WindowInsets` API.  
     * @returns a JSON object described by {@link WindowInsets}.
     * @see {@link BridgeEventMap.tappableElementIgnoringVisibilityWindowInsetsChanged} to react to changes.  
     * @see [WindowInsets.Companion.tappableElementIgnoringVisibility | Android Developers](https://developer.android.com/reference/kotlin/androidx/compose/foundation/layout/WindowInsets.Companion#(androidx.compose.foundation.layout.WindowInsets.Companion).tappableElementIgnoringVisibility())
     * @example
     * const insets: WindowInsets = JSON.parse(Bridge.getTappableElementIgnoringVisibilityWindowInsets())
     */
    getTappableElementIgnoringVisibilityWindowInsets(): WindowInsetsJson;


    /**
     * Gets the latest value of `WindowInsets.systemGestures` from the Compose `WindowInsets` API.  
     * @returns a JSON object described by {@link WindowInsets}.
     * @see {@link BridgeEventMap.systemGesturesWindowInsetsChanged} to react to changes.  
     * @see [WindowInsets.Companion.systemGestures | Android Developers](https://developer.android.com/reference/kotlin/androidx/compose/foundation/layout/WindowInsets.Companion#(androidx.compose.foundation.layout.WindowInsets.Companion).systemGestures())
     * @example
     * const insets: WindowInsets = JSON.parse(Bridge.getSystemGesturesWindowInsets())
     */
    getSystemGesturesWindowInsets(): WindowInsetsJson;

    /**
     * Gets the latest value of `WindowInsets.mandatorySystemGestures` from the Compose `WindowInsets` API.  
     * @returns a JSON object described by {@link WindowInsets}.
     * @see {@link BridgeEventMap.mandatorySystemGesturesWindowInsetsChanged} to react to changes.  
     * @see [WindowInsets.Companion.mandatorySystemGestures | Android Developers](https://developer.android.com/reference/kotlin/androidx/compose/foundation/layout/WindowInsets.Companion#(androidx.compose.foundation.layout.WindowInsets.Companion).mandatorySystemGestures())
     * @example
     * const insets: WindowInsets = JSON.parse(Bridge.getMandatorySystemGesturesWindowInsets())
     */
    getMandatorySystemGesturesWindowInsets(): WindowInsetsJson;


    /**
     * Gets the latest value of `WindowInsets.displayCutout` from the Compose `WindowInsets` API.  
     * @returns a JSON object described by {@link WindowInsets}.
     * @see {@link BridgeEventMap.displayCutoutWindowInsetsChanged} to react to changes.  
     * @see [WindowInsets.Companion.displayCutout | Android Developers](https://developer.android.com/reference/kotlin/androidx/compose/foundation/layout/WindowInsets.Companion#(androidx.compose.foundation.layout.WindowInsets.Companion).displayCutout())
     * @example
     * const insets: WindowInsets = JSON.parse(Bridge.getDisplayCutoutWindowInsets())
     */
    getDisplayCutoutWindowInsets(): WindowInsetsJson;

    /**
     * Gets the latest value of `WindowInsets.waterfall` from the Compose `WindowInsets` API.  
     * @returns a JSON object described by {@link WindowInsets}.
     * @see {@link BridgeEventMap.waterfallWindowInsetsChanged} to react to changes.  
     * @see [WindowInsets.Companion.waterfall | Android Developers](https://developer.android.com/reference/kotlin/androidx/compose/foundation/layout/WindowInsets.Companion#(androidx.compose.foundation.layout.WindowInsets.Companion).waterfall())
     * @example
     * const insets: WindowInsets = JSON.parse(Bridge.getWaterfallWindowInsets())
     */
    getWaterfallWindowInsets(): WindowInsetsJson;


    /**
     * Returns `DisplayShape.getPath()`.
     * 
     * **WARNING!** This call requires API level 31 (Android 12). Returns `null` on earlier Android versions.
     * 
     * @returns The cutout path or `null`, if there is no cutout. Always returns `null` on API level < 31.
     * @see [DisplayCutout | Android Developers](https://developer.android.com/reference/android/view/DisplayCutout#getCutoutPath())
     */
    getDisplayCutoutPath(): string | null;

    /**
     * Returns `DisplayCutout.getCutoutPath()`.
     * 
     * **WARNING!** This call requires API level 34 (Android 14). Returns `null` on earlier Android versions.
     * 
     * @returns The display shape path or `null`, if there is no cutout. Always returns `null` on API level < 34.
     * @see [DisplayShape.getPath() | Android Developers](https://developer.android.com/reference/android/view/DisplayShape#getPath())
     */
    getDisplayShapePath(): string | null;
}

export type AppRemovedEventArgs = { packageName: string; };
export type ValueChangeEventArgs<T> = { newValue: T; };

/**
 * Describes all possible combinations of `name` and `args` Bridge can call {@link onBridgeEvent()} with.
 */
export interface BridgeEventMap 
{
    /**
     * Called when Bridge receives a broadcast intent with the action `Intent.ACTION_PACKAGE_ADDED`.
     * @see [Intent.ACTION_PACKAGE_ADDED | Android Developers](https://developer.android.com/reference/android/content/Intent.html#ACTION_PACKAGE_ADDED)
     */
    appInstalled: BridgeInstalledAppInfo;

    /**
     * Called when Bridge receives a broadcast intent with the action `Intent.ACTION_PACKAGE_CHANGED` or `Intent.ACTION_PACKAGE_REPLACED`.
     * @see [Intent.ACTION_PACKAGE_CHANGED | Android Developers](https://developer.android.com/reference/android/content/Intent.html#ACTION_PACKAGE_CHANGED)
     * @see [Intent.ACTION_PACKAGE_REPLACED | Android Developers](https://developer.android.com/reference/android/content/Intent.html#ACTION_PACKAGE_REPLACED)
     */
    appChanged: BridgeInstalledAppInfo;

    /**
     * Called when Bridge receives a broadcast intent with the action `Intent.ACTION_PACKAGE_REMOVED` when `Intent.EXTRA_REPLACING` is `false`.
     * @see [Intent.ACTION_PACKAGE_REMOVED | Android Developers](https://developer.android.com/reference/android/content/Intent.html#ACTION_PACKAGE_REMOVED)
     */
    appRemoved: AppRemovedEventArgs;


    /**
     * Called in `onPause()` of the main Bridge activity. You can use this to pause any work you don't want going on in the background.
     * @see [The activity lifecycle - onPause() | Android Developers](https://developer.android.com/guide/components/activities/activity-lifecycle#onpause)
     */
    beforePause: undefined;

    /**
     * Called in `onResume()` of the main Bridge activity. You can use this to resume work paused in {@link beforePause}.
     * @see [The activity lifecycle - onResume() | Android Developers](https://developer.android.com/guide/components/activities/activity-lifecycle#onresume)
     */
    afterResume: undefined;


    /**
     * Called after the Bridge button visibility setting changes, no matter what the source of the change was (Bridge settings, JS API, QS tile, ...).
     */
    bridgeButtonVisibilityChanged: ValueChangeEventArgs<BridgeButtonVisibility>;

    /**
     * Called after the "Draw system wallpaper behind WebView" Bridge setting changes, no matter what the source of the change was (Bridge settings, the JS API, ...).
     */
    drawSystemWallpaperBehindWebViewChanged: ValueChangeEventArgs<boolean>;

    /**
     * Called after the "Draw overscroll effects" Bridge setting changes, no matter what the source of the change was (Bridge settings, the JS API, ...).
     */
    overscrollEffectsChanged: ValueChangeEventArgs<OverscrollEffects>;

    /**
     * Called from `onConfigurationChanged()` of the main Bridge activity, when the system night mode changed.
     */
    systemNightModeChanged: ValueChangeEventArgs<SystemNightModeOrError>;

    /**
     * Called after the Bridge theme setting changes, no matter what the source of the change was (Bridge settings, the JS API, ...).
     */
    bridgeThemeChanged: ValueChangeEventArgs<BridgeTheme>;

    /**
     * Called after the "Status bar appearance" Bridge setting changes, no matter what the source of the change was (Bridge settings, the JS API, ...).
     */
    statusBarAppearanceChanged: ValueChangeEventArgs<SystemBarAppearance>;

    /**
     * Called after the "Navigation bar appearance" Bridge setting changes, no matter what the source of the change was (Bridge settings, the JS API, ...).
     */
    navigationBarAppearanceChanged: ValueChangeEventArgs<SystemBarAppearance>;

    /**
     * Called after Bridge is granted/revoked permissions necessary to change the system night mode.
     */
    canRequestSystemNightModeChanged: ValueChangeEventArgs<boolean>;

    /**
     * Called after Bridge is granted/revoked permissions necessary to lock the screen and/or when the project is allowed/disallowed to lock the screen from the Bridge settings.
     */
    canLockScreenChanged: ValueChangeEventArgs<boolean>;


    /**
     * Called when `WindowInsets.statusBars` changed.
     * @see [WindowInsets.Companion.statusBars | Android Developers](https://developer.android.com/reference/kotlin/androidx/compose/foundation/layout/WindowInsets.Companion#(androidx.compose.foundation.layout.WindowInsets.Companion).statusBars())
     */
    statusBarsWindowInsetsChanged: ValueChangeEventArgs<WindowInsets>;

    /**
     * Called when `WindowInsets.statusBarsIgnoringVisibility` changed.
     * @see [WindowInsets.Companion.statusBarsIgnoringVisibility | Android Developers](https://developer.android.com/reference/kotlin/androidx/compose/foundation/layout/WindowInsets.Companion#(androidx.compose.foundation.layout.WindowInsets.Companion).statusBarsIgnoringVisibility())
     */
    statusBarsIgnoringVisibilityWindowInsetsChanged: ValueChangeEventArgs<WindowInsets>;


    /**
     * Called when `WindowInsets.navigationBars` changed.
     * @see [WindowInsets.Companion.navigationBars | Android Developers](https://developer.android.com/reference/kotlin/androidx/compose/foundation/layout/WindowInsets.Companion#(androidx.compose.foundation.layout.WindowInsets.Companion).navigationBars())
     */
    navigationBarsWindowInsetsChanged: ValueChangeEventArgs<WindowInsets>;

    /**
     * Called when `WindowInsets.navigationBarsIgnoringVisibility` changed.
     * @see [WindowInsets.Companion.navigationBarsIgnoringVisibility | Android Developers](https://developer.android.com/reference/kotlin/androidx/compose/foundation/layout/WindowInsets.Companion#(androidx.compose.foundation.layout.WindowInsets.Companion).navigationBarsIgnoringVisibility())
     */
    navigationBarsIgnoringVisibilityWindowInsetsChanged: ValueChangeEventArgs<WindowInsets>;


    /**
     * Called when `WindowInsets.captionBar` changed.
     * @see [WindowInsets.Companion.captionBar | Android Developers](https://developer.android.com/reference/kotlin/androidx/compose/foundation/layout/WindowInsets.Companion#(androidx.compose.foundation.layout.WindowInsets.Companion).captionBar())
     */
    captionBarWindowInsetsChanged: ValueChangeEventArgs<WindowInsets>;

    /**
     * Called when `WindowInsets.captionBarIgnoringVisibility` changed.
     * @see [WindowInsets.Companion.captionBarIgnoringVisibility | Android Developers](https://developer.android.com/reference/kotlin/androidx/compose/foundation/layout/WindowInsets.Companion#(androidx.compose.foundation.layout.WindowInsets.Companion).captionBarIgnoringVisibility())
     */
    captionBarIgnoringVisibilityWindowInsetsChanged: ValueChangeEventArgs<WindowInsets>;


    /**
     * Called when `WindowInsets.systemBars` changed.
     * @see [WindowInsets.Companion.systemBars | Android Developers](https://developer.android.com/reference/kotlin/androidx/compose/foundation/layout/WindowInsets.Companion#(androidx.compose.foundation.layout.WindowInsets.Companion).systemBars())
     */
    systemBarsWindowInsetsChanged: ValueChangeEventArgs<WindowInsets>;

    /**
     * Called when `WindowInsets.systemBarsIgnoringVisibility` changed.
     * @see [WindowInsets.Companion.systemBarsIgnoringVisibility | Android Developers](https://developer.android.com/reference/kotlin/androidx/compose/foundation/layout/WindowInsets.Companion#(androidx.compose.foundation.layout.WindowInsets.Companion).systemBarsIgnoringVisibility())
     */
    systemBarsIgnoringVisibilityWindowInsetsChanged: ValueChangeEventArgs<WindowInsets>;


    /**
     * Called when `WindowInsets.ime` changed.
     * @see [WindowInsets.Companion.ime | Android Developers](https://developer.android.com/reference/kotlin/androidx/compose/foundation/layout/WindowInsets.Companion#(androidx.compose.foundation.layout.WindowInsets.Companion).ime())
     */
    imeWindowInsetsChanged: ValueChangeEventArgs<WindowInsets>;

    /**
     * Called when `WindowInsets.imeAnimationSource` changed.
     * @see [WindowInsets.Companion.imeAnimationSource | Android Developers](https://developer.android.com/reference/kotlin/androidx/compose/foundation/layout/WindowInsets.Companion#(androidx.compose.foundation.layout.WindowInsets.Companion).imeAnimationSource())
     */
    imeAnimationSourceWindowInsetsChanged: ValueChangeEventArgs<WindowInsets>;

    /**
     * Called when `WindowInsets.imeAnimationTarget` changed.
     * @see [WindowInsets.Companion.imeAnimationTarget | Android Developers](https://developer.android.com/reference/kotlin/androidx/compose/foundation/layout/WindowInsets.Companion#(androidx.compose.foundation.layout.WindowInsets.Companion).imeAnimationTarget())
     */
    imeAnimationTargetWindowInsetsChanged: ValueChangeEventArgs<WindowInsets>;


    /**
     * Called when `WindowInsets.tappableElement` changed.
     * @see [WindowInsets.Companion.tappableElement | Android Developers](https://developer.android.com/reference/kotlin/androidx/compose/foundation/layout/WindowInsets.Companion#(androidx.compose.foundation.layout.WindowInsets.Companion).tappableElement())
     */
    tappableElementWindowInsetsChanged: ValueChangeEventArgs<WindowInsets>;

    /**
     * Called when `WindowInsets.tappableElementIgnoringVisibility` changed.
     * @see [WindowInsets.Companion.tappableElementIgnoringVisibility | Android Developers](https://developer.android.com/reference/kotlin/androidx/compose/foundation/layout/WindowInsets.Companion#(androidx.compose.foundation.layout.WindowInsets.Companion).tappableElementIgnoringVisibility())
     */
    tappableElementIgnoringVisibilityWindowInsetsChanged: ValueChangeEventArgs<WindowInsets>;


    /**
     * Called when `WindowInsets.systemGestures` changed.
     * @see [WindowInsets.Companion.systemGestures | Android Developers](https://developer.android.com/reference/kotlin/androidx/compose/foundation/layout/WindowInsets.Companion#(androidx.compose.foundation.layout.WindowInsets.Companion).systemGestures())
     */
    systemGesturesWindowInsetsChanged: ValueChangeEventArgs<WindowInsets>;

    /**
     * Called when `WindowInsets.mandatorySystemGestures` changed.
     * @see [WindowInsets.Companion.mandatorySystemGestures | Android Developers](https://developer.android.com/reference/kotlin/androidx/compose/foundation/layout/WindowInsets.Companion#(androidx.compose.foundation.layout.WindowInsets.Companion).mandatorySystemGestures())
     */
    mandatorySystemGesturesWindowInsetsChanged: ValueChangeEventArgs<WindowInsets>;


    /**
     * Called when `WindowInsets.displayCutout` changed.
     * @see [WindowInsets.Companion.displayCutout | Android Developers](https://developer.android.com/reference/kotlin/androidx/compose/foundation/layout/WindowInsets.Companion#(androidx.compose.foundation.layout.WindowInsets.Companion).displayCutout())
     */
    displayCutoutWindowInsetsChanged: ValueChangeEventArgs<WindowInsets>;

    /**
     * Called when `WindowInsets.waterfall` changed.
     * @see [WindowInsets.Companion.waterfall | Android Developers](https://developer.android.com/reference/kotlin/androidx/compose/foundation/layout/WindowInsets.Companion#(androidx.compose.foundation.layout.WindowInsets.Companion).waterfall())
     */
    waterfallWindowInsetsChanged: ValueChangeEventArgs<WindowInsets>;
}

/**
 * Describes all possible names Bridge can call {@link onBridgeEvent()} with.
 */
export type BridgeEventName = keyof BridgeEventMap;

/**
 * An union of tuples describing all possible combinations of `name` and `args` Bridge can call {@link onBridgeEvent()} with.
 */
export type BridgeEventListenerArgs = {
    [K in BridgeEventName]: [name: K, args: BridgeEventMap[K]]
}[BridgeEventName];

/**
 * Describes a valid function that can be assigned to {@link onBridgeEvent} to be called by Bridge when an event occurs.
 */
export type BridgeEventListener = (...args: BridgeEventListenerArgs) => void;

declare global
{
    /** 
     * The Bridge Launcher JS API. 
     * @see {@link onBridgeEvent} for listening to Bridge events.
     */
    var Bridge: JSToBridgeAPI;

    /**
     * Assign a function to this variable to listen to Bridge events. Bridge will call this function if it is set.
     * @see {@link BridgeEventMap} for event names and corresponding arguments.
     * @see {@link Bridge} for calling the Bridge JS API.
     * @example
     * const listeners = new Set<BridgeEventListener>();
     * window.onBridgeEvent = (...event: BridgeEventListenerArgs) => listeners.forEach(l => l(...event));
     * // somewhere else
     * listeners.add((...[name, args]: BridgeEventListenerArgs) => {
     *      if(name === 'appInstalled') {
     *          // args will be strongly typed here
     *          console.log(args.packageName)
     *      }
     * })
     */
    var onBridgeEvent: BridgeEventListener | undefined;
}