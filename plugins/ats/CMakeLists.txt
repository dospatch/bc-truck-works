cmake_minimum_required(VERSION 3.20)
project(BCTruckWorksATS LANGUAGES CXX)

if(NOT SCS_SDK_ROOT)
  message(FATAL_ERROR "SCS_SDK_ROOT is required and must point to the SCS Telemetry SDK include directory.")
endif()

add_library(BCTruckWorksATS SHARED src/bc_truck_works_ats.cpp)

target_include_directories(BCTruckWorksATS PRIVATE
  ${SCS_SDK_ROOT}
)

target_compile_features(BCTruckWorksATS PRIVATE cxx_std_17)
target_compile_definitions(BCTruckWorksATS PRIVATE WIN32_LEAN_AND_MEAN NOMINMAX)

if(WIN32)
  target_link_libraries(BCTruckWorksATS PRIVATE ws2_32)
endif()

set_target_properties(BCTruckWorksATS PROPERTIES
  OUTPUT_NAME "BCTruckWorksATS"
  PREFIX ""
)
