// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: brown; icon-glyph: user-md;
// v1.1 coded by Saudumm (https://twitter.com/saudumm)
// GitHub: https://github.com/Saudumm/scriptable-sad-covid-pressemitteilungen

// WIDGET CONFIG
var SITE_URL = 'https://corona.landkreis-schwandorf.de';
var SITE_NAME = '🦠 Presse SAD';

// COLOR CONFIG
const BG_GRADIENT = false // Widget Hintergrund; true = Farbverlauf, false = einfarbig
const BG_COLOR = new Color("#1c1c1e");
const BG_GRADIENT_COLOR_TOP = new Color("#222222");
const BG_GRADIENT_COLOR_BTM = new Color("#444444");
const FONT_COLOR_SITENAME = Color.white();
const FONT_COLOR_POST_DATE = Color.gray();
const FONT_COLOR_HEADLINE = Color.white();

// DO NOT CHANGE ANYTHING BELOW!
// Unless you know what you're doing.
// Unlike me, I don't know what I'm doing.
const NUMBER_OF_POSTS = 3;

// JSON URL für Corona Pressemitteilungen (Wordpress Standard)
const JSON_API_URL = SITE_URL+"/wp-json/wp/v2/posts/?filter[category_name]=country&per_page="+NUMBER_OF_POSTS

let widget = await createWidget()

if (!config.runsInWidget) {
	await widget.presentSmall()
}

Script.setWidget(widget)
Script.complete()

async function createWidget(items) {
	const data = await getData()
	const list = new ListWidget()
	
	// Header
	const siteName = list.addText(SITE_NAME.toUpperCase());
	siteName.font = Font.mediumMonospacedSystemFont(13);
	siteName.textColor = FONT_COLOR_SITENAME;
	
	list.addSpacer();
	
	if (data) {
		let arrStackRow = [];
		arrStackRow.length = NUMBER_OF_POSTS;
		let arrStackCol = [];
		arrStackCol.length = NUMBER_OF_POSTS;
		let arrLblPostDateTime = [];
		arrLblPostDateTime.length = NUMBER_OF_POSTS;
		let arrLblPostHeadline = [];
		arrLblPostHeadline.length = NUMBER_OF_POSTS;
		
		let i;
		for (i = 0; i < NUMBER_OF_POSTS; i++) {
			arrStackRow[i] = list.addStack();
			arrStackRow[i].layoutHorizontally();
			
			arrStackCol[i] = arrStackRow[i].addStack();
			arrStackCol[i].layoutVertically();
			
			arrLblPostDateTime[i] = arrStackCol[i].addText(convertDateString(data.arrNewsDateTimes[i]));
			arrLblPostDateTime[i].font = Font.heavyMonospacedSystemFont(11);
			arrLblPostDateTime[i].textColor = FONT_COLOR_POST_DATE;
			arrLblPostDateTime[i].lineLimit = 1
			arrLblPostDateTime[i].minimumScaleFactor = 0.5
			
			arrLblPostHeadline[i] = arrStackCol[i].addText(data.arrNewsTitles[i]);
			arrLblPostHeadline[i].font = Font.boldMonospacedSystemFont(11);
			arrLblPostHeadline[i].textColor = FONT_COLOR_HEADLINE;
			arrLblPostHeadline[i].lineLimit = 2;

			if (i < NUMBER_OF_POSTS-1) {
				list.addSpacer();
			}
		}
	} else {
		const error_msg = list.addText("Keine Daten gefunden");
		error_msg.font = Font.regularMonospacedSystemFont(12);
        error_msg.textColor = FONT_COLOR_HEADLINE;
	}
		
	if (BG_GRADIENT == true) {
		const gradient = new LinearGradient();
		gradient.locations = [0, 1];
		gradient.colors = [BG_GRADIENT_COLOR_TOP, BG_GRADIENT_COLOR_BTM];
		list.backgroundGradient = gradient;
	} else {
        list.backgroundColor = BG_COLOR;
    }
	
	list.url = "https://corona.landkreis-schwandorf.de/pressemitteilungen";
	
	return list;
}

async function getData() {
	try {
		let loadedJSON = await new Request(JSON_API_URL).loadJSON();
		
		let arrNewsDateTimes = [];
		arrNewsDateTimes.length = NUMBER_OF_POSTS;
		let arrNewsTitles = [];
		arrNewsTitles.length = NUMBER_OF_POSTS;

		if (NUMBER_OF_POSTS >= 1) {
			let i;
			for (i = 0; i < NUMBER_OF_POSTS; i++) {
				arrNewsDateTimes[i] = loadedJSON[i].date;
				
				arrNewsTitles[i] = loadedJSON[i].title.rendered;
				arrNewsTitles[i] = formatHeadline(arrNewsTitles[i]);
				arrNewsTitles[i] = /:\s(.+)/.exec(arrNewsTitles[i])[1];
			}
		}
		
		const result = {
			arrNewsDateTimes: arrNewsDateTimes,
			arrNewsTitles: arrNewsTitles
		};
		
		return result;
	} catch (e) {
		return null;
	}
}

function formatHeadline(strHeadline) {
	strHeadline = strHeadline.replace("&quot;", '"');
	strHeadline = strHeadline.replace("&amp;", "&");
	strHeadline = strHeadline.replace("&lt;", "<");
	strHeadline = strHeadline.replace("&gt;", ">");
	strHeadline = strHeadline.replace("&#034;", '"');
	strHeadline = strHeadline.replace("&#038;", "&");
	strHeadline = strHeadline.replace("&#060;", "<");
	strHeadline = strHeadline.replace("&#062;", ">");
	strHeadline = strHeadline.replace("&#338;", "Œ");
	strHeadline = strHeadline.replace("&#339;", "œ");
	strHeadline = strHeadline.replace("&#352;", "Š");
	strHeadline = strHeadline.replace("&#353;", "š");
	strHeadline = strHeadline.replace("&#376;", "Ÿ");
	strHeadline = strHeadline.replace("&#710;", "ˆ");
	strHeadline = strHeadline.replace("&#732;", "˜");
	strHeadline = strHeadline.replace("&#8211;", "–");
	strHeadline = strHeadline.replace("&#8212;", "—");
	strHeadline = strHeadline.replace("&#8216;", "‘");
	strHeadline = strHeadline.replace("&#8217;", "’");
	strHeadline = strHeadline.replace("&#8218;", "‚");
	strHeadline = strHeadline.replace("&#8220;", "“");
	strHeadline = strHeadline.replace("&#8221;", "”");
	strHeadline = strHeadline.replace("&#8222;", "„");
	strHeadline = strHeadline.replace("&#8224;", "†");
	strHeadline = strHeadline.replace("&#8225;", "‡");
	strHeadline = strHeadline.replace("&#8240;", "‰");
	strHeadline = strHeadline.replace("&#8249;", "‹");
	strHeadline = strHeadline.replace("&#8250;", "›");
	strHeadline = strHeadline.replace("&#8364;", "€");
	
	return strHeadline;
}

function convertDateString(strDate) {
	let date_conv = new Date(strDate);
	let dateTimeLocal = date_conv.toLocaleString([], {year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'})
	return dateTimeLocal
}
