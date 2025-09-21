import storage from '@react-native-firebase/storage';
import RNFS from 'react-native-fs';

export const clearFirebaseFolder = async (userId: string) => {
  try {
    const folderRef = storage().ref(`recordings/${userId}/session-1`);
    const result = await folderRef.listAll();

    // Check if the folder has any files (i.e., it exists logically)
    if (result.items.length === 0) {
      console.log(`ℹ️ Folder recordings/${userId}/session-1 does not exist or is already empty.`);
      return;
    }
    
    const deletePromises = result.items.map((item) => item.delete());
    await Promise.all(deletePromises);

  } catch (error) {
    console.error(`❌ Failed to clear folder for user ${userId}:`, error);
  }
};

export const uploadAudioToFirebase = async (
  filePath: string,
  fileName: string,
  userId: string,
  onSuccess?: () => void
): Promise<string> => {
  try {
    const fileExists = await RNFS.exists(filePath);
    if (!fileExists) throw new Error('File does not exist at path: ' + filePath);

    const fileRef = storage().ref(`recordings/${userId}/session-1/${fileName}`);

    // ✅ Use putFile for local file uploads (no need for base64 or blob)
    const task = fileRef.putFile(filePath);

    return new Promise((resolve, reject) => {
      task.on('state_changed', snapshot => {
        console.log(`Uploading ${fileName}: ${snapshot.bytesTransferred} transferred`);
      });

      task
        .then(async () => {
          const downloadUrl = await fileRef.getDownloadURL();
          console.log(`✅ Upload successful: ${fileName}`, downloadUrl);
          onSuccess?.();
          resolve(downloadUrl);
        })
        .catch(error => {
          console.error(`❌ Upload failed: ${fileName}`, error);
          reject(error);
        });
    });
  } catch (err) {
    console.error('❌ Error in uploadAudioToFirebase:', err);
    throw err;
  }
};