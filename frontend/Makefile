.DEFAULT_GOAL := run

install:
	npm install


build:
	npm run build

build-static:
	npm run build-static

build-apk:
	npx next build && npx cap sync android && cd android && export JAVA_HOME="C:/Program Files/Eclipse Adoptium/jdk-21.0.11.10-hotspot" && ./gradlew assembleDebug && echo "APK built! → .mobile-outputs/vocab-adventure.apk" && cp app/build/outputs/apk/debug/app-debug.apk ../.mobile-outputs/vocab-adventure.apk

build-ios:
	npx next build && npx cap sync ios && cd ios && xcodebuild -workspace App.xcworkspace -scheme App -configuration Release -derivedDataPath ../.mobile-outputs/ios-build

runserver:
	npm run dev


run: runserver

diff-staged:
	git diff --cached > ./a.diff
	code ./a.diff
	rm ./a.diff

diff+: diff-staged


diff-unstaged:
	git diff > ./a.diff
	code ./a.diff
	rm ./a.diff

diff: diff-unstaged


wiff:
	dit diff > ./a.diff
	windsurf ./a.diff
	rm ./a.diff


wiff+:
	git diff --cached > ./a.diff
	windsurf ./a.diff
	rm ./a.diff
