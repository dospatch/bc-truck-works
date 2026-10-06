#define WIN32_LEAN_AND_MEAN
#define NOMINMAX

#include <winsock2.h>
#include <windows.h>

#include <atomic>
#include <cmath>
#include <cstdio>
#include <cstring>
#include <string>
#include <thread>

#include "scssdk_telemetry.h"
#include "eurotrucks2/scssdk_eut2.h"
#include "eurotrucks2/scssdk_telemetry_eut2.h"

#pragma comment(lib, "Ws2_32.lib")

namespace {

std::atomic<float> g_speed{0.0f};
std::atomic<float> g_fuel{0.0f};
std::atomic<float> g_odometer{0.0f};
std::atomic<double> g_x{0.0};
std::atomic<double> g_y{0.0};
std::atomic<double> g_z{0.0};
std::atomic<bool> g_paused{true};
std::atomic<bool> g_running{false};

SOCKET g_server = INVALID_SOCKET;
std::thread g_http_thread;
scs_log_t g_game_log = nullptr;

void log_message(const char* message)
{
    if (g_game_log) {
        g_game_log(SCS_LOG_TYPE_message, message);
    }
}

void store_float(const scs_string_t, const scs_u32_t, const scs_value_t* value, const scs_context_t context)
{
    if (!value || !context || value->type != SCS_VALUE_TYPE_float) {
        return;
    }
    *static_cast<std::atomic<float>*>(context) = value->value_float.value;
}

void store_dplacement(const scs_string_t, const scs_u32_t, const scs_value_t* value, const scs_context_t context)
{
    if (!value || !context || value->type != SCS_VALUE_TYPE_dplacement) {
        return;
    }

    const auto* placement = &value->value_dplacement;
    g_x = placement->position.x;
    g_y = placement->position.y;
    g_z = placement->position.z;
}

void send_response(SOCKET client, const std::string& body)
{
    const std::string response =
        "HTTP/1.1 200 OK\r\n"
        "Content-Type: application/json; charset=utf-8\r\n"
        "Access-Control-Allow-Origin: *\r\n"
        "Cache-Control: no-store\r\n"
        "Content-Length: " + std::to_string(body.size()) +
        "\r\nConnection: close\r\n\r\n" + body;

    send(client, response.c_str(), static_cast<int>(response.size()), 0);
}

std::string telemetry_json()
{
    char buffer[1024];
    std::snprintf(
        buffer,
        sizeof(buffer),
        "{\"game\":\"ETS2\",\"speed\":%.3f,\"fuel\":%.3f,\"odometer\":%.3f,"
        "\"position\":{\"x\":%.3f,\"y\":%.3f,\"z\":%.3f},\"paused\":%s}",
        (g_speed.load() * 3.6f),
        g_fuel.load(),
        g_odometer.load(),
        g_x.load(),
        g_y.load(),
        g_z.load(),
        g_paused.load() ? "true" : "false"
    );
    return buffer;
}

void http_loop()
{
    while (g_running) {
        SOCKET client = accept(g_server, nullptr, nullptr);
        if (client == INVALID_SOCKET) {
            if (g_running) {
                continue;
            }
            break;
        }

        char request[2048]{};
        recv(client, request, sizeof(request) - 1, 0);

        if (std::strncmp(request, "GET /api/ets2/telemetry", 23) == 0 ||
            std::strncmp(request, "GET /api/ets2/telemetry", 22) == 0 ||
            std::strncmp(request, "GET /health", 10) == 0) {
            send_response(client, telemetry_json());
        } else {
            const std::string body = "{\"error\":\"not_found\"}";
            const std::string response =
                "HTTP/1.1 404 Not Found\r\n"
                "Content-Type: application/json; charset=utf-8\r\n"
                "Content-Length: " + std::to_string(body.size()) +
                "\r\nConnection: close\r\n\r\n" + body;
            send(client, response.c_str(), static_cast<int>(response.size()), 0);
        }

        closesocket(client);
    }
}

bool start_http_server()
{
    WSADATA wsa{};
    if (WSAStartup(MAKEWORD(2, 2), &wsa) != 0) {
        return false;
    }

    g_server = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
    if (g_server == INVALID_SOCKET) {
        WSACleanup();
        return false;
    }

    sockaddr_in address{};
    address.sin_family = AF_INET;
    address.sin_addr.s_addr = htonl(INADDR_LOOPBACK);
    address.sin_port = htons(25555);

    if (bind(g_server, reinterpret_cast<sockaddr*>(&address), sizeof(address)) == SOCKET_ERROR) {
        closesocket(g_server);
        g_server = INVALID_SOCKET;
        WSACleanup();
        return false;
    }

    if (listen(g_server, 4) == SOCKET_ERROR) {
        closesocket(g_server);
        g_server = INVALID_SOCKET;
        WSACleanup();
        return false;
    }

    g_running = true;
    g_http_thread = std::thread(http_loop);
    return true;
}

void stop_http_server()
{
    g_running = false;

    if (g_server != INVALID_SOCKET) {
        shutdown(g_server, SD_BOTH);
        closesocket(g_server);
        g_server = INVALID_SOCKET;
    }

    if (g_http_thread.joinable()) {
        g_http_thread.join();
    }

    WSACleanup();
}

} // namespace

SCSAPI_RESULT scs_telemetry_init(
    const scs_u32_t version,
    const scs_telemetry_init_params_t* const params)
{
    if (version != SCS_TELEMETRY_VERSION_1_00 || !params) {
        return SCS_RESULT_unsupported;
    }

    const auto* version_params =
        static_cast<const scs_telemetry_init_params_v100_t*>(params);

    g_game_log = version_params->common.log;

    if (!start_http_server()) {
        log_message("BC TRUCK WORKS ETS2 plugin: unable to start telemetry HTTP server on 127.0.0.1:25555");
        return SCS_RESULT_generic_error;
    }

    version_params->register_for_channel(
        SCS_TELEMETRY_TRUCK_CHANNEL_speed,
        SCS_U32_NIL,
        SCS_VALUE_TYPE_float,
        SCS_TELEMETRY_CHANNEL_FLAG_none,
        store_float,
        &g_speed);

    version_params->register_for_channel(
        SCS_TELEMETRY_TRUCK_CHANNEL_fuel,
        SCS_U32_NIL,
        SCS_VALUE_TYPE_float,
        SCS_TELEMETRY_CHANNEL_FLAG_none,
        store_float,
        &g_fuel);

    version_params->register_for_channel(
        SCS_TELEMETRY_TRUCK_CHANNEL_odometer,
        SCS_U32_NIL,
        SCS_VALUE_TYPE_float,
        SCS_TELEMETRY_CHANNEL_FLAG_none,
        store_float,
        &g_odometer);

    version_params->register_for_channel(
        SCS_TELEMETRY_TRUCK_CHANNEL_world_placement,
        SCS_U32_NIL,
        SCS_VALUE_TYPE_dplacement,
        SCS_TELEMETRY_CHANNEL_FLAG_none,
        store_dplacement,
        nullptr);

    log_message("BC TRUCK WORKS ATS plugin initialized.");
    return SCS_RESULT_ok;
}

SCSAPI_VOID scs_telemetry_shutdown()
{
    stop_http_server();
    g_game_log = nullptr;
}
