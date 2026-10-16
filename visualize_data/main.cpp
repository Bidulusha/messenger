#include <matplot/matplot.h>
#include <draw_sign_up_data.hpp>

int main() {
    SignUpData sup_data;
    sup_data.read_create_users_data(false);
    sup_data.read_touch_users_data(false);
    sup_data.draw_results();

    return 0;
}