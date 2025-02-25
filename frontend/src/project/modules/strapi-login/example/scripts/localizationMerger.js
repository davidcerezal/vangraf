/*
 Hace un merge de todos los properties definidos en el archivo locConfig
 Todos los keys repetidos salen en consola.
 Se ordenan los keys alfabeticamente
 Los comentarios no entran
 */
const fs = require('fs');

var locConfig = require('../localeConfig.json');

//-----------------------------------------------------------------------------------------------------
function analizeFile(filename, properties, keys) {
	fs.readFileSync(filename).toString().split('\n').forEach(
		function (line) {
			analizeLine(line, properties, keys);
		});
}

function analizeLine(line, properties, keys) {
	if (!line.trim().startsWith("#")) {
		var splitted = line.split('=');
		var key = splitted[0].trim();
		splitted.shift();
		var value = splitted.join('').trim();

		if (properties[key]) {
			console.log('Clave repetida: ' + key + '___Modulo: ' + currentModule);
		}

		if (key && key !== null && key.trim() !== "" && value && value !== null && value.trim() !== "") {
			if (!properties[key]) {
				keys.push(key);
			}
			properties[key] = value;
		}
	}
}

module.exports =
{
	localize: function (webPathRel) {

		for (const currentApp of locConfig.apps) {

			// Create destination folder
			if (!fs.existsSync(webPathRel + currentApp.destination)) {
				fs.mkdirSync(webPathRel + currentApp.destination, { recursive: true });
			}
			var modulesLength = currentApp.modules.length;
			//DEFAULT FILE
			var properties = {};
			var keys = [];
			for (var i = 0; i < modulesLength; i++) {
				currentModule = currentApp.modules[i];
				analizeFile(currentApp.modules[i] + '.properties', properties, keys);
			}

			keys = keys.sort();
			var localizations = {};
			for (var i = 0; i < keys.length; i++) {
				localizations[keys[i]] = properties[keys[i]];
				console.log(localizations);
			}

			try {
				
				fs.writeFileSync(webPathRel + currentApp.destination + 'locale.json', JSON.stringify(localizations));
			} catch (err) {
				console.error(err);
			}

			//LOCALIZED FILES
			for (var j = 0; j < locConfig.langs.length; j++) {
				var lang = locConfig.langs[j];
				var properties = {};
				var keys = [];
				for (var i = 0; i < modulesLength; i++) {
					analizeFile(currentApp.modules[i] + '_' + lang + '.properties', properties, keys);
				}

				keys = keys.sort();
				localizations = {};
				for (var x = 0; x < keys.length; x++) {
					localizations[keys[x]] = properties[keys[x]];
				}

				try {
					fs.writeFileSync(webPathRel + currentApp.destination + 'locale_' + lang + '.json', JSON.stringify(localizations));
				} catch (err) {
					console.error(err);
				}
			}
		}
	}
};
