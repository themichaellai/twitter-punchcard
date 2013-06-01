WATCH_FILES=routes,lib,app.coffee

run:
	coffee app.coffee
monitor:
	supervisor -w $(WATCH_FILES) app.coffee
jshint:
	@jshint public/javascripts

.PHONY: run monitor
