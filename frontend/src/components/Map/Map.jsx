import { useEffect } from "react";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import configData from "./config";
import Box from "@mui/material/Box";

export default function Map({ onMapReady}) {  // Добавили prop для передачи экземпляра карты
    maptilersdk.config.apiKey = configData.MAPTILER_API_KEY;

    useEffect(() => {
        const map = new maptilersdk.Map({
            container: "map",
            style: maptilersdk.MapStyle.HYBRID,
            center: [30.3609, 59.9311],
            zoom: 10,
        });

        map.on("load", async () => {
            try {
                const geoRes = await fetch("/st-petersburg.geojson");
                const geojson = await geoRes.json();

                const analiticRes = await fetch("/api/analitic/district");
                const analitic = await analiticRes.json();

                const reverseMapping = {
                    "Коломна": "Адмиралтейский",
                    "Сенной округ": "Адмиралтейский",
                    "Адмиралтейский округ": "Адмиралтейский",
                    "Семёновский": "Адмиралтейский",
                    "Измайловское": "Адмиралтейский",
                    "Екатерингофский": "Адмиралтейский",
                    "Муниципальный округ № 7": "Василеостровский",
                    "Васильевский": "Василеостровский",
                    "Гавань": "Василеостровский",
                    "Морской": "Василеостровский",
                    "Остров Декабристов": "Василеостровский",
                    "Сампсониевское": "Выборгский",
                    "Сосновское": "Выборгский",
                    "Парнас": "Выборгский",
                    "Муниципальный округ № 15": "Выборгский",
                    "Шувалово-Озерки": "Выборгский",
                    "Левашово": "Выборгский",
                    "Парголово": "Выборгский",
                    "Гражданка": "Калининский",
                    "Академическое": "Калининский",
                    "Финляндский округ": "Калининский",
                    "Муниципальный округ № 21": "Калининский",
                    "Пискарёвка": "Калининский",
                    "Северный": "Калининский",
                    "Прометей": "Калининский",
                    "Княжево": "Кировский",
                    "Ульянка": "Кировский",
                    "Дачное": "Кировский",
                    "Автово": "Кировский",
                    "Нарвский округ": "Кировский",
                    "Красненькая речка": "Кировский",
                    "Морские ворота": "Кировский",
                    "Колпино": "Колпинский",
                    "Понтонный": "Колпинский",
                    "Усть-Ижора": "Колпинский",
                    "Петро-Славянка": "Колпинский",
                    "Сапёрный": "Колпинский",
                    "Металлострой": "Колпинский",
                    "Полюстрово": "Красногвардейский",
                    "Большая Охта": "Красногвардейский",
                    "Малая Охта": "Красногвардейский",
                    "Пороховые": "Красногвардейский",
                    "Ржевка": "Красногвардейский",
                    "Юго-Запад": "Красносельский",
                    "Южно-Приморский": "Красносельский",
                    "Сосновая поляна": "Красносельский",
                    "Урицк": "Красносельский",
                    "Константиновское": "Красносельский",
                    "Горелово": "Красносельский",
                    "Красное Село": "Красносельский",
                    "Кронштадт": "Кронштадтский",
                    "Зеленогорск": "Курортный",
                    "Сестрорецк": "Курортный",
                    "Белоостров": "Курортный",
                    "Комарово": "Курортный",
                    "Молодёжное": "Курортный",
                    "Песочный": "Курортный",
                    "Репино": "Курортный",
                    "Серово": "Курортный",
                    "Смолячково": "Курортный",
                    "Солнечное": "Курортный",
                    "Ушково": "Курортный",
                    "Гагаринское": "Московский",
                    "Звёздное": "Московский",
                    "Московская застава": "Московский",
                    "Новоизмайловское": "Московский",
                    "Пулковский меридиан": "Московский",
                    "Невская застава": "Невский",
                    "Ивановский": "Невский",
                    "Обуховский": "Невский",
                    "Рыбацкое": "Невский",
                    "Народный": "Невский",
                    "Муниципальный округ № 54": "Невский",
                    "Невский округ": "Невский",
                    "Оккервиль": "Невский",
                    "Правобережный": "Невский",
                    "Введенский": "Петроградский",
                    "Кронверкское": "Петроградский",
                    "Посадский": "Петроградский",
                    "Аптекарский остров": "Петроградский",
                    "Петровский округ": "Петроградский",
                    "Чкаловское": "Петроградский",
                    "Стрельна": "Петродворцовый",
                    "Ломоносов": "Петродворцовый",
                    "Петергоф": "Петродворцовый",
                    "Лахта-Ольгино": "Приморский",
                    "Муниципальный округ № 65": "Приморский",
                    "Светлановское": "Приморский",
                    "Комендантский аэродром": "Приморский",
                    "Озеро Долгое": "Приморский",
                    "Юнтолово": "Приморский",
                    "Коломяги": "Приморский",
                    "Лисий Нос": "Приморский",
                    "Павловск": "Пушкинский",
                    "Пушкин": "Пушкинский",
                    "Шушары": "Пушкинский",
                    "Александровская": "Пушкинский",
                    "Тярлево": "Пушкинский",
                    "Волковское": "Фрунзенский",
                    "Муниципальный округ № 72": "Фрунзенский",
                    "Купчино": "Фрунзенский",
                    "Георгиевский": "Фрунзенский",
                    "Балканский": "Фрунзенский",
                    "Дворцовый округ": "Центральный",
                    "Муниципальный округ № 78": "Центральный",
                    "Литейный округ": "Центральный",
                    "Смольнинское": "Центральный",
                    "Лиговка-Ямская": "Центральный",
                    "Владимирский округ": "Центральный"
                };

                const geojsonWithValues = {
                    type: "FeatureCollection",
                    features: geojson.features.map(f => {
                        const moName = f.properties.name;
                        const arName = reverseMapping[moName];
                        if (!arName) {
                            console.warn(`Не найдено сопоставление для МО: ${moName}`);
                        }
                        const value = analitic[arName] || 0;
                        return {
                            ...f,
                            properties: {
                                ...f.properties,
                                value,
                                displayName: moName
                            }
                        };
                    })
                };

                map.addSource("districts", { type: "geojson", data: geojsonWithValues });
                map.addLayer({
                    id: "districts-fill",
                    type: "fill",
                    source: "districts",
                    paint: {
                        "fill-color": [
                            "interpolate",
                            ["linear"],
                            ["get", "value"],
                            0, "#add8e6",
                            50, "#ffff00",
                            100, "#8b0000"
                        ],
                        "fill-opacity": 0.6
                    }
                });
                map.addLayer({
                    id: "districts-line",
                    type: "line",
                    source: "districts",
                    paint: { "line-color": "#5f3232", "line-width": 1.5 }
                });

                function getCentroid(coords) {
                    let sumX = 0, sumY = 0, count = 0;
                    (function walk(c) {
                        if (typeof c[0] === "number") {
                            sumX += c[0]; sumY += c[1]; count++;
                        } else {
                            c.forEach(walk);
                        }
                    })(coords);
                    return count ? [sumX / count, sumY / count] : null;
                }

                const pointFeatures = geojsonWithValues.features.map(f => {
                    let ring = f.geometry.type === "Polygon" ? f.geometry.coordinates[0] :
                        f.geometry.type === "MultiPolygon" ? f.geometry.coordinates[0][0] : null;
                    const centroid = ring ? getCentroid(ring) : null;
                    return centroid ? {
                        type: "Feature",
                        geometry: { type: "Point", coordinates: centroid },
                        properties: { displayName: f.properties.displayName, value: f.properties.value }
                    } : null;
                }).filter(Boolean);

                const geoPoints = { type: "FeatureCollection", features: pointFeatures };

                map.addSource("district-points", { type: "geojson", data: geoPoints });

                maptilersdk.helpers.addHeatmap(map, {
                    data: geoPoints,
                    property: "value",
                    weight: [
                        { propertyValue: 0, value: 0.1 },
                        { propertyValue: 100, value: 0.5 }
                    ],
                    radius: [
                        { propertyValue: 0, value: 100 },
                        { propertyValue: 100, value: 500 }
                    ]
                });

                // map.addLayer({
                //     id: "district-points-circle",
                //     type: "circle",
                //     source: "district-points",
                //     paint: {
                //         "circle-radius": ["interpolate", ["linear"], ["get", "value"], 0, 5, 100, 18],
                //         "circle-color": ["interpolate", ["linear"], ["get", "value"], 0, "#ffffb2", 100, "#b10026"],
                //         "circle-stroke-color": "#fff",
                //         "circle-stroke-width": 1,
                //         "circle-opacity": 0.95
                //     }
                // });

                map.addLayer({
                    id: "district-points-labels",
                    type: "symbol",
                    source: "district-points",
                    layout: {
                        "text-field": ["concat", ["get", "displayName"], "\n", ["to-string", ["get", "value"]]],
                        "text-size": 12,
                        "text-line-height": 1.1,
                        "text-anchor": "top",
                        "text-offset": [0, 1.2]
                    },
                    paint: {
                        "text-color": "#000",
                        "text-halo-color": "#fff",
                        "text-halo-width": 2
                    }
                });

                const bounds = getBoundsFromGeoJSON(geojson);
                if (bounds) map.fitBounds(bounds, { padding: 40, maxZoom: 12 });

                // Передаём экземпляр карты родителю после загрузки
                if (onMapReady) {
                    onMapReady(map);
                }
            } catch (err) {
                console.error(err);
            }
        });

        return () => map.remove();
    }, [onMapReady]);  // Зависимость от prop (если он меняется)

    return <Box sx={{ width: "100%", height: "100%" }}>
        <div id="map" style={{ width: "100%", height: "100%" }} />
    </Box>
}

function getBoundsFromGeoJSON(geojson) {
    let minX = 180, minY = 90, maxX = -180, maxY = -90;
    function traverse(coords) {
        if (typeof coords[0] === "number") {
            minX = Math.min(minX, coords[0]);
            maxX = Math.max(maxX, coords[0]);
            minY = Math.min(minY, coords[1]);
            maxY = Math.max(maxY, coords[1]);
        } else coords.forEach(traverse);
    }
    geojson.features.forEach(f => traverse(f.geometry.coordinates));
    return minX === 180 ? null : [[minX, minY], [maxX, maxY]];
}