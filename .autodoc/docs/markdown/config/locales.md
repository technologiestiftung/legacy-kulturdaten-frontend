[View code on GitHub](https://github.com/technologiestiftung/kulturdaten-frontend/blob/master/config/locales.ts)

This file contains various constants related to language and locale settings for the kulturdaten-frontend project. 

The `locales` constant is an object that maps each supported locale to its corresponding name in that language. Similarly, the `languages` constant maps each supported language to its corresponding name in that language. These constants can be used to display language and locale options to the user, or to set the default language/locale for the application.

The `contentLanguages` constant is an array of all supported content languages, while `contentLanguagesWithEasy` is an array that includes an additional "easy" language option. These constants can be used to filter and display content based on language settings.

The `languageTranslationKeys` constant maps each supported language (including the "easy" option) to its corresponding translation key. This can be used to retrieve the correct translation for a given language setting.

The `localeLanguageMap` constant maps each supported locale to its corresponding language. This can be used to determine the language setting based on the selected locale.

Finally, the `dateFormatPatternMap` constant is an object that maps each supported date format (date, time, dateTime, dayDateTime) to its corresponding format string for each supported locale. This can be used to format dates and times based on the user's language and locale settings.

Overall, this file provides a centralized location for language and locale-related constants that can be used throughout the kulturdaten-frontend project to ensure consistent and accurate language and date formatting.
## Questions: 
 1. What is the purpose of the `locales` and `languages` objects?
   - The `locales` object maps locale codes to their corresponding names in that language, while the `languages` object maps language codes to their corresponding names in that language.

2. What is the difference between `contentLanguages` and `contentLanguagesWithEasy`?
   - `contentLanguages` is an array of all the supported content languages, while `contentLanguagesWithEasy` is an array that includes an additional language code for "easy" German.

3. What is the `dateFormatPatternMap` object used for?
   - The `dateFormatPatternMap` object maps date format types to their corresponding format patterns for each supported locale.