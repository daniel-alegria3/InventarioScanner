phone:
	npm run build
	npx cap sync android
	./android/gradlew assembleDebug -p ./android/
	adb install ./android/app/build/outputs/apk/debug/app-debug.apk

update_sqlite:
	mkdir -p ./public/assets/
	cp -f ./node_modules/sql.js/dist/sql-wasm.wasm ./public/assets/

.PHONY: update_sqlite
