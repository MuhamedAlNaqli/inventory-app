# Android keystore + GitHub release setup

One-time setup. Do these steps in order, then every `git push --tags` produces a public APK download on the repo's Releases page.

---

## 1. Generate the keystore (once, on your machine)

The keystore is the cryptographic identity of your app. **You must keep the same keystore for the lifetime of the app** — Android refuses to install an update signed with a different key. Back this file up somewhere safe (password manager, encrypted backup, etc.).

```powershell
# Run from anywhere — output is the .keystore file in the current directory.
keytool -genkeypair -v `
  -keystore inventory-release.keystore `
  -alias inventory `
  -keyalg RSA `
  -keysize 2048 `
  -validity 10000 `
  -storetype PKCS12
```

It will prompt for:

- **Keystore password** — pick a strong one, write it down.
- **Key password** — same as keystore password is fine for simplicity (PKCS12 uses one password anyway).
- **Name / Org / etc.** — fill in or leave blank, doesn't matter for sideloaded APKs.

You now have `inventory-release.keystore` in your current directory.

> The `*.keystore` glob in `.gitignore` prevents accidentally committing it.

---

## 2. Base64-encode the keystore

GitHub secrets only accept text, so encode the binary keystore:

```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("inventory-release.keystore")) | Set-Clipboard
```

The base64 blob is now on your clipboard. Don't paste it into chat — it goes straight into GitHub.

---

## 3. Add 4 secrets in GitHub

Go to: **https://github.com/MuhamedAlNaqli/inventory-app/settings/secrets/actions** → click **New repository secret** for each:

| Secret name                  | Value                                                |
|------------------------------|------------------------------------------------------|
| `ANDROID_KEYSTORE_BASE64`    | Paste the base64 blob from your clipboard            |
| `ANDROID_KEYSTORE_PASSWORD`  | The keystore password you just set                   |
| `ANDROID_KEY_ALIAS`          | `inventory` (matches `-alias` above)                 |
| `ANDROID_KEY_PASSWORD`       | The key password (same as keystore password if you reused it) |

---

## 4. Cut a release

```powershell
git tag v1.0.0
git push origin v1.0.0
```

Within ~10 minutes, the Action finishes and a Release appears at:

**https://github.com/MuhamedAlNaqli/inventory-app/releases/tag/v1.0.0**

The APK is attached as `inventory-app-v1.0.0.apk`. Share that download URL with your users.

---

## 5. Releasing future versions

1. Bump `expo.version` in `app.json` (e.g. `"1.0.0"` → `"1.0.1"`).
2. Bump `expo.android.versionCode` in `app.json` — **must be a higher integer** for Android to accept the update. Add it if it isn't there: `"versionCode": 2`.
3. Commit, then tag with the same version and push:
   ```powershell
   git add app.json
   git commit -m "Release v1.0.1"
   git tag v1.0.1
   git push && git push origin v1.0.1
   ```

Same workflow runs, new APK appears on Releases.

---

## 6. What users do to install

1. Open the Releases link on their Android phone.
2. Download the `.apk`.
3. Tap it. Android will ask: *"For your security, your phone is not allowed to install unknown apps from this source."* → **Settings** → toggle **Allow from this source** for whichever browser they used → back → **Install**.
4. Open. Done.

Updates: same flow — they download the newer APK and tap it.

---

## Troubleshooting

- **Action fails with `Keystore was tampered with, or password was incorrect`** → password secrets don't match what you used in `keytool`. Re-create the secrets.
- **Action fails at `expo prebuild`** → check Node engine warnings; the workflow pins to 20.19.4 which satisfies RN 0.81's requirement.
- **Users get "App not installed" when updating** → almost always means `versionCode` wasn't bumped, OR you accidentally generated a new keystore. Keystore must stay the same.

---

## ⚠️ Lose the keystore = can't ship updates

If you lose `inventory-release.keystore` or its passwords, existing users can never receive an update — they'd have to uninstall and reinstall a fresh app (losing their SQLite data). Back it up:

- Copy the `.keystore` file to an encrypted backup or password manager attachment.
- Store the passwords in your password manager too.
