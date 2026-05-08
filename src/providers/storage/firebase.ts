import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import { Config, onConfigChange } from "../../Config";
import init from "../firebase-init";
import { StorageProviderAdapter } from "./StorageProvider";

let storageInstance: firebase.storage.Storage | undefined;
onConfigChange((newConfig: Config) => {
    if (newConfig.firebase) init(newConfig.firebase);
});

const getStorage = (): firebase.storage.Storage | undefined => {
    if (!storageInstance && firebase.apps.length) {
        storageInstance = firebase.app().storage();
    }
    return storageInstance;
};

export class FirebaseStorageProvider implements StorageProviderAdapter {
    upload = async (file: string, path: string): Promise<string | undefined> => {
        if (!file) return;
        const storageRef = getStorage()?.ref(path);
        if (!storageRef) { console.error("Firebase Storage not initialized"); return; }
        try {
            const snapshot = await storageRef.putString(file, 'data_url');
            return await snapshot.ref.getDownloadURL();
        } catch (error) {
            console.error("Upload error:", error);
        }
    };

    getURL = async (path: string): Promise<string | undefined> => {
        const storageRef = getStorage()?.ref(path);
        if (!storageRef) return;
        try {
            return await storageRef.getDownloadURL();
        } catch (error) {
            console.error(`Error getting download URL for ${path}:`, error);
        }
    };

    download = async (path: string): Promise<Blob | undefined> => {
        const url = await this.getURL(path);
        if (!url) return;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("Failed to fetch the file");
            return await response.blob();
        } catch (error) {
            console.error("Error downloading file:", error);
        }
    };

    delete = async (path: string): Promise<boolean> => {
        const storageRef = getStorage()?.ref(path);
        if (!storageRef) return false;
        try {
            await storageRef.delete();
            return true;
        } catch (error) {
            console.error(`Error deleting file ${path}:`, error);
            return false;
        }
    };
}

export default new FirebaseStorageProvider();
