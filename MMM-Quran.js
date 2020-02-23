/*
  MagicMirror² : Quran
  =========================================
  A MagicMirror² Module that shows Al-Quran Verse
  + Integration with Telegram

  Developer : Zulkifli Mohamed (putera)
  E-mail : mr.putera@gmail.com
*/

Module.register("MMM-Quran", {
    defaults:
    {
        showArabic: true, // Show arabic text
        showTranslation: true, // Show translation text
        translationLang: 'ms.basmeih', // translation language - en.yusufali (English), ms.basmeih (Malay) - (full-option at http://api.alquran.cloud/edition)
        updateInterval: 60 * 1000, // How often do you want to fetch and display new verse ? (milliseconds) default: 1 minute
        animationSpeed: 2.5 * 1000, // Speed of the update animation. (Milliseconds)
        hideOnStart: false // Hide the Quran on module started
    },

    currentQuranVerse : "",

    getTranslations: function() {
        return {
            'en': 'translations/en.json',
            'ms-my': 'translations/ms.json'
        };
    },

    // Integration with MMM-TelegramBot
    getCommands: function(commander) {
        commander.add({
            command: 'quranverse',
            description: this.translate("TELEGRAM_BOT_DESC"),
            callback: 'cmd_quranverse'
        });
    },

    cmd_quranverse: function(command, handler) {
        handler.reply("TEXT", this.currentQuranVerse, { parse_mode: 'Markdown' });
    },

    start: function() {
        var self = this;
        self.sendSocketNotification('GET_QURAN', self.config);

        setInterval(function() {
            self.sendSocketNotification('GET_QURAN', self.config);
        }, this.config.updateInterval);
    },

    getStyles: function() {
        return ["css/style.css"];
    },

	getDom: function() {
        var self = this;
        
        var arabic = "";
        var translation = "";
        var numberInSurah = "";
        var surahNameArabic = "";
        var surahNameEnglish = "";
        var txtCurrentQuranVerse = "";

        var wrapper = document.createElement("div");

        if (this.arabic != null && 
            this.translation != null && 
            this.numberInSurah != null && 
            this.surahNameArabic != null && 
            this.surahNameEnglish != null)
        {
            arabic = this.arabic;
            translation = this.translation;
            numberInSurah = this.numberInSurah;
            surahNameArabic = this.surahNameArabic;
            surahNameEnglish = this.surahNameEnglish;

            // Show the Arabic text
            if (self.config.showArabic)
            {
                var txtArabic = document.createElement("div");
                txtArabic.className = "txt-arabic bright medium light";
                txtArabic.innerHTML = arabic;
                wrapper.appendChild(txtArabic);

                txtCurrentQuranVerse += arabic + "\n";
            }

            // Show the translation text
            var txtTranslation = document.createElement("div");
            txtTranslation.className = "txt-translation bright small light";

            var txtSurahName =  surahNameEnglish + " : " + numberInSurah;

            if (self.config.showTranslation) {
                txtTranslation.innerHTML = translation + "<br>(<b>" + txtSurahName + "</b>)";
                txtCurrentQuranVerse += "_" + translation + "_" + "\n(**" + txtSurahName + "**)";
            }
            else
            {
                txtTranslation.innerHTML = translation;
                txtCurrentQuranVerse += translation;
            }
            wrapper.appendChild(txtTranslation);
        }
        else
        {
            wrapper.className = "bright small light";
            wrapper.innerHTML = this.translate("LOADING");
        }

        this.currentQuranVerse = txtCurrentQuranVerse;
        return wrapper;
	},

	socketNotificationReceived: function(notification, payload) {
	    var self = this;
	    if (notification == "QURAN_VERSE")
	    {
            var json = payload;
            this.arabic = json.arabic;
            this.translation = json.translation;
            this.numberInSurah = json.numberInSurah;
            this.surahNameArabic = json.surahNameArabic;
            this.surahNameEnglish = json.surahNameEnglish;
            this.updateDom(self.config.animationSpeed);
	    }
	},

	notificationReceived: function(notification, payload, sender) {
        if (notification === "DOM_OBJECTS_CREATED")
        {
            // Hide when module started
            if (this.config.hideOnStart)
                this.hide();
        }
        else if (notification === "SHOW_QURAN")
        {
            this.show();
        }
        else if (notification === "HIDE_QURAN")
        {
            this.hide();
        }
	}

});
