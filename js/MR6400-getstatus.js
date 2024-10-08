'use strict';

const fs = require('fs');
const puppeteer = require('puppeteer');
const gettimestamp = require('./gettimestamp');

const USER = process.env.USER; // router webgui username and password
const PASS = process.env.PASS;
const SCRAPEURL = process.env.SCRAPEURL;

(async () => {

	function listcommandarguments() {
		var result = '';
		for (var i = 0; i < process.argv.length; i++) {
			result += process.argv[i];
		}
		console.log(result);
	}

	const browser = await puppeteer.launch({ headless: true });

	try {

		listcommandarguments();

		const page = await browser.newPage();
		await page.setViewport({ width: 1920, height: 1080 });
		await page.goto(SCRAPEURL);
		await page.type('#userName', USER, { delay: 10 });
		await page.type('#pcPassword', PASS, { delay: 10 });
		await page.click('.loginBtn');   // click by classname loginBtn
		await page.waitForNavigation({ waitUntil: "networkidle2" });
		console.log(new Date());

		var finats = gettimestamp();
		console.log(finats);

		dumpFrameTree(page.mainFrame(), '');

		var fipath = `../app/${finats}-page01.html`;
		fs.writeFileSync(fipath, await page.content());

		await page.pdf({ path: `../app/${finats}-status1.pdf`, format: 'a4' });

		const leftframe = page.frames().find(frame => frame.name() === 'bottomLeftFrame');
		await leftframe.waitForSelector('a[href*="SnmpRpm.htm"]');

		var fipath = `../app/${finats}-leftframe.html`;
		fs.writeFileSync(fipath, await leftframe.content());

		await leftframe.click('a[href*="LanDhcpServerRpm.htm"]');
		await leftframe.click('a[href*="AssignedIpAddrListRpm.htm"]');
		const mainframe = page.frames().find(frame => frame.name() === 'mainFrame');
		await mainframe.waitForNavigation({ waitUntil: "networkidle2" });
		await page.pdf({ path: `../app/${finats}-status2.pdf`, format: 'a4' });
		await page.screenshot({ path: `../app/${finats}-status2.png`, fullPage: true });

		var fipath = `../app/${finats}-dhcp.html`;
		fs.writeFileSync(fipath, await mainframe.content());
	}
	catch (error) {
		console.log(error);
	}
	finally {
		console.log('closing browser');
		await browser.close();
	}

	function dumpFrameTree(frame, indent) {
		console.log(indent + frame.url());
		for (const child of frame.childFrames()) {
			dumpFrameTree(child, indent + '  ');
		}
	}

})();
