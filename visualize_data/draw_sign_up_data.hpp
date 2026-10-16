#pragma once

#include <iostream>
#include <iomanip>
#include <vector>
#include <string>
#include <fstream>
#include <sstream>

struct TimePoint {
    int iter;
    double time;
};

class SignUpData {
private:
    std::vector<TimePoint> create_data;
    std::vector<TimePoint> touch_data;

public: 
    SignUpData() {}

    void read_create_users_data(bool print = true) {
        std::fstream fin;
        fin.open("create_users_time.csv");

        std::vector<std::string> row;
        std::string line, word, headers;

        fin >> headers;
        // Print headers
        if (print) {
            std::stringstream s(headers);
            while(getline(s, word, ',')) {
                std::cout << std::setw(8) << word << " ";
            } std::cout << std::endl;
        }

        while (fin >> line) {
            row.clear();

            std::stringstream s(line);

            while(getline(s, word, ',')) {
                row.push_back(word);
            }

            // Print elements
            if (print) {
                for (auto &ele: row) {
                    std::cout << std::setw(8) << std::setprecision(8) << ele << " ";
                } std::cout << std::endl;
            }

            create_data.push_back(
                TimePoint {std::stoi(row[0]), std::stod(row[1])}
            );
        }
    }

    void read_touch_users_data(bool print = true) {
        std::fstream fin;
        fin.open("touch_users_time.csv");

        std::vector<std::string> row;
        std::string line, word, headers;

        fin >> headers;
        // Print headers
        if (print) {
            std::stringstream s(headers);
            while(getline(s, word, ',')) {
                std::cout << std::setw(8) << word << " ";
            } std::cout << std::endl;
        }

        while (fin >> line) {
            row.clear();

            std::stringstream s(line);

            while(getline(s, word, ',')) {
                row.push_back(word);
            }

            // Print elements
            if (print) {
                for (auto &ele: row) {
                    std::cout << std::setw(8) << std::setprecision(8) << ele << " ";
                } std::cout << std::endl;
            }

            touch_data.push_back(
                TimePoint {std::stoi(row[0]), std::stod(row[1])}
            );
        }
    }

    void draw_results() {
        namespace plt = matplot;

        std::vector<double> x(create_data.size()), y(create_data.size()); 
        std::vector<double> x1(touch_data.size()), y1(touch_data.size());

        for (int i = 0; i < create_data.size(); i++) {
            x[i] = create_data[i].iter;
            y[i] = create_data[i].time;
        }
    
        for (int i = 0; i < create_data.size(); i++) {
            x1[i] = touch_data[i].iter;
            y1[i] = touch_data[i].time;
        }

        plt::xlabel("iteration");
        plt::ylabel("time");

        plt::plot(x, y)->color("green");
        plt::hold(true);
        plt::plot(x1, y1)->color("red");
        plt::show();
    }
};

