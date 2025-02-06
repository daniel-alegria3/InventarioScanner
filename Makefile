
sqlite:
	# npm install @capacitor/core @capacitor/cli
	# npm install @capacitor/android
	# npm install @capacitor-mlkit/barcode-scanning
	# npm install @capacitor-community/sqlite
	# npm install --save-dev vue-sqlite-hook --legacy-peer-deps
	mkdir -p ./public/assets/
	cp -f ./node_modules/sql.js/dist/sql-wasm.wasm ./public/assets/

.PHONY: slite

