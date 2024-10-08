'use strict';

const fs = require('fs');
const puppeteer = require('puppeteer');
const gettimestamp = require('./gettimestamp');

const USER = process.env.USER; // router webgui username and password
const PASS = process.env.PASS;
const SCRAPEURL = process.env.SCRAPEURL;


function makefilename ( dir, postfix ) {
	 var finats = gettimestamp();
	 var filepath;
	 filepath = `${dir}/${finats}${postfix}`
	 console.log(filepath);
	 return filepath;
}

(async () => {

 const browser = await puppeteer.launch({headless:true});
 //const browser = await puppeteer.launch({headless:false, args: [`--window-size=1080,720`]});

try {	  

	  const page = await browser.newPage();
	  await page.setViewport({width: 1080, height: 720})
	  await page.goto('http://192.168.1.1/');
	  await page.type('#userName', USER, { delay: 10 });
	  await page.type('#pcPassword', PASS, { delay: 10 });
	  await page.click('.loginBtn');  
	  await page.waitForNavigation({waitUntil:"networkidle2"});
	  const leftframe = page.frames().find(frame => frame.name() === 'bottomLeftFrame');
	  
	  await page.pdf({ path: makefilename('../app', 'rebo01.pdf') , format: 'a4' });
	  
	  await leftframe.click('a[href*="SnmpRpm.htm"]');
	  await leftframe.click('a[href*="SysRebootRpm.htm"]');
 	  const mainframe = page.frames().find(frame => frame.name() === 'mainFrame');
	  await mainframe.waitForSelector('#reboot');  // wait for frame loading

	  page.on('dialog', async dialog => {
	   console.log('Popup appeared');
	   
	   await new Promise(r => setTimeout(r, 200));
		//await page.screenshot({path: 'dialog01.png', fullPage: true});
		await dialog.accept();
		//await dialog.dismiss();
	   });
      //await new Promise(r => setTimeout(r, 200));
	  await page.screenshot({path: makefilename('../app', 'rebo02.png'), fullPage: true}); 

	  await mainframe.click('#reboot.buttonBig'); // click selector with id reboot and class buttonBig
	  
	  await new Promise(r => setTimeout(r, 600));
	  await page.screenshot({path: makefilename('../app', 'rebo03.png'), fullPage: true});
  	  	 
	}
  catch (error) {
  console.log(error);
  }  
finally {
  console.log('closing browser');
  await browser.close();  
}  
  
})();

