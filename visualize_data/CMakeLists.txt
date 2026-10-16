cmake_minimum_required(VERSION 4.2)

project(VisualizeTestResData)

add_subdirectory(matplotplusplus)

add_executable(vis_data)
target_sources(vis_data PRIVATE main.cpp)

target_include_directories(vis_data PRIVATE
    ${CMAKE_CURRENT_SOURCE_DIR}    
)
target_link_libraries(vis_data PRIVATE 
    matplot
)