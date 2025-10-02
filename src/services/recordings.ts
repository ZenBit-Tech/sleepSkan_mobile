import storage, { getStorage, ref as storageRef, writeToFile,  } from '@react-native-firebase/storage';
import auth, { getAuth, signInAnonymously } from '@react-native-firebase/auth';
import RNFS from 'react-native-fs';
import { Alert, Platform } from 'react-native';
import Share from 'react-native-share';

import { PROJECT_ID, REGION } from 'src/constants';
import { updateUser } from 'src/db';
import { RISK } from 'src/models';
import { getApp } from '@react-native-firebase/app';


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

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

export const finishSession = async (
  userId: string,
  sessionId: string,
  opts?: { retries?: number; delayMs?: number; signal?: AbortSignal }
): Promise<FinishSessionResponse> => {
  const retries = opts?.retries ?? 6;       // total attempts = retries+1
  const delayMs = opts?.delayMs ?? 5000;
  const externalSignal = opts?.signal;

  const currentUser = auth().currentUser;
  const uid = currentUser?.uid;
  if (!uid || uid !== userId) throw new Error('Not signed in as this user');

  const idToken = await currentUser.getIdToken(true);
  const url = `https://${REGION}-${PROJECT_ID}.cloudfunctions.net/finishSession`;

  let attempt = 0;

  while (true) {
    attempt++;

    // allow per-request abort (15s) + optional external abort
    const controller = new AbortController();
    const onAbort = () => controller.abort();
    externalSignal?.addEventListener('abort', onAbort, { once: true });
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
      const res = await fetch(url, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(<FinishSessionPayload>{ sessionId }),
      });

      clearTimeout(timeout);
      externalSignal?.removeEventListener('abort', onAbort);

      if (!res.ok) {
        const text = await res.text().catch(() => '');

        // Retry only on 409 "analysis still running"
        const pending =
          res.status === 409 ||
          /Audio analysis still running/i.test(text);

        if (pending && attempt <= retries) {
          console.warn(
            `finishSession pending (attempt ${attempt}/${retries + 1}). Retrying in ${delayMs}ms…`
          );
          await sleep(delayMs);
          continue;
        }

        // otherwise, fail fast
        throw new Error(`finishSession failed: ${res.status} ${text || res.statusText}`);
      }

      // success
      const data: FinishSessionResponse =
        (await res.json().catch(() => ({ ok: true }))) as FinishSessionResponse;

      await updateUser(uid, {
        recording: true,
        risk: data.risk,
        recording_results: data.resultObject,
        pdf_file: data?.pdfReport?.filePath || '',
      });

      return data;
    } catch (e) {
      clearTimeout(timeout);
      externalSignal?.removeEventListener('abort', onAbort);

      // If fetch was aborted by our timeout/external signal, don't loop forever
      if ((e as any)) {
        if (attempt <= retries) {
          console.warn(`finishSession timeout/abort (attempt ${attempt}). Retrying in ${delayMs}ms…`);
          await sleep(delayMs);
          continue;
        }
      }
      console.error('❌ finishSession error:', e);
      throw e instanceof Error ? e : new Error(String(e));
    }
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

    const fileRef = await storage().ref(`recordings/${userId}/devsession-1/${fileName}`);

    // ✅ Use putFile for local file uploads (no need for base64 or blob)
    const task = fileRef.putFile(filePath, { contentType: 'audio/wav' });

    return new Promise((resolve, reject) => {
      const unsubscribe = task.on(
        'state_changed',
        (snap) => {
          // if (onProgress && snap.totalBytes > 0) {
          //   onProgress(snap.bytesTransferred / snap.totalBytes);
          // }
        },
        (error) => {
          unsubscribe();
          reject(error);
        },
        async () => {
          try {
            unsubscribe();
            onSuccess?.();
            const url = await fileRef.getDownloadURL();
            resolve(url);
          } catch (e) {
            // still succeed with a fallback if URL fails
            onSuccess?.();
            resolve(fileRef.fullPath);
          }
        }
      );
    });

  } catch (err) {
    console.error('❌ Error in uploadAudioToFirebase:', err);
    throw err;
  }
};

export const fetchSessionJson = async(uid: string) => {
  // 1) Ensure we’re authenticated (use your real sign-in; anonymous is just for dev)
  const user = auth().currentUser ?? (await auth().signInAnonymously()).user;
  // 2) Download JSON
  const url = await storage().ref(`recordings/${uid}/devsession-1/session-result.json`).getDownloadURL();
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${uid}`);
  return res.json();
}

type DownloadOpts = { path: string; openAfter?: boolean };

export async function downloadReportPdf({ path, openAfter = true }: DownloadOpts) {
  if (!path || typeof path !== 'string') {
    throw new Error('downloadReportPdf: "path" (string) is required');
  }

  // Allow both "reports/..." and "gs://<bucket>/reports/..."
  const cleanPath = path.startsWith('gs://')
    ? path.split('/').slice(3).join('/')            // drop gs://bucket
    : path.replace(/^\/+/, '');    

  // 1) Auth must match your Storage rules:
  const app = getApp();
  const auth = getAuth(app);
  const user = auth.currentUser ?? (await signInAnonymously(auth)).user;
  const uidInPath = cleanPath.split('/')[1];
  if (user.uid !== uidInPath) {
    throw new Error(`Rules require auth.uid === path uid. auth=${user.uid} path=${uidInPath}`);
  }

  // 2) Decide a local path
  const fileName = cleanPath.split('/').pop()!;
  const localPath = Platform.select({
    ios: `${RNFS.DocumentDirectoryPath}/${fileName}`,
    android: `${RNFS.DocumentDirectoryPath}/${fileName}`,
  })!;

  // 3) Download using Firebase native SDK (no extra HTTP, respects App Check)
  const storage = getStorage(app);
  const ref = storageRef(storage, cleanPath);
  await writeToFile(ref, localPath);

    // Sanity check (helps catch token/permission errors that saved HTML instead)
    const stat = await RNFS.stat(localPath);
    if (!stat || Number(stat.size) < 100) {
      throw new Error('Downloaded file appears empty or invalid.');
    }

  return localPath;
}

export async function saveToUserLocation(localPath: string, fileName = 'Report.pdf') {
  // sanity check the file exists
  const ok = await RNFS.exists(localPath);
  if (!ok) {
    Alert.alert('File not found', 'Please download the report again.');
    return;
  }

  const uri =
    Platform.OS === 'android' && !localPath.startsWith('file://')
      ? `file://${localPath}`
      : localPath;

  try {
    await Share.open({
      url: uri,
      type: 'application/pdf',
      filename: fileName,          // ← correct key is "filename" (not fileName)
      failOnCancel: false,
      saveToFiles: true,           // iOS: shows “Save to Files”
      useInternalStorage: true,    // ANDROID: copy/share via FileProvider
      showAppsToView: true,        
    } as any);
  } catch (e) {
    console.warn('Share/save failed:', e);
    if (Platform.OS === 'ios') {
      try {
        const b64 = await RNFS.readFile(uri.replace('file://', ''), 'base64');
        await Share.open({
          url: `data:application/pdf;base64,${b64}`,
          type: 'application/pdf',
          filename: fileName,
          failOnCancel: false,
          saveToFiles: true,
        } as any);
      } catch {}
    }
  }
}