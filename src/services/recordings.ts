import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import RNFS from 'react-native-fs';
import { Platform } from 'react-native';
import { PROJECT_ID, REGION } from 'src/constants';
import { updateUser } from 'src/db';
import { RISK } from 'src/models';


type FinishSessionResponse = {
  ok: boolean;
  message?: string;
  sessionId: string;
  risk: RISK;
  resultObject: string;
  pdfReport: {
    filePath: string
  }
};

type FinishSessionPayload = {
  sessionId: string;
  resultObject: string;
  risk: RISK;
  pdfReport: {
    filePath: string
  }
  meta?: Record<string, unknown>;
};

export const clearFirebaseFolder = async (userId: string) => {
  try {
    const uid = auth().currentUser?.uid;

    if (!uid || uid !== userId) throw new Error('Not signed in as this user');
    
    const folderRef = storage().ref(`recordings/${userId}/devsession-1`);
    const result = await folderRef.listAll();

    // Check if the folder has any files (i.e., it exists logically)
    if (result.items.length === 0) {
      console.log(`ℹ️ Folder recordings/${userId}/devsession-1 does not exist or is already empty.`);
      return;
    }
    
     // Delete each object (allowed by write rule when request.resource == null)
     await Promise.all(result.items.map((item) => item.delete()));
     console.log('✅ Cleared devsession-1');

  } catch (error) {
    console.error(`❌ Failed to clear folder for user ${userId}:`, error);
  }
};


export const finishSession = async (
  userId: string,
  sessionId: string,
  // stopBangScore: number,
): Promise<FinishSessionResponse> => {
  try {
    const currentUser = auth().currentUser;
    const uid = currentUser?.uid;
    if (!uid || uid !== userId) throw new Error('Not signed in as this user');

    const idToken = await currentUser.getIdToken(true);

    let appCheckHeader: Record<string, string> = {};

    const url = `https://${REGION}-${PROJECT_ID}.cloudfunctions.net/finishSession`;

    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 15000);

    const res = await fetch(url, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
        ...appCheckHeader,
        // Optional: send platform info
        'X-Client-Platform': Platform.OS,
      },
      body: JSON.stringify(<FinishSessionPayload>{ sessionId }),
    }).finally(() => clearTimeout(t));

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`finishSession failed: ${res.status} ${text || res.statusText}`);
    }

    // If your CF returns no JSON, this will safely fallback
    const data: FinishSessionResponse =
      (await res.json().catch(() => ({ ok: true }))) as FinishSessionResponse;

    await updateUser(uid, {
      recording: true,
      risk: data.risk,
      recording_results: data.resultObject,
      pdf_file: data.pdfReport.filePath
    });

    console.log('✅ finishSession OK', data);
    return data;
  } catch (e) {
    const err = e instanceof Error ? e : new Error(String(e));
    console.error('❌ finishSession error:', err);
    throw err;
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

    const fileRef = storage().ref(`recordings/${userId}/devsession-1/${fileName}`);

    // ✅ Use putFile for local file uploads (no need for base64 or blob)
    const task = fileRef.putFile(filePath, { contentType: 'audio/wav' });

    return new Promise((resolve, reject) => {
      task.on('state_changed', snapshot => {
        console.log(`Uploading ${fileName}: ${snapshot.bytesTransferred} transferred`);
      });

      onSuccess?.();
    });
  } catch (err) {
    console.error('❌ Error in uploadAudioToFirebase:', err);
    throw err;
  }
};