
sqlite:
	# npm install --save @capacitor-community/sqlite@latest
	# npm install --save-dev vue-sqlite-hook --legacy-peer-deps
	mkdir -p ./public/assets/
	cp -f ./node_modules/sql.js/dist/sql-wasm.wasm ./public/assets/

.PHONY: slite

