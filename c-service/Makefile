CC      = gcc
CFLAGS  = -Wall -Wextra -O2 -std=c11 -Iinclude
TARGET  = lindajamii-service
SRC     = src/main.c

.PHONY: all clean run

all: $(TARGET)

$(TARGET): $(SRC)
	$(CC) $(CFLAGS) -o $(TARGET) $(SRC)

run: all
	./$(TARGET)

clean:
	rm -f $(TARGET)
