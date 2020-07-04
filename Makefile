REPORTER = spec
MOCHA_OPTS = --ui bdd -c --require test/tools/ --check-leaks --timeout 40000
TESTS =  test/tests/**/*.js test/tests/**/**/*.js test/tests/**/**/**/*.js

.PHONY: clean install build test start docker

all:
	NODE_ENV=foo npm install
	export MOCHA_REPORTER_STACK_EXCLUDE=node_modules
	@NODE_ENV=test npm test && cat ./coverage/lcov.info | CODACY_PROJECT_TOKEN=f2472d44026f4b87b514c17d89255ee5 ./node_modules/.bin/codacy-coverage && rm -rf ./coverage

install:
	NODE_ENV=foo npm install

test:
	clear
	[ ! -d 'node_modules' ] && NODE_ENV=foo npm install
	export MOCHA_REPORTER_STACK_EXCLUDE=node_modules
	export CODACY_PROJECT_TOKEN=f2472d44026f4b87b514c17d89255ee5
	@NODE_ENV=test npm test && cat ./coverage/lcov.info | CODACY_PROJECT_TOKEN=f2472d44026f4b87b514c17d89255ee5 ./node_modules/.bin/codacy-coverage && rm -rf ./coverage

start:
	node -r cls-hooked src/server.js || echo '\nStarting ...' && node -r cls-hooked src/server.js

clean:
	@echo '\nRemoving "node_modules"' && rm -fr node_modules

format:
	standard --fix src/**/*.js test/**/*.js

cover:
	clear
	cat ./coverage/lcov.info | CODACY_PROJECT_TOKEN=f2472d44026f4b87b514c17d89255ee5 ./node_modules/.bin/codacy-coverage
