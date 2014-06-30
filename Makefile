all : test

.PHONY : all test jshint mocha istanbul dist

BINDIR=node_modules/.bin

MOCHA=$(BINDIR)/_mocha
ISTANBUL=$(BINDIR)/istanbul
JSHINT=$(BINDIR)/jshint
LJS=$(BINDIR)/ljs

test : jshint mocha istanbul

jshint :
	$(JSHINT) rc4.js

mocha : 
	$(MOCHA) --reporter=spec test

istanbul :
	$(ISTANBUL) cover $(MOCHA) test
	$(ISTANBUL) check-coverage --statements 100 --branches 100 --functions 100 --lines 100

dist : test
	git clean -fdx -e node_modules
