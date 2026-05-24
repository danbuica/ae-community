const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

// Quick QA helper: grab a single PNG frame from the middle of an animation
// so you can eyeball layout/typography without running a full export.
//
// Usage: node test-screenshot.js <animation-directory-name> [seconds]
//   node test-screenshot.js revenue-counter 2.5

async function test() {
    const dirName = process.argv[2];
    if (!dirName) {
        console.error("❌ Usage: node test-screenshot.js <animation-directory-name> [seconds]");
        process.exit(1);
    }
    const atSeconds = parseFloat(process.argv[3]) || 2.5;

    const groupRoot = path.resolve(__dirname, '../../');
    const outputDir = process.env.MOTION_OUTPUT_DIR || 'motion-animations';
    const absolutePath = path.join(groupRoot, outputDir, dirName, 'index.html');

    if (!fs.existsSync(absolutePath)) {
        console.error(`❌ HTML file not found at: ${absolutePath}`);
        process.exit(1);
    }

    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });

    await page.goto(`file://${absolutePath}`, { waitUntil: 'networkidle0' });
    await page.evaluateHandle('document.fonts.ready');

    // Advance both GSAP and native CSS animations to the requested time
    await page.evaluate((t) => {
        if (window.gsap && window.gsap.globalTimeline) {
            window.gsap.globalTimeline.time(t);
        }
        document.getAnimations().forEach(anim => {
            anim.pause();
            anim.currentTime = t * 1000;
        });
    }, atSeconds);

    const outFile = path.join(groupRoot, outputDir, dirName, 'test-screenshot.png');
    await page.screenshot({ path: outFile, type: 'png', omitBackground: true });
    console.log(`Screenshot saved to: ${outFile}`);
    await browser.close();
}

test();
