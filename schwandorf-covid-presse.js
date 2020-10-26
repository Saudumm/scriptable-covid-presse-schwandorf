// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: brown; icon-glyph: user-md;

// WIDGET CONFIG
const BACKGROUND_GRADIENT = true // Widget Hintergrund; true = Farbverlauf, false = einfarbig

// COLOR CONFIG
const BACKGROUND_COLOR = "#0079e0" // Wird verwendet wenn BACKGROUND_GRADIENT = false
const BACKGROUND_GRADIENT_COLOR_TOP = "#48484a" // Farbverlauf Farbe oben
const BACKGROUND_GRADIENT_COLOR_BTM = "#2c2c2e" // Farbverlauf Farbe unten

// JSON URL für Corona Pressemitteilungen (Wordpress Standard)
const SAD_CORONA_PRESSE_URL = "https://corona.landkreis-schwandorf.de/wp-json/wp/v2/posts"

let widget = await createWidget()
if (BACKGROUND_GRADIENT == false) {
    widget.backgroundColor = new Color(BACKGROUND_COLOR)
}

if (!config.runsInWidget) {
    await widget.presentSmall()
}

Script.setWidget(widget)
Script.complete()

async function createWidget(items) {
    const data = await getData()
    const list = new ListWidget()
    
    // Header
    const header = list.addText('🦠 Presse SAD'.toUpperCase())
    header.font = Font.systemFont(13)
    list.addSpacer()
    
    if (data) {
        // Datum und Schlagzeile (kurz) der ersten News
        const label1Date = list.addText(convertDateString(data.firstNewsDate))
        label1Date.font = Font.boldSystemFont(11)
        const label1News = list.addText(data.firstNewsTitle.substring(0, 19)+"...")
        label1News.font = Font.systemFont(10)
       
        list.addSpacer()

        // Datum und Schlagzeile (kurz) der zweiten News
        const label2Date = list.addText(convertDateString(data.secondNewsDate))
        label2Date.font = Font.boldSystemFont(11)
        const label2News = list.addText(data.secondNewsTitle.substring(0, 19)+"...")
        label2News.font = Font.systemFont(10)
        
        list.addSpacer()

        // Datum und Schlagzeile (kurz) der dritten News
        const label3Date = list.addText(convertDateString(data.thirdNewsDate))
        label3Date.font = Font.boldSystemFont(11)
        const label3News = list.addText(data.thirdNewsTitle.substring(0, 19)+"...")
        label3News.font = Font.systemFont(10)
    } else {
        const error_msg = list.addText("Keine Daten gefunden")
        error_msg.font = Font.systemFont(10)
    }
    
    if (BACKGROUND_GRADIENT == true) {
        const gradient = new LinearGradient()
        gradient.locations = [0, 1]
        gradient.colors = [
            new Color(BACKGROUND_GRADIENT_COLOR_TOP),
            new Color(BACKGROUND_GRADIENT_COLOR_BTM)
        ]
        list.backgroundGradient = gradient
    }
    
    return list
}


async function getData() {
    try {
        let loadedJSON = await new Request(SAD_CORONA_PRESSE_URL).loadJSON();
        
        var firstNewsTitle = loadedJSON[0].title.rendered;
        firstNewsTitle = firstNewsTitle.replace("&#8211;", "-");
        firstNewsTitle = /:\s(.+)/.exec(firstNewsTitle)[1];
        
        var secondNewsTitle = loadedJSON[1].title.rendered;
        secondNewsTitle = secondNewsTitle.replace("&#8211;", "-");
        secondNewsTitle = /:\s(.+)/.exec(secondNewsTitle)[1];
        
        var thirdNewsTitle = loadedJSON[2].title.rendered;
        thirdNewsTitle = thirdNewsTitle.replace("&#8211;", "-");
        thirdNewsTitle = /:\s(.+)/.exec(thirdNewsTitle)[1];
        
        var firstNewsDate = loadedJSON[0].date;
        var secondNewsDate = loadedJSON[1].date;
        var thirdNewsDate = loadedJSON[2].date;

        const result = {
            firstNewsTitle: firstNewsTitle,
            secondNewsTitle: secondNewsTitle,
            thirdNewsTitle: thirdNewsTitle,
            firstNewsDate: firstNewsDate,
            secondNewsDate: secondNewsDate,
            thirdNewsDate: thirdNewsDate
        };
        return result;
    } catch (e) {
        return null;
    }
}

function convertDateString(strDate) {
    var date_conv = new Date(strDate)
    const date = ('0' + date_conv.getDate()).slice(-2);
    const month = ('0' + (date_conv.getMonth() + 1)).slice(-2);
    const year = date_conv.getFullYear();
    const hours = ('0' + date_conv.getHours()).slice(-2);
    const minutes = ('0' + date_conv.getMinutes()).slice(-2);
    //const seconds = ('0' + date_news1.getSeconds()).slice(-2);
    return `${date}.${month}.${year} - ${hours}:${minutes}`;
}
