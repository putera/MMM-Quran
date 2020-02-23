# MagicMirror² : Quran
A MagicMirror² Module that shows Al-Quran verses

![Screenshot](https://raw.githubusercontent.com/putera/MMM-Quran/master/screenshot.png)

## Installation
1. Navigate into your MagicMirror's `modules` folder
2. Execute `git clone https://github.com/putera/MMM-Quran.git`
3. Run `npm install async`

## Using the module
To use this module, add it to the modules array in the `config/config.js` file:

```javascript
modules: [
    {
        module: 'MMM-Quran',
        config: {
            // See 'Configuration options' for more information.
            // remove the lights parameter if you want to control all the lights on the network
            showArabic: true,
			showTranslation: true,
			translationLang: 'ms.basmeih', // en.yusufali (English), ms.basmeih (Malay)
			updateInterval: 60 * 1000, // milliseconds
			hideOnStart: false // Hide Quran on module started
        }
    }
]
```

## Configuration Options
The following properties can be configured:

| **Option** | **Description** |
| --- | --- |
| `showArabic` | Show the Arabic verse |
| `showTranslation` | Show the translation text |
| `translationLang` | Translation text languages |
| `updateInterval` | How ofter to get new verse ? (milliseconds) |
| `hideOnStart` | Hide the Quran verse when module started |


## Dependencies
- Access to the internet to download verse from http://api.alquran.cloud
