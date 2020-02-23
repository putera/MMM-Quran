/*
  MagicMirror² : Quran
  =========================================
  A MagicMirror² Module that shows Al-Quran Verse
  + Integration with Telegram

  Developer : Zulkifli Mohamed (putera)
  E-mail : mr.putera@gmail.com
*/

var NodeHelper = require("node_helper");
var request = require('request');
var async = require('async');

module.exports = NodeHelper.create({
    start: function() {
		console.log("[MMM-Quran] : Starting Quran modules...");
	},

    getRandomVerse: function(min, max) {
        var randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        return randomNumber;
    },

    getQuranRequest: function(payload) {
        var self = this;

        var randomVerse = self.getRandomVerse(1, 6236);
        var quranArabicURL = "http://api.alquran.cloud/ayah/" + randomVerse + "/editions/ar";
        var quranTranslationURL = "http://api.alquran.cloud/ayah/" + randomVerse + "/editions/" + payload.translationLang;

        var textArabic = "";
        var textTranslation = "";
        var surahNameArabic = "";
        var surahNameEnglish = ""; // in english
        var surahNameEnglishTranslation = ""; // in english
        var surahNumber = 1;
        var numberInSurah = 1;
        var numberOfVerses = 1;
        var juzNumber = 1;

        async.parallel({
            arabic: function (callback) {
                request({ url: quranArabicURL, method: 'GET' }, function(error, response, body) {
                    callback(error, body);
                });
            },
            translation: function (callback) {
                    request({ url: quranTranslationURL, method: 'GET' }, function(error, response, body) {
                        callback(error, body);
                    });
            }
        }, function (error, result) {
            if (error) {
                console.log("[MMM-Quran] : " + error);
            }

            var resultArabic = JSON.parse(result.arabic), resultTranslation = JSON.parse(result.translation);

            if (resultArabic && resultArabic.data[0])
            {
                textArabic = resultArabic.data[0].text;
                surahNameArabic = resultArabic.data[0].surah.name;
                surahNameEnglish = resultArabic.data[0].surah.englishName;
                surahNameEnglishTranslation = resultArabic.data[0].surah.englishNameTranslation;
                surahNumber = resultArabic.data[0].surah.number;
                numberInSurah = resultArabic.data[0].numberInSurah;
                numberOfVerses = resultArabic.data[0].surah.numberOfAyahs;
                juzNumber = resultArabic.data[0].juz;
            }

            if (resultTranslation && resultTranslation.data[0]) {
                textTranslation = resultTranslation.data[0].text;
            }

            var result = {
                refNumber: randomVerse, 
                arabic: textArabic, 
                translation: textTranslation, 
                surahNameArabic: surahNameArabic, 
                surahNameEnglish: surahNameEnglish, 
                surahNameEnglishTranslation: surahNameEnglishTranslation, 
                surahNumber: surahNumber, 
                numberInSurah: numberInSurah, 
                numberOfVerses: numberOfVerses, 
                juzNumber: juzNumber
            };

            self.sendSocketNotification('QURAN_VERSE', result);
        });
	},

    socketNotificationReceived: function(notification, payload) {
        if (notification === 'GET_QURAN') {
            this.getQuranRequest(payload);
        }
    }
});
