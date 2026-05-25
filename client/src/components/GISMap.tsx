import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';
import { STATUS_COLORS, STATUS_LABELS } from '@shared/const';
import { Spinner } from '@/components/ui/spinner';

interface Project {
  id: number;
  name: string;
  address: string;
  latitude: string;
  longitude: string;
  status: string;
  progress: number;
  investorName: string;
  totalUnits: number;
  soldUnits: number;
}

interface GISMapProps {
  projects: Project[];
  onProjectClick: (id: number) => void;
  highlightedProjectId: number | null;
  isLoading: boolean;
}

export function GISMap({ projects, onProjectClick, highlightedProjectId, isLoading }: GISMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<number, L.Marker>>(new Map());
  const clusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);

  useEffect(() => {
    if (mapRef.current) return;
    const map = L.map('gis-map', { zoomControl: false }).setView([16.0678, 108.2212], 13);

    // CARTO Positron basemap
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/">CARTO</a>',
      maxZoom: 19,
    }).addTo(map);

    // Zoom control - top right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Legend
    const legend = new L.Control({ position: 'bottomright' });
    legend.onAdd = () => {
      const div = L.DomUtil.create('div');
      div.innerHTML = `
        <div style="background: white; padding: 10px 12px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.15); font-size: 11px; min-width: 130px;">
          <p style="font-weight: 700; margin: 0 0 8px; font-size: 11px; color: #374151;">TRẠNG THÁI</p>
          ${Object.entries(STATUS_COLORS).map(([key, color]) => `
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:5px;">
              <span style="width:10px;height:10px;border-radius:50%;background:${color};flex-shrink:0;display:inline-block"></span>
              <span style="color:#6b7280">${STATUS_LABELS[key] || key}</span>
            </div>
          `).join('')}
        </div>
      `;
      return div;
    };
    legend.addTo(map);

    mapRef.current = map;
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    if (clusterGroupRef.current) {
      map.removeLayer(clusterGroupRef.current);
    }
    markersRef.current.clear();

    const clusterGroup = L.markerClusterGroup({
      maxClusterRadius: 60,
      disableClusteringAtZoom: 15,
      iconCreateFunction: (cluster: L.MarkerCluster) => {
        const count = cluster.getChildCount();
        return L.divIcon({
          html: `<div style="background: #1d4ed8; color: white; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; box-shadow: 0 2px 8px rgba(29,78,216,0.4); border: 2px solid white;">${count}</div>`,
          className: '',
          iconSize: [36, 36],
          iconAnchor: [18, 18],
        });
      },
    });

    projects.forEach((project) => {
      const lat = parseFloat(project.latitude);
      const lng = parseFloat(project.longitude);
      if (isNaN(lat) || isNaN(lng)) return;

      const color = STATUS_COLORS[project.status] || '#6b7280';
      const availableUnits = project.totalUnits - project.soldUnits;

      const svgIcon = `
        <svg width="30" height="38" viewBox="0 0 30 38" xmlns="http://www.w3.org/2000/svg">
          <filter id="shadow-${project.id}">
            <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.3"/>
          </filter>
          <path d="M15 0C6.7 0 0 6.4 0 14.2c0 7.1 15 23.8 15 23.8S30 21.3 30 14.2C30 6.4 23.3 0 15 0z" fill="${color}" filter="url(#shadow-${project.id})"/>
          <circle cx="15" cy="13.5" r="6" fill="white" opacity="0.9"/>
        </svg>
      `;

      const icon = L.divIcon({
        html: svgIcon,
        iconSize: [30, 38],
        iconAnchor: [15, 38],
        popupAnchor: [0, -40],
        className: '',
      });

      const popup = L.popup({ maxWidth: 240, closeButton: false }).setContent(`
        <div style="font-family: system-ui, sans-serif; padding: 4px;">
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
            <span style="width:8px;height:8px;border-radius:50%;background:${color};flex-shrink:0"></span>
            <span style="font-size:10px;color:${color};font-weight:600">${STATUS_LABELS[project.status] || project.status}</span>
          </div>
          <h3 style="font-size:13px;font-weight:700;margin:0 0 4px;line-height:1.3;color:#111827">${project.name}</h3>
          <p style="font-size:11px;color:#6b7280;margin:0 0 8px">${project.address}</p>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;padding-top:8px;border-top:1px solid #f3f4f6">
            <div>
              <p style="font-size:10px;color:#9ca3af;margin:0">Tiến độ</p>
              <p style="font-size:13px;font-weight:700;color:#111827;margin:2px 0">${project.progress}%</p>
            </div>
            <div>
              <p style="font-size:10px;color:#9ca3af;margin:0">Còn trống</p>
              <p style="font-size:13px;font-weight:700;color:#059669;margin:2px 0">${availableUnits} căn</p>
            </div>
          </div>
          <button onclick="window._selectProject(${project.id})" style="margin-top:8px;width:100%;padding:6px;background:#1d4ed8;color:white;border:none;border-radius:6px;font-size:11px;font-weight:600;cursor:pointer;transition:opacity 0.15s" onmouseover="this.style.opacity=0.85" onmouseout="this.style.opacity=1">
            Xem chi tiết →
          </button>
        </div>
      `);

      const marker = L.marker([lat, lng], { icon }).bindPopup(popup);
      clusterGroup.addLayer(marker);
      markersRef.current.set(project.id, marker);
    });

    // Global handler for popup button
    (window as any)._selectProject = (id: number) => {
      onProjectClick(id);
    };

    map.addLayer(clusterGroup);
    clusterGroupRef.current = clusterGroup;

    if (projects.length > 0) {
      const bounds = clusterGroup.getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [60, 60] });
      }
    }
  }, [projects, onProjectClick]);

  useEffect(() => {
    const marker = highlightedProjectId ? markersRef.current.get(highlightedProjectId) : null;
    if (marker) {
      mapRef.current?.flyTo(marker.getLatLng(), 15, { duration: 0.6, easeLinearity: 0.5 });
      setTimeout(() => marker.openPopup(), 400);
    }
  }, [highlightedProjectId]);

  return (
    <div className="w-full h-full relative">
      <div id="gis-map" className="w-full h-full" />
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-[500] pointer-events-none">
          <div className="bg-background/90 rounded-xl px-5 py-3.5 flex items-center gap-3 shadow-lg border border-border/50">
            <Spinner className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Đang tải bản đồ...</span>
          </div>
        </div>
      )}

      {/* Project count badge */}
      {!isLoading && projects.length > 0 && (
        <div className="absolute top-3 left-3 z-[400] bg-background/90 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-md border border-border/50">
          <span className="text-xs font-semibold text-foreground tabular-nums">{projects.length} dự án</span>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && projects.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center z-[400] pointer-events-none">
          <div className="bg-background/90 backdrop-blur-sm rounded-xl px-6 py-5 text-center shadow-lg border border-border/50">
            <div className="text-3xl mb-2">🗺️</div>
            <p className="text-sm font-medium text-foreground">Không có dự án trên bản đồ</p>
            <p className="text-xs text-muted-foreground mt-1">Thử thay đổi bộ lọc tìm kiếm</p>
          </div>
        </div>
      )}
    </div>
  );
}
