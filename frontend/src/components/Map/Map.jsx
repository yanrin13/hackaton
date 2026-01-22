import React, { useRef, useEffect, useState } from "react";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import configData from "./config";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";


export default function Map() { 
    // { points }

    const points = [
    {
        geometry: {
            coordinates: [59.9343, 30.3351], // центр СПб
        },
        properties: {
            type: "Incident",
            district: "Central",
            severity: 3,
            timestamp: Date.now(),
            source: "test",
        },
    },
    {
        geometry: {
            coordinates: [59.9211, 30.3553], // Адмиралтейский
        },
        properties: {
            type: "Accident",
            district: "Admiralteysky",
            severity: 2,
            timestamp: Date.now(),
            source: "test",
        },
    },
    {
        geometry: {
            coordinates: [59.9566, 30.3086], // Петроградка
        },
        properties: {
            type: "Fire",
            district: "Petrogradsky",
            severity: 1,
            timestamp: Date.now(),
            source: "test",
        },
    },];

    const mapContainer = useRef(null);
    const map = useRef(null);
    const center = { lng: 30.3609, lat: 59.9311 };
    const [zoom] = useState(10);

    const handleVisualizationChange = () => {
        setSelectedMapLayer((prev) => (prev === "point" ? "heatmap" : "point"));
    };

    maptilersdk.config.apiKey = configData.MAPTILER_API_KEY;
    const [heatmapLayer, setHeatmapLayer] = useState("");
    const [pointLayer, setPointLayer] = useState("");
    const [pointLabels, setPointLabels] = useState("");
    const [selectedMapLayer, setSelectedMapLayer] = useState("point"); // 'point' or 'heatmap'
    const [mapLoaded, setMapLoaded] = useState(false);

    useEffect(() => {
        if (map.current) return;

        map.current = new maptilersdk.Map({
            container: mapContainer.current,
            style: maptilersdk.MapStyle.DATAVIZ.LIGHT,
            center: [center.lng, center.lat],
            zoom: zoom
        });
    }, [center.lng, center.lat, zoom]);

    useEffect(() => {
        if (!map.current || !points.length) return;

        const geoPoints = {
            type: "FeatureCollection",
            features: points.map(p => ({
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: [p.geometry.coordinates[1], p.geometry.coordinates[0]]
                },
                properties: {
                    type: p.properties.type,
                    district: p.properties.district,
                    severity: p.properties.severity,
                    timestamp: p.properties.timestamp,
                    source: p.properties.source
                }
            }))
        };

        map.current.on("load", () => {
            const { pointLayerId, labelLayerId } = maptilersdk.helpers.addPoint(map.current, {
                data: geoPoints,
                pointColor: 'gray',
                pointOpacity: 0.5,
                showLabel: true,
                labelColor: "black",
                pointRadius: 10,
                labelSize: 10,
                property: "type",

            });

            const { heatmapLayerId } = maptilersdk.helpers.addHeatmap(map.current, {
                data: geoPoints,
                property: "severity",
                weight: [
                    { propertyValue: 1, value: 1 },
                    { propertyValue: 3, value: 10 },
                ],
                radius: [
                    { propertyValue: 1, value: 60 },
                    { propertyValue: 3, value: 10 },
                ],
            });
            setHeatmapLayer(heatmapLayerId);
            setPointLabels(labelLayerId);
            setPointLayer(pointLayerId);
            setMapLoaded(true);
        });


    }, [points]);

    useEffect(() => {
        if (heatmapLayer && mapLoaded) {
            map.current.setLayoutProperty(
                heatmapLayer,
                "visibility",
                selectedMapLayer === "heatmap" ? "visible" : "none",
            );
        }
    }, [heatmapLayer, selectedMapLayer, mapLoaded]);

    useEffect(() => {
        if (pointLayer && mapLoaded) {
            map.current.setLayoutProperty(
                pointLayer,
                "visibility",
                selectedMapLayer === "point" ? "visible" : "none",
            );
            map.current.setLayoutProperty(
                pointLabels,
                "visibility",
                selectedMapLayer === "point" ? "visible" : "none",
            );
        }
    }, [pointLayer, selectedMapLayer, mapLoaded]);

    return (
    <Box sx={{ flex: 1 }}>
        <div className="container">
            <div ref={mapContainer} id="map" className="map" />

            <Button
                variant="contained"
                className="btn map-btn"
                onClick={handleVisualizationChange}
            >
                Change to {selectedMapLayer === "point" ? "heatmap" : "point"}
            </Button>
        </div>
    </Box>

    );
}