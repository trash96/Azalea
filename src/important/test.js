import { LZString } from "../lib/lzstring";
const azaleaReadOnlyData = JSON.parse(LZString.decompressFromBase64(LZString.decompressFromUTF16(LZString.decompressFromBase64(LZString.decompress('sG8iyGQGsIkEWFEEgG4IDQSAMIQKs6AE0QF3GBbSQIAyBYCQI1WDoA4CM5gw1CCASYOESAbABGAcB4AAxgg5KBoAYKTjAQ4EAtgwBmACRoCEYQCQwAVUBl5IEgFQAJpgEHlAEYOAFIEB3MIABcwCRogABxABJSAycEA5wIAu7QMVVgAR5AXcgAmQLuAgRxbAyMKBjQEDWzoEACwEAWgCaZAW4CBL4sAAGYADnIAADoAHnoAKjoAEooCVQFqAg5aAwASA6RSAw4WAm0eAgASAwBqAqQyADsQAWoARp4AfWIACg4ATwACdgN7DgMKULoCxFYCFIoCMTYCpGYCRgoCRioAnVICJaoDRg4B0xYDEr4DjEoApCIDCIoDimoACgICZqYDbQ4DACIDF1YAq04ARUgDOgASCAIyAFIyAvEOAz4OABcMAGYA6gIASGYBIwIAg+IDBQYBYkoBMI4AwSIDEI4AEiIB/q8AAiSAGdhANCAgF4iwASCoA6nEAYVSAUITAAuMgBIYwDYIIBIKUASlWAAZDAPpSgELsQAREIBLwEATliASltAKCQgE9RQAbRIBNC8AIMiAKELAKdDgBtQwBOEIBD/MAkVCADEzACTYgAEtQBjE4BIw8AvZSAUktAEDUgFKQQBJAYASiUAiO2AIADABEMgB9hQBjAYAALsAFjCAYcXACaegA4BwCSxIAQQMAOlaAT0TACK4gGRIABLgAcnQBinYAshEAUdKALYDAKyPgD5NQCTwIA2qcACUSAOxHAJKMgGC4QAF24ADDMAGOaAWAzAB2kAFZAKU5gC4aQCiMIBgx0ADQWAFBxADFTgCdoQCsRYAAiUAuWWAZCBAFWBgBbjwAku4B8l0A0peAHULAD6ugHcdQCXioBiOcAEZ6APglAOhogAKGQALT4ABoMA/CSAFdHAGxBgF8RwBm/4BIJMALqCAB9PABJigAbRQBgk4BpaMAXqiAXwYAFiAQUzAIJAgE4SQA0EoAsIEAq7WABkPgBTI4AjMCADdSgBbaIA9SOANKEgAMR4AaDKAEnAgCnQYAJD2ACjEgCce4AwjKAJUHgAC7IADkCAKwCgC3iIANMWALD9gDdAgAUoAgRiAICDgBxOoARGeANM8gCCuYAEZCAE0BgCUJoAAnQAABAA==')))));
/*
LZString.compress(LZString.compressToBase64(LZString.compressToUTF16(JSON.stringify({
    "azalea": {
     "file_type": "readonlydata",
     "database_management": {
      "deleteWhenFull": ["default","logs","mail"]
     },
     "database_defaults": {
      "azalea": {
       "azaleaAddedIn": 0
      }
     },
     "database_config": {
      "type": "dynamic-properties-beta",
      "compress": true
     },
     "credits": [
      {
       "name": "ItsDino",
       "description": "Idea Person #1"
      },
      {
       "name": "Zcythe",
       "description": "Idea Person #2"
      }
     ],
     "behavior": {
      "godmode": false,
      "developermode": true
     },
     "experiments": [
      "AzaleaSL1"
     ]
    }
   }))))
*/
// JSON.parse(LZString.decompressFromUTF16(LZString.decompressFromBase64(LZString.decompress())));