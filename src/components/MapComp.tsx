import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import { Map } from "maplibre-gl";
import { useState } from "react";
import { GetAllStops } from "../api/getAllStops";
import { Position, Station, Stop } from "../api/interfaces";
import { useSelector } from "react-redux";

import "../css/MapComp.css";
import { ToggleState } from "../store/filters";
import { routeDetailsState } from "../store/routeDetails";
import { getShapePoints } from "../api/getShapePoints";

function MapComp() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [lng, setLng] = useState(21.2278269);
  const [lat, setLat] = useState(45.7570519);
  const [zoom, setZoom] = useState(15);
  const [map, setMap] = useState<Map>();
  const [markers, setMarkers] = useState<maplibregl.Marker[]>([]);

  interface StationPosition {
    lat: string;
    long: string;
  }

  const currentStation = useSelector<any, StationPosition>(
    (state) => state.currentStation
  );

  const searchedRouteTimetable = useSelector<any, Station[]>(
    (state) => state.searchedRouteTimetable
  );

  const currentStopId = useSelector<any, string>(
    (state) => state.currentStopId
  );

  const routeDetails = useSelector<any, routeDetailsState>(
    (state) => state.routeDetails
  );

  async function addStops() {
    const shapePoints: GeoJSON.Position[] = await getShapePoints(
      routeDetails.direction.shapeId
    );

    if (!map) return;

    let markers: maplibregl.Marker[] = routeDetails.direction.stops.map(
      (stop, idx, arr) => {
        let popup = new maplibregl.Popup({ offset: 25 }).setText(stop.name);

        const isFirst = idx === 0;
        const isLast = idx === arr.length - 1;

        const color = isLast ? "#F79C78" : "#9C9C9C";
        const scale = isFirst || isLast ? 1 : 0.75;

        let marker = new maplibregl.Marker({ color, scale })
          .setLngLat([parseFloat(stop.long), parseFloat(stop.lat)])
          .setPopup(popup);

        return marker;
      }
    );

    setMarkers(markers);

    markers.forEach((marker) => marker.addTo(map));
    showRoute(shapePoints.map((p) => p.reverse()));

    const bounds = new maplibregl.LngLatBounds([
      new maplibregl.LngLat(shapePoints[0][0], shapePoints[0][1]),
      new maplibregl.LngLat(
        shapePoints[shapePoints.length - 1][0],
        shapePoints[shapePoints.length - 1][1]
      ),
    ]);

    if (window.innerWidth >= 599) {
      map.fitBounds(bounds, {
        padding: { left: 200, top: 200, bottom: 200, right: 450 },
      });
    } else {
      map.fitBounds(bounds, {
        padding: { left: 50, top: 50, bottom: 50, right: 90 },
      });
    }
  }

  function removeStops() {
    if (!map) return;
    markers.forEach((marker) => {
      marker.remove();
    });

    showRoute([]);
    if (routeDetails.routeId === "") {
      if (window.innerWidth >= 599) {
        map.flyTo({
          center: [parseFloat(lng.toString()), parseFloat(lat.toString())],
          zoom: 15,
          pitch: 65,
          essential: true,
        });
      } else {
        map.flyTo({
          center: [parseFloat(lng.toString()), parseFloat(lat.toString())],
          zoom: 15,
          pitch: 65,
          essential: true,
        });
      }
    }
  }

  function initRoute() {
    if (!map) return;

    map.addSource("route", {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: [],
        },
      },
    });

    map.addLayer({
      id: "route_layer",
      type: "line",
      source: "route",
      paint: {
        "line-color": "#3d199b",
        "line-width": 8,
      },
    });
  }

  function showRoute(points: GeoJSON.Position[]) {
    const routeSource = map?.getSource("route") as maplibregl.GeoJSONSource;

    routeSource?.setData({
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: points,
      },
    });
  }

  useEffect(() => {
    loadMap();
    if (!map) return;
    return () => map.remove();
  }, []);

  function loadMap() {
    if (!mapContainer.current) return;
    const map = new Map({
      container: mapContainer.current,
      style:
        "https://api.maptiler.com/maps/streets/style.json?key=VLT1LWoAFXVTjShlS5Y4",
      center: [lng, lat],
      zoom: zoom,
    });

    map.addControl(new maplibregl.NavigationControl(), "top-right");

    map.addControl(
      new maplibregl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
      })
    );

    setMap(map);
  }

  useEffect(() => {
    if (currentStation.lat !== "") {
      map?.flyTo({
        center: [
          parseFloat(currentStation.long),
          parseFloat(currentStation.lat),
        ],
        zoom: 20,
        pitch: 65,
        essential: true,
      });
    }
  }, [currentStation]);

  useEffect(() => {
    if (!map) return;
    map.on("load", () => initRoute());
  }, [map]);

  useEffect(() => {
    if (currentStopId !== "") {
      removeStops();
    }
  }, [currentStopId]);

  useEffect(() => {
    if (searchedRouteTimetable.length === 0) {
      console.log("intru aici searchedRouteTimetable");
      removeStops();
    }
  }, [searchedRouteTimetable]);

  useEffect(() => {
    console.log("intru aici routeDetails");
    routeDetails.routeId !== "" ? addStops() : removeStops();
  }, [routeDetails]);
  return <div className="map" ref={mapContainer} />;
}

export default MapComp;
