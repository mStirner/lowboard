#include <stdio.h>
#include <stdbool.h>
#include <signal.h>

bool running = false;
int buffer[60 * 3] = {0};

/**
 * Listen for signals
 */
void sigfunc(int sig)
{
    printf("Signal received");
    running = false;
}

/**
 * main func
 */
int main(int argc, char *argv[])
{

    // handle signal
    signal(SIGINT, sigfunc);
    signal(SIGTERM, sigfunc);

    // led 1
    buffer[0] = 255;
    buffer[1] = 255;
    buffer[2] = 255;

    // LED 60
    buffer[178] = 255;
    buffer[179] = 255;
    buffer[180] = 255;

    //fwrite(buffer, sizeof(char), sizeof(buffer), stderr);
    fwrite(buffer, sizeof(int), sizeof(buffer), stdout);

    return 0;
}
