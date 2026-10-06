# BC TRUCK WORKS ATS Plugin

This folder is reserved for the BC TRUCK WORKS telemetry integration for American Truck Simulator (ATS).

## Purpose

The ATS integration will provide game telemetry to the BC TRUCK WORKS Connector.

Planned data includes:

- Speed
- Fuel
- Odometer
- Location
- Game state
- Driving status

## Installation

The Windows installer will prepare the local plugin location.

Target installation area:

C:\BC-TRUCK-WORKS\Plugins\ATS\

## Status

An ATS plugin foundation is now in the repository. It registers the core ATS telemetry channels and exposes a localhost HTTP bridge for the existing BC TRUCK WORKS Connector.\n\nThe plugin is not yet marked production-ready until the official SCS SDK build succeeds in GitHub Actions and the DLL is tested with ATS.

Do not place unofficial or untested DLL files in this folder.
