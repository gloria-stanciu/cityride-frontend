import "../css/Sidebar.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { ToggleState, TransportType } from "../store/filters";
import { GetAllStops } from "../api/filtersAPI";
import FilterButtons from "./FilterButtons";
import DirectionFilter from "./DirectionFilter";
import store from "../store";
import DisplayRoutes from "./DisplayRoutes";

export interface DisplayComponent {
  name: string;
  type: TransportType;
  status: string;
  component: string;
  class: string;
}

interface Direction {
  shapeId: string;
  stops: {
    id: string;
    name: string;
    sequence: number;
    routeId: string;
    lat: string;
    long: string;
  }[];
}

export interface Routes {
  id: string;
  longName: string;
  shortName: string;
  outbound: Direction;
  inbound: Direction;
  type: number;
}

const buttons = [
  {
    name: "Tram",
    type: 0, //from GTFS
    active: "/images/Tram/tram-active.svg",
    inactive: "/images/Tram/tram-active.svg",
  },
  {
    name: "Bus",
    type: 3, //from GTFS
    active: "/images/Bus/bus-active.svg",
    inactive: "/images/Bus/bus-active.svg",
  },
  {
    name: "Train",
    type: 2, //from GTFS
    active: "/images/Train/train-active.svg",
    inactive: "/images/Train/train-active.svg",
  },
  {
    name: "Subway",
    type: 1, //from GTFS
    active: "/images/Subway/subway-active.svg",
    inactive: "/images/Subway/subway-active.svg",
  },
];

function Sidebar() {
  const [routes, setRoutes] = useState<Routes[]>([]);
  const [routeDetails, setRouteDetails] = useState({});
  const dispatch = useDispatch();
  const setType = (type: TransportType) => {
    store.dispatch({ type: "SET_TYPE", payload: type });
  };

  const direction = useSelector<any, ToggleState["transportType"]>(
    (state) => state.changeDirection.routeDirection
  );

  const selectedType = useSelector<any, ToggleState["transportType"]>(
    (state) => state.toggleReducer.transportType
  );

  const [isCollapsed, setIsCollapsed] = useState(false);

  function ToggleSidebar() {
    setIsCollapsed(!isCollapsed);
  }

  async function ShowRoutes() {
    if (selectedType !== -1) {
      setRoutes([]);
      const getRoutes = await GetAllStops(selectedType);
      console.log(getRoutes);
      setRoutes(getRoutes);
    }
  }

  useEffect(() => {
    selectedType !== -1 && ShowRoutes();
  }, [selectedType]);

  return (
    <div className="sidebar-overlay">
      <aside className={`sidebar ${isCollapsed ? "sidebar-collapsed" : ""}`}>
        <FilterButtons />
        <DirectionFilter />
        <DisplayRoutes />
        <div className="sidebar-toggle-wrapper">
          <button className="sidebar-toggle" onClick={() => ToggleSidebar()}>
            <svg style={{ width: 24, height: 24 }} viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"
              />
            </svg>
          </button>
        </div>
      </aside>
    </div>
  );
}

export default Sidebar;
function Context(Context: any): { dispatch: any } {
  throw new Error("Function not implemented.");
}
