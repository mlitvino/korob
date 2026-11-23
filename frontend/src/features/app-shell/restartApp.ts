import { DevSettings } from 'react-native';
import * as Updates from 'expo-updates';

/**
 * Reloads the JavaScript bundle. In a release build this launches the newest downloaded
 * update, so a fixed update can replace one that keeps failing.
 */
export function restartApp(): void {
  if (__DEV__) {
    DevSettings.reload();
    return;
  }
  Updates.reloadAsync().catch(console.error);
}
