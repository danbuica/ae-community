const puppeteer = require('puppeteer');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

async function main() {
    const dirName = process.argv[2];
    if (!dirName) {
        console.error("❌ Usage: node export-animation.js <animation-directory-name> [width] [height] [duration]");
        console.error("   Example: node export-animation.js revenue-counter");
        process.exit(1);
    }

    const fps = 60;

    // Allow overriding width, height, and duration via args:
    // node export-animation.js <name> [width] [height] [duration]
    const width = parseInt(process.argv[3]) || 1920;
    const height = parseInt(process.argv[4]) || 1080;
    const duration = parseInt(process.argv[5]) || 6;

    const totalFrames = fps * duration;

    // This script lives at <group>/scripts/motion/ — the group root is two levels up.
    const groupRoot = path.resolve(__dirname, '../../');
    const outputDir = process.env.MOTION_OUTPUT_DIR || 'motion-animations';
    const absolutePath = path.join(groupRoot, outputDir, dirName, 'index.html');
    const outPath = path.join(groupRoot, outputDir, dirName, 'export-transparent.mov');

    if (!fs.existsSync(absolutePath)) {
        console.error(`❌ HTML file not found at: ${absolutePath}`);
        process.exit(1);
    }

    console.log(`🎬 Exporting: ${dirName}`);
    console.log(`📍 To: ${outPath}`);
    console.log(`📐 Size: ${width}x${height}`);
    console.log(`⏱  Length: ${duration}s @ ${fps}fps (${totalFrames} frames)`);

    console.log("🚀 Launching headless browser...");
    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    // Set viewport based on arguments - keep at 1x scale (1920x1080) for massive performance gains
    const scaleFactor = parseInt(process.env.SCALE) || 1;
    await page.setViewport({ width, height, deviceScaleFactor: scaleFactor });

    // Inject code to pause GSAP before it natively auto-starts
    await page.evaluateOnNewDocument(() => {
        window.__GSAP_LOADED__ = new Promise((resolve) => {
            let chk = setInterval(() => {
                if (window.gsap) {
                    window.gsap.ticker.fps(0); // halt auto-ticking
                    window.gsap.globalTimeline.pause(); // pause all timelines
                    window.gsap.globalTimeline.timeScale(1);
                    clearInterval(chk);
                    resolve(true);
                }
            }, 5);
            // Fallback just in case GSAP isn't used
            setTimeout(() => { clearInterval(chk); resolve(false); }, 3000);
        });
    });

    await page.goto(`file://${absolutePath}`, { waitUntil: 'networkidle0' });

    // Explicitly wait for custom fonts to load so text doesn't look blobby/fallback
    await page.evaluateHandle('document.fonts.ready');

    const hasGsap = await page.evaluate(() => window.__GSAP_LOADED__);

    if (!hasGsap) {
        console.log("ℹ️ GSAP not detected. Intercepting native Web Animations (CSS) instead.");
    } else {
        console.log("✅ Intercepted GSAP. Controlling timeline manually for perfect frames.");
    }

    // Launch FFmpeg
    // Export to Apple ProRes 4444 which gives perfect transparency in Premiere Pro / Final Cut
    const ffmpegArgs = [
        '-y',
        '-f', 'image2pipe',
        '-vcodec', 'png',
        '-r', String(fps),
        '-i', '-', // reads screenshots from stdin
        '-c:v', 'prores_ks',
        '-profile:v', '4444',
        '-pix_fmt', 'yuva444p10le', // Includes Alpha channel explicitly for QuickTime
        outPath
    ];

    const ffmpegProcess = spawn('ffmpeg', ffmpegArgs);

    // Provide visibility into ffmpeg encoding
    ffmpegProcess.stderr.on('data', (data) => console.error(data.toString()));

    console.log("📸 Starting frame capture. This will take a moment...");

    for (let frame = 0; frame <= totalFrames; frame++) {
        const timeInSeconds = frame / fps;

        // Advance the GSAP and native CSS animations carefully frame-by-frame
        await page.evaluate((t) => {
            if (window.gsap && window.gsap.globalTimeline) {
                window.gsap.globalTimeline.time(t);
            }
            // Intercept and advance all native CSS animations precisely
            document.getAnimations().forEach(anim => {
                anim.pause(); // Ensure they aren't free-running in real time
                anim.currentTime = t * 1000;
            });
        }, timeInSeconds);

        const screenshotBuf = await page.screenshot({
            type: 'png',
            omitBackground: true // This ensures the background stays perfectly transparent
        });

        ffmpegProcess.stdin.write(screenshotBuf);

        if (frame % Math.floor(totalFrames / 10) === 0) {
            console.log(`⏳ Progress: ${Math.round((frame / totalFrames) * 100)}% (${frame}/${totalFrames})`);
        }
    }

    ffmpegProcess.stdin.end();

    console.log("⏳ Compressing video file... (Please wait)");
    await new Promise((resolve, reject) => {
        ffmpegProcess.on('close', (code) => {
            if (code === 0) resolve();
            else reject(new Error(`FFmpeg exited with error code ${code}`));
        });
        ffmpegProcess.on('error', reject);
    });

    await browser.close();

    console.log(`\n✅ Export finished perfectly!`);
    console.log(`📂 Your video is ready at: /${outputDir}/${dirName}/export-transparent.mov`);
    console.log(`🔥 Drag and drop this directly into Premiere or Final Cut!`);
}

main().catch(console.error);
