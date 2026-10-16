#pragma once

#include <iostream>
#include <iomanip>
#include <vector>
#include <string>
#include <fstream>
#include <sstream>


struct TimePoin

class CsvData {
private:
    std::vector<T> data;

public: 
    CsvData() {}

    void read_data(char * filename) {

    }

    void draw_results() {
        namespace plt = matplot;

        std::vector<double> x(data.size()), y(data.size()); 

        for (int i = 0; i < create_data.size(); i++) {
            x[i] = data[i].iter;
            y[i] = data[i].time;
        }

        plt::xlabel("iteration");
        plt::ylabel("time");

        plt::plot(x, y)->color("green");
        plt::hold(true);
        plt::plot(x1, y1)->color("red");
        plt::show();
    }
};

