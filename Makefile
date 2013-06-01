WATCH_FILES=routes,lib,app.coffee

run:
	coffee app.coffee
monitor:
	supervisor -w $(WATCH_FILES) app.coffee

.PHONY: run monitor
