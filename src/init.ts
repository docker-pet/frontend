import {
  setDebug,
  mountBackButton,
  restoreInitData,
  init as initSDK,
  bindThemeParamsCssVars,
  mountViewport,
  bindViewportCssVars,
  mockTelegramEnv,
  themeParamsState,
  emitEvent,
  mountThemeParamsSync,
  mountMiniAppSync,
  themeParamsBackgroundColor,
  setMiniAppHeaderColor,
  setMiniAppBackgroundColor,
  setMiniAppBottomBarColor,
} from '@telegram-apps/sdk-react';

/**
 * Initializes the application and configures its dependencies.
 */
export async function init(options: {
  debug: boolean;
  eruda: boolean;
  mockForMacOS: boolean;
}): Promise<void> {
  // Set @telegram-apps/sdk-react debug mode and initialize it.
  setDebug(options.debug);
  initSDK();

  // Add Eruda if needed.
  options.eruda &&
    void import('eruda').then(({ default: eruda }) => {
      eruda.init();
      eruda.position({ x: window.innerWidth - 50, y: 0 });
    });

  // Telegram for macOS has a ton of bugs, including cases, when the client doesn't
  // even response to the "web_app_request_theme" method. It also generates an incorrect
  // event for the "web_app_request_safe_area" method.
  // https://github.com/Telegram-Mini-Apps/telegram-apps/issues/694
  if (options.mockForMacOS) {
    const noInsets = { left: 0, top: 0, right: 0, bottom: 0 };
    mockTelegramEnv({
      onEvent(event, next) {
        if (event[0] === 'web_app_request_theme') {
          return emitEvent('theme_changed', { theme_params: themeParamsState() });
        }
        if (event[0] === 'web_app_request_content_safe_area') {
          return emitEvent('content_safe_area_changed', noInsets);
        }
        // TODO: Remove for macOS. The have fixed this problem eventually.
        if (event[0] === 'web_app_request_safe_area') {
          return emitEvent('safe_area_changed', noInsets);
        }
        next();
      },
    });
  }

  // Initialize required components.
  restoreInitData();

  if (mountViewport.isAvailable()) {
    await mountViewport({ timeout: 3000 });
    bindViewportCssVars();
  }

  if (mountThemeParamsSync.isAvailable()) {
    mountThemeParamsSync();
    bindThemeParamsCssVars();
  }

  // if (mountMainButton.isAvailable()) {
  //   setMainButtonParams({ isVisible: false });
  // }

  mountMiniAppSync.ifAvailable();
  mountBackButton.ifAvailable();

  // const initialColors = [
  //   miniAppHeaderColor(),
  //   miniAppBackgroundColorRGB(),
  //   miniAppBottomBarColorRGB(),
  // ];

  const desiredColor = themeParamsBackgroundColor();
  if (desiredColor) {
    setMiniAppHeaderColor(desiredColor);
    setMiniAppBackgroundColor(desiredColor);
    setMiniAppBottomBarColor(desiredColor);
  }
}
