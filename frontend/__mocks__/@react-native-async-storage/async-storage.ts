import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

export default mockAsyncStorage;
export const getItem = mockAsyncStorage.getItem;
export const setItem = mockAsyncStorage.setItem;
export const removeItem = mockAsyncStorage.removeItem;
export const clear = mockAsyncStorage.clear;
