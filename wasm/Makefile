CPP_BIN=em++
ENV_FLAGS=ONLY_FORCED_STDLIBS=1
PRE_JS=
POST_JS=--post-js plan_transfers.post.js
# JS_SETTINGS=-s "EXTRA_EXPORTED_RUNTIME_METHODS=['ccal', 'cwrap']" -s ERROR_ON_UNDEFINED_SYMBOLS=0
JS_SETTINGS=-s ERROR_ON_UNDEFINED_SYMBOLS=0
CPP_FLAGS=-std=c++17 -O3
FLAGS=$(POST_JS) $(CPP_FLAGS) $(JS_SETTINGS)

SOURCES=plan_transfers.cpp $(wildcard ../plan_transfer*.cpp)
OUTPUT=plan_transfers.js

all:
	$(ENV_FLAGS) $(CPP_BIN) $(SOURCES) -o $(OUTPUT) $(FLAGS)
