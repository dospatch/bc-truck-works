cmake_minimum_required(VERSION 3.20)
project(BCTruckWorksETS2 LANGUAGES CXX)

if(NOT SCS_SDK_ROOT)
  message(FATAL_ERROR "SCS_SDK_ROOT is required and must point to the SCS Telemetry SDK include directory.")
endif()

add_library(BCTruckWorksETS2 SHARED src/bc_truck_works_ets2.cpp)
target_include_directories(BCTruckWorksETS2 PRIVATE ${SCS_SDK_ROOT})
target_compile_features(BCTruckWorksETS2 PRIVATE cxx_std_17)
target_compile_definitions(BCTruckWorksETS2 PRIVATE WIN32_LEAN_AND_MEAN NOMINMAX)

if(WIN32)
  target_link_libraries(BCTruckWorksETS2 PRIVATE ws2_32)
endif()

set_target_properties(BCTruckWorksETS2 PROPERTIES
  OUTPUT_NAME "BCTruckWorksETS2"
  PREFIX ""
)
