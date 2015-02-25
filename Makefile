all : test

.PHONY : all test jshint david mocha istanbul dist

BINDIR=node_modules/.bin

MOCHA=$(BINDIR)/_mocha
ISTANBUL=$(BINDIR)/istanbul
JSHINT=$(BINDIR)/jshint
DAVID=$(BINDIR)/david
LJS=$(BINDIR)/ljs

test : jshint mocha istanbul david

jshint :
	$(JSHINT) rc4.js

david :
	$(DAVID)

mocha :
	$(MOCHA) --reporter=spec test

istanbul :
	$(ISTANBUL) cover $(MOCHA) test
	$(ISTANBUL) check-coverage --statements 100 --branches 100 --functions 100 --lines 100

dist : test
	git clean -fdx -e node_modules
