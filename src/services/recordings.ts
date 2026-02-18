import storage, {FirebaseStorageTypes} from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import RNFS from 'react-native-fs';
import {Platform} from 'react-native';
import RNBlob from 'react-native-blob-util';
import Share from 'react-native-share';
import Toast from 'react-native-toast-message';

import {PROJECT_ID, REGION} from 'src/constants';
import {updateUser} from 'src/db';
import {RISK} from 'src/models';
import {store} from 'src/store';
import {setRecording} from 'src/screens/profile/reducer';

type FinishSessionResponse = {
  ok: boolean;
  message?: string;
  sessionId: string;
  risk: RISK;
  resultObject: string;
  pdfReport: {
    filePath: string;
  };
};

type FinishSessionPayload = {
  sessionId: string;
};

const TARGET_FILES = new Set([
  'session-result.json',
  'session-result-full-v2.json',
]);

const safeDateFolder = (iso: string) => {
  // "2026-02-13T13:48:51.261Z" -> "2026-02-13"
  // fallback: if invalid, use today
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');

    return `${y}-${m}-${day}_${hh}-${mm}-${ss}`;
  }
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');

  return `${y}-${m}-${day}_${hh}-${mm}-${ss}`;
};

async function downloadToTemp(ref: FirebaseStorageTypes.Reference) {
  const url = await ref.getDownloadURL();
  const tmpPath = `${RNFS.TemporaryDirectoryPath}/${Date.now()}-${ref.name}`;
  await RNFS.downloadFile({fromUrl: url, toFile: tmpPath}).promise;
  return tmpPath;
}

async function readJsonFromStoragePath(path: string) {
  const ref = storage().ref(path);
  const tmp = await downloadToTemp(ref);
  try {
    const text = await RNFS.readFile(tmp, 'utf8');
    return JSON.parse(text);
  } finally {
    try {
      await RNFS.unlink(tmp);
    } catch {}
  }
}

async function copyFileInStorage(fromPath: string, toPath: string) {
  const fromRef = storage().ref(fromPath);
  const tmpPath = await downloadToTemp(fromRef);

  try {
    const toRef = storage().ref(toPath);
    await toRef.putFile(tmpPath);
  } finally {
    try {
      await RNFS.unlink(tmpPath);
    } catch {}
  }

  return {from: fromPath, to: toPath};
}

const isResultFile = (name: string) => name.toLowerCase().includes('result');

export const clearFirebaseFolder = async (
  userId: string,
  onSuccess?: () => void,
) => {
  try {
    const uid = auth().currentUser?.uid;

    if (!uid || uid !== userId) throw new Error('Not signed in as this user');

    const folderRef = storage().ref(`recordings/${userId}/devsession-1`);
    const result = await folderRef.listAll();

    // Check if the folder has any files (i.e., it exists logically)
    if (result.items.length === 0) {
      console.log(
        `ℹ️ Folder recordings/${userId}/devsession-1 does not exist or is already empty.`,
      );
      onSuccess?.();
      return;
    }

    // 1) Find session-result.json in this folder
    const sessionResultRef =
      result.items.find(i => i.name === 'session-result.json') ??
      result.items.find(
        i => isResultFile(i.name) && i.name.toLowerCase().endsWith('.json'),
      ) ??
      null;

    let dateFolder = safeDateFolder(new Date().toISOString());
    if (sessionResultRef) {
      try {
        const json = await readJsonFromStoragePath(sessionResultRef.fullPath);
        dateFolder = safeDateFolder(String(json?.date ?? ''));
      } catch {
        // keep fallback dateFolder
      }
    }

    // 2) Read date from session-result.json
    const toCopy = result.items.filter(i => isResultFile(i.name));

    for (const ref of toCopy) {
      const fromPath = ref.fullPath;
      const toPath = `history/${userId}/${dateFolder}/${ref.name}`;
      console.log(`➡️ Copy ${fromPath} -> ${toPath}`);
      await copyFileInStorage(fromPath, toPath);
    }

    // Delete each object (allowed by write rule when request.resource == null)
    await Promise.all(result.items.map(item => item.delete()));
    console.log('✅ Cleared devsession-1');
    onSuccess?.();
  } catch (error) {
    console.error(`❌ Failed to clear folder for user ${userId}:`, error);
  }
};

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

export const finishSession = async (
  userId: string,
  sessionId: string,
  onError?: () => void,
  onSuccess?: () => void,
  opts?: {retries?: number; delayMs?: number; signal?: AbortSignal},
): Promise<FinishSessionResponse> => {
  const retries = opts?.retries ?? 6; // total attempts = retries+1
  const delayMs = opts?.delayMs ?? 5000;
  const externalSignal = opts?.signal;

  const currentUser = auth().currentUser;
  const uid = currentUser?.uid;
  if (!uid || uid !== userId) throw new Error('Not signed in as this user');
  console.log('Finishing session');

  const idToken = await currentUser.getIdToken(true);
  const url = `https://${REGION}-${PROJECT_ID}.cloudfunctions.net/finishSession`;

  let attempt = 0;

  while (true) {
    attempt++;

    // allow per-request abort (15s) + optional external abort
    const controller = new AbortController();
    const onAbort = () => controller.abort();
    externalSignal?.addEventListener('abort', onAbort, {once: true});
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
      const res = await fetch(url, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(<FinishSessionPayload>{
          sessionId,
          runPendingChunks: true,
        }),
      });

      clearTimeout(timeout);
      externalSignal?.removeEventListener('abort', onAbort);

      if (!res.ok) {
        const text = await res.text().catch(() => '');

        // Retry only on 409 "analysis still running"
        const pending =
          res.status === 409 || /Audio analysis still running/i.test(text);

        if (pending && attempt <= retries) {
          console.warn(
            `finishSession pending (attempt ${attempt}/${retries + 1}). Retrying in ${delayMs}ms…`,
          );
          await sleep(delayMs);
          continue;
        }

        // otherwise, fail fast
        throw new Error(
          `finishSession failed: ${res.status} ${text || res.statusText}`,
        );
      }

      // success
      const data: FinishSessionResponse = (await res
        .json()
        .catch(() => ({ok: true}))) as FinishSessionResponse;

      const hasFiles = data.sessionId;

      if (!hasFiles) {
        if (attempt <= retries) {
          console.warn(
            `finishSession OK but no files (attempt ${attempt}/${retries + 1}). Retrying in ${delayMs}ms…`,
          );
          await sleep(delayMs);
          continue;
        }

        // Final attempt and still no files — surface it to user and fail
        Toast.show({type: 'error', text1: 'No files were processed.'});
        throw new Error(
          'finishSession succeeded but returned no data files after all attempts.',
        );
      }

      data
        ? await updateUser(uid, {
            recording: true,
            risk: data.risk || '',
            recording_results:
              data.resultObject ||
              `gs://sleep-scan.firebasestorage.app/recordings/${uid}/devsession-1/session-result.json"`,
            pdf_file: data?.pdfReport?.filePath || '',
          })
        : await updateUser(uid, {
            recording: true,
          });

      store.dispatch(setRecording(true));

      hasFiles
        ? onSuccess?.()
        : Toast.show({
            type: 'error',
            text1: 'No files were processed.',
          });

      return data;
    } catch (e) {
      clearTimeout(timeout);
      externalSignal?.removeEventListener('abort', onAbort);

      // If fetch was aborted by our timeout/external signal, don't loop forever
      if (e as any) {
        if (attempt <= retries) {
          console.warn(
            `finishSession timeout/abort (attempt ${attempt}). Retrying in ${delayMs}ms…`,
          );
          await sleep(delayMs);
          continue;
        }
      }
      console.error('❌ finishSession error:', e);
      onError?.();
      throw e instanceof Error ? e : new Error(String(e));
    }
  }
};

export const uploadAudioToFirebase = async (
  filePath: string,
  fileName: string,
  userId: string,
  onSuccess?: () => void,
): Promise<string> => {
  try {
    if (!filePath || typeof filePath !== 'string') {
      throw new Error(
        `uploadAudioToFirebase: invalid path: ${String(filePath)}`,
      );
    }
    const fileExists = await RNFS.exists(filePath);
    if (!fileExists)
      throw new Error('File does not exist at path: ' + filePath);

    const fileRef = await storage().ref(
      `recordings/${userId}/devsession-1/${fileName}`,
    );

    // ✅ Use putFile for local file uploads (no need for base64 or blob)
    console.log(filePath);
    const task = fileRef.putFile(filePath, {
      contentType: Platform.OS === 'ios' ? 'audio/m4a' : 'audio/wav',
    });

    return new Promise((resolve, reject) => {
      const unsubscribe = task.on(
        'state_changed',
        snap => {
          // if (onProgress && snap.totalBytes > 0) {
          //   onProgress(snap.bytesTransferred / snap.totalBytes);
          // }
        },
        error => {
          unsubscribe();
          reject(error);
          console.error('❌ uploadAudioToFirebase error:', error);
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

            console.log(
              '❌ Failed to get download URL, but upload succeeded:',
              e,
            );
          }
        },
      );
    });
  } catch (err) {
    console.error('❌ Error in uploadAudioToFirebase:', err);
    throw err;
  }
};

export const uploadAudioCalibrationToFirebase = async (
  filePath: string,
  fileName: string,
  userId: string,
  onSuccess?: () => void,
): Promise<string> => {
  try {
    if (!filePath || typeof filePath !== 'string') {
      throw new Error(
        `uploadAudioToFirebase: invalid path: ${String(filePath)}`,
      );
    }
    const fileExists = await RNFS.exists(filePath);
    if (!fileExists)
      throw new Error('File does not exist at path: ' + filePath);

    // const fileRef = await storage().ref(`recordings/${userId}/devsession-1/${fileName}`);
    const fileRef = await storage().ref(`calibration/${userId}/${fileName}`);

    // ✅ Use putFile for local file uploads (no need for base64 or blob)
    console.log(filePath);
    const task = fileRef.putFile(filePath, {
      contentType: Platform.OS === 'ios' ? 'audio/m4a' : 'audio/wav',
    });

    return new Promise((resolve, reject) => {
      const unsubscribe = task.on(
        'state_changed',
        snap => {
          // if (onProgress && snap.totalBytes > 0) {
          //   onProgress(snap.bytesTransferred / snap.totalBytes);
          // }
        },
        error => {
          unsubscribe();
          reject(error);
          console.error('❌ uploadAudioToFirebase error:', error);
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

            console.log(
              '❌ Failed to get download URL, but upload succeeded:',
              e,
            );
          }
        },
      );
    });
  } catch (err) {
    console.error('❌ Error in uploadAudioToFirebase:', err);
    throw err;
  }
};

export const fetchSessionJson = async (uid: string, version: string) => {
  // 1) Ensure we’re authenticated (use your real sign-in; anonymous is just for dev)
  const user = auth().currentUser ?? (await auth().signInAnonymously()).user;
  // 2) Download JSON
  const url = await storage()
    .ref(`recordings/${uid}/devsession-1/${version}.json`)
    .getDownloadURL();
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${uid}`);
  return res.json();
};

const isHttp = (u: string) => /^https?:\/\//i.test(u);
const isGs = (u: string) => /^gs:\/\//i.test(u);
// IMPORTANT: don't treat leading "/" as local; only file:// or content:// are local URIs
const isLocalUri = (u: string) =>
  /^file:\/\//i.test(u) || /^content:\/\//i.test(u);

function guessFileName(input: string, fallback = 'file.pdf') {
  // Try to pull a name from the input (path or URL)
  try {
    if (isHttp(input)) {
      const path = new URL(input).pathname;
      const last = decodeURIComponent(path.split('/').pop() || '');
      if (last) return last.includes('.') ? last : fallback;
    }
  } catch {}
  const last = input.replace(/\/+$/, '').split('/').pop() || '';
  return last && last.includes('.') ? last : fallback;
}

async function toHttpsFromFirebase(input: string): Promise<string> {
  if (isHttp(input)) return input;
  if (isGs(input)) return storage().refFromURL(input).getDownloadURL();
  // Treat everything else as a Firebase Storage path
  const clean = input.replace(/^\//, ''); // support "/reports/..." too
  return storage().ref(clean).getDownloadURL();
}

export async function downloadPdfToDevice(
  input: string, // "reports/…/file.pdf" | "gs://…" | "https://…"
  fileName?: string, // optional; will be guessed from input if omitted
) {
  const {fs, android} = RNBlob;

  // If caller passed a local file/content URI, just copy it to the user-visible location
  if (isLocalUri(input)) {
    const name = fileName || guessFileName(input, 'document.pdf');
    if (Platform.OS === 'android') {
      const dest = `${fs.dirs.DownloadDir}/${name}`;
      await fs.cp(input.replace(/^file:\/\//, ''), dest);
      try {
        android.actionViewIntent(dest, 'application/pdf');
      } catch {}
      return dest;
    } else {
      const dest = `${fs.dirs.DocumentDir}/${name}`;
      await fs.cp(input.replace(/^file:\/\//, ''), dest);
      await Share.open({
        url: 'file://' + dest,
        type: 'application/pdf',
        saveToFiles: true,
        filename: name,
        failOnCancel: false,
      });
      return dest;
    }
  }
  // Resolve Firebase path/gs:// to a signed HTTPS URL
  const url = await toHttpsFromFirebase(input);
  const name = fileName || guessFileName(input, 'document.pdf');

  if (Platform.OS === 'android') {
    const dest = `${fs.dirs.DownloadDir}/${name}`;
    const res = await RNBlob.config({
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        title: name,
        description: 'Downloading PDF…',
        mediaScannable: true,
        mime: 'application/pdf',
        path: dest,
      },
    }).fetch('GET', url); // getDownloadURL() already includes the token, no headers needed
    try {
      android.actionViewIntent(res.path(), 'application/pdf');
    } catch {}
    return res.path();
  } else {
    const dest = `${fs.dirs.DocumentDir}/${name}`;
    const res = await RNBlob.config({path: dest}).fetch('GET', url);
    await Share.open({
      url: 'file://' + res.path(),
      type: 'application/pdf',
      saveToFiles: true,
      filename: name,
      failOnCancel: false,
    });
    return res.path();
  }
}
