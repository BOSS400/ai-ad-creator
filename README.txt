AI AD CREATOR — MVP 0.1

WHAT WORKS
- Mobile-first product ad interface
- Upload a product image from your phone
- Product name, price, benefit, audience, and link fields
- Template-based ad script and caption generation (no AI API required)
- Browser text-to-speech voiceover where supported
- Animated vertical 9:16 canvas preview
- Export animated video using browser MediaRecorder (usually WebM, not guaranteed MP4)
- Installable PWA manifest and service worker when hosted over HTTPS

IMPORTANT LIMITATIONS
- This is a free prototype, not yet a full generative-AI system.
- Copy is template-generated, not produced by a language model.
- Voice availability depends on Android/browser speech synthesis support.
- Video export support varies. Chrome on Android is recommended.
- Most browsers export WebM rather than MP4; convert to MP4 if the social platform requires it.
- The first version animates the uploaded photo; it does not generate new video scenes.
- For PWA installation, deploy to a secure HTTPS host (e.g. Netlify) and open the site in Chrome.
- Local file:// opening may disable service workers and install prompts.

QUICK START
1. Extract the ZIP.
2. Upload the contents (index.html, app.js, styles.css, manifest.json, icon.svg, sw.js) to a static HTTPS host such as Netlify.
3. Open the HTTPS URL in Chrome on Android.
4. Add the site to the home screen from Chrome's menu.
5. Upload a product photo, fill details, tap Generate ad copy, test voice, then Preview animation or Create video.

NEXT BUILD
- Better script generation through an optional AI API
- Multiple visual templates and transition effects
- Choose voice, music, and subtitle timing
- MP4 export path
- Project saving and product link presets
