'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Map as MapIcon, Navigation, Layers, Users, Home, AlertCircle, 
  Maximize2, Eye, Plus, Sparkles, Check, CheckCircle2, Building, 
  MapPin, Info, ArrowRight, ShieldCheck, Heart, Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { getGisMappingData } from '@/app/actions/gis';
import Swal from 'sweetalert2';

interface RTStats {
  totalKk: number;
  totalJiwa: number;
}

interface DusunData {
  totalKk: number;
  totalJiwa: number;
  rtStats: Record<string, RTStats>;
}

// Static GeoJSON-like boundary polygons for 3 major Dusuns in Kediren (Selungguh, Sekadalan, Ledok)
const DUSUN_BOUNDARIES = [
  {
    name: 'SELUNGGUH',
    color: '#a855f7', // purple
    coords: [
      [-7.755, 111.365],
      [-7.755, 111.373],
      [-7.761, 111.373],
      [-7.761, 111.365]
    ],
    luas: '1.2 km²',
    deskripsi: 'Dusun Selungguh terletak di bagian barat laut, didominasi area pemukiman asri.'
  },
  {
    name: 'SEKADALAN',
    color: '#10b981', // emerald
    coords: [
      [-7.761, 111.365],
      [-7.761, 111.378],
      [-7.768, 111.378],
      [-7.768, 111.365]
    ],
    luas: '1.5 km²',
    deskripsi: 'Dusun Sekadalan terletak di bagian selatan, merupakan pusat kepadatan penduduk.'
  },
  {
    name: 'LEDOK',
    color: '#3b82f6', // blue
    coords: [
      [-7.755, 111.373],
      [-7.755, 111.382],
      [-7.762, 111.382],
      [-7.762, 111.373]
    ],
    luas: '1.8 km²',
    deskripsi: 'Dusun Ledok terletak di bagian timur, dikelilingi persawahan subur.'
  }
];

// Static Infrastructure items in Desa Kediren
const STATIC_INFRASTRUCTURE = [
  { id: 'inf-1', nama: 'Kantor Kepala Desa Kediren', tipe: 'kantor', lat: -7.7602, lng: 111.3732, color: '#6366f1', deskripsi: 'Pusat pelayanan administrasi kependudukan dan kemasyarakatan.' },
  { id: 'inf-2', nama: 'SDN 1 Kediren', tipe: 'sekolah', lat: -7.7592, lng: 111.3718, color: '#f59e0b', deskripsi: 'Sekolah dasar negeri andalan warga Desa Kediren.' },
  { id: 'inf-3', nama: 'Polindes / Pustu Kediren', tipe: 'kesehatan', lat: -7.7612, lng: 111.3745, color: '#ef4444', deskripsi: 'Pusat pelayanan kesehatan dasar warga desa.' },
  { id: 'inf-4', nama: 'Masjid Jami\' Desa Kediren', tipe: 'ibadah', lat: -7.7605, lng: 111.3728, color: '#10b981', deskripsi: 'Tempat ibadah utama warga desa.' },
  { id: 'inf-5', nama: 'Pasar Desa Kediren', tipe: 'pasar', lat: -7.7622, lng: 111.3712, color: '#ec4899', deskripsi: 'Pusat perputaran ekonomi mandiri masyarakat.' },
  { id: 'inf-6', nama: 'Embung Selungguh', tipe: 'wisata', lat: -7.7565, lng: 111.3688, color: '#06b6d4', deskripsi: 'Tampungan air irigasi sekaligus destinasi rekreasi warga.' }
];

export default function GisDashboard() {
  const [activeLayer, setActiveLayer] = useState<'kependudukan' | 'batas' | 'infrastruktur'>('kependudukan');
  const [mapType, setMapType] = useState<'street' | 'satellite' | 'dark'>('street');
  
  // Real database stats from Server Action
  const [dbData, setDbData] = useState<any>(null);
  const [dbLoading, setDbLoading] = useState(true);

  // Inspector card state
  const [selectedEntity, setSelectedEntity] = useState<any>(null);

  // Custom marker mode
  const [isAddingMarker, setIsAddingMarker] = useState(false);
  const [customMarkers, setCustomMarkers] = useState<any[]>([]);
  const [newMarkerName, setNewMarkerName] = useState('');
  const [newMarkerType, setNewMarkerType] = useState('rumah');
  const [tempCoords, setTempCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Custom BPN Cadastral Polygon mode
  const [isDrawingPolygon, setIsDrawingPolygon] = useState(false);
  const [drawingPoints, setDrawingPoints] = useState<{ lat: number; lng: number }[]>([]);
  const [customPolygons, setCustomPolygons] = useState<any[]>([]);

  // Load custom markers & polygons from LocalStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMarkers = localStorage.getItem('gis_custom_markers');
      if (savedMarkers) {
        try { setCustomMarkers(JSON.parse(savedMarkers)); } catch (e) { console.error(e); }
      }
      const savedPolys = localStorage.getItem('gis_custom_polygons');
      if (savedPolys) {
        try { setCustomPolygons(JSON.parse(savedPolys)); } catch (e) { console.error(e); }
      }
    }
  }, []);

  // Save custom markers to LocalStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && customMarkers.length > 0) {
      localStorage.setItem('gis_custom_markers', JSON.stringify(customMarkers));
    }
  }, [customMarkers]);

  // Save custom polygons to LocalStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && customPolygons.length > 0) {
      localStorage.setItem('gis_custom_polygons', JSON.stringify(customPolygons));
    }
  }, [customPolygons]);

  // Dynamic Geodesic Area Calculation for BPN Land Plot
  const calculatePolygonArea = (latlngs: { lat: number; lng: number }[]) => {
    if (latlngs.length < 3) return 0;
    const radius = 6378137; // Earth's radius in meters
    const rad = Math.PI / 180;
    let area = 0;
    
    for (let i = 0; i < latlngs.length; i++) {
      const p1 = latlngs[i];
      const p2 = latlngs[(i + 1) % latlngs.length];
      
      const x1 = p1.lng * rad * Math.cos(p1.lat * rad) * radius;
      const y1 = p1.lat * rad * radius;
      const x2 = p2.lng * rad * Math.cos(p2.lat * rad) * radius;
      const y2 = p2.lat * rad * radius;
      
      area += (x1 * y2) - (x2 * y1);
    }
    
    return Math.abs(area / 2);
  };

  // Bind interactive click listener dynamically to prevent React closure bugs
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const onMapClick = (e: any) => {
      if (isAddingMarker) {
        setTempCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
      } else if (isDrawingPolygon) {
        setDrawingPoints(prev => [...prev, { lat: e.latlng.lat, lng: e.latlng.lng }]);
      }
    };

    map.on('click', onMapClick);

    return () => {
      map.off('click', onMapClick);
    };
  }, [isAddingMarker, isDrawingPolygon]);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const layersGroupRef = useRef<any>(null);

  // Fetch real statistics
  useEffect(() => {
    async function loadStats() {
      const res = await getGisMappingData();
      if (res.success) {
        setDbData(res);
      }
      setDbLoading(false);
    }
    loadStats();
  }, []);

  // Initialize Leaflet Map once
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Load Leaflet dynamically
    const L = (window as any).L;
    if (!L) {
      // Stylesheet
      if (!document.getElementById('leaflet-css-cdn')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css-cdn';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      // Script
      if (!document.getElementById('leaflet-js-cdn')) {
        const script = document.createElement('script');
        script.id = 'leaflet-js-cdn';
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.async = true;
        script.onload = () => {
          setupMap();
        };
        document.body.appendChild(script);
      }
    } else {
      setupMap();
    }

    function setupMap() {
      const Leaflet = (window as any).L;
      if (!Leaflet || !mapContainerRef.current) return;

      // Clean existing instance
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      const map = Leaflet.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false
      }).setView([-7.7610, 111.3736], 14);

      mapInstanceRef.current = map;
      Leaflet.control.zoom({ position: 'bottomright' }).addTo(map);

      // Create overlay layers group
      layersGroupRef.current = Leaflet.layerGroup().addTo(map);

      // Render base tile
      updateTileLayer();

      // Dynamic map click handler is now managed in a separate useEffect to prevent React closure bugs

      // Populate layers immediately after map setup
      renderActiveLayers();
    }

    return () => {
      // No-op cleanup
    };
  }, []);

  // Trigger tile change
  useEffect(() => {
    updateTileLayer();
  }, [mapType]);

  // Trigger vector elements redraw on state changes
  useEffect(() => {
    renderActiveLayers();
  }, [activeLayer, dbData, customMarkers, customPolygons, isAddingMarker, isDrawingPolygon, drawingPoints, tempCoords]);

  const updateTileLayer = () => {
    const L = (window as any).L;
    const map = mapInstanceRef.current;
    if (!L || !map) return;

    // Remove old tile layer if exists
    if ((window as any).currentTileLayer) {
      map.removeLayer((window as any).currentTileLayer);
    }

    let url = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'; // default street
    if (mapType === 'satellite') {
      url = 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}';
    } else if (mapType === 'dark') {
      url = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    }

    const tile = L.tileLayer(url, {
      maxZoom: 20
    }).addTo(map);

    (window as any).currentTileLayer = tile;
  };

  // Modern SVG Pin Marker Creators
  const createPinIcon = (colorHex: string) => {
    const L = (window as any).L;
    return L.divIcon({
      html: `
        <div style="position: relative; display: flex; align-items: center; justify-content: center;">
          <span style="position: absolute; display: inline-flex; height: 28px; width: 28px; border-radius: 50%; background-color: ${colorHex}; opacity: 0.35; animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
          <div style="position: relative; display: flex; height: 18px; width: 18px; align-items: center; justify-content: center; border-radius: 50%; background-color: ${colorHex}; border: 2px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.15);">
            <div style="width: 6px; height: 6px; background-color: white; border-radius: 50%;"></div>
          </div>
        </div>
      `,
      className: 'gis-custom-pin',
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });
  };

  const createFacilityIcon = (tipe: string, colorHex: string) => {
    const L = (window as any).L;
    let innerSvg = `<div style="width: 8px; height: 8px; background-color: white; border-radius: 50%;"></div>`;
    
    if (tipe === 'kantor') {
      innerSvg = `<svg style="width: 12px; height: 12px; color: white;" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>`;
    } else if (tipe === 'sekolah') {
      innerSvg = `<svg style="width: 12px; height: 12px; color: white;" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>`;
    } else if (tipe === 'kesehatan') {
      innerSvg = `<svg style="width: 12px; height: 12px; color: white;" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>`;
    } else if (tipe === 'pasar') {
      innerSvg = `<svg style="width: 12px; height: 12px; color: white;" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>`;
    } else if (tipe === 'ibadah') {
      innerSvg = `<svg style="width: 12px; height: 12px; color: white;" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>`;
    } else if (tipe === 'rumah') {
      innerSvg = `<svg style="width: 12px; height: 12px; color: white;" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>`;
    } else if (tipe === 'sawah') {
      innerSvg = `<svg style="width: 12px; height: 12px; color: white;" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707.707M12 5a7 7 0 100 14 7 7 0 000-14z" /></svg>`;
    } else if (tipe === 'bengkok') {
      innerSvg = `<svg style="width: 12px; height: 12px; color: white;" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>`;
    } else if (tipe === 'bencana') {
      innerSvg = `<svg style="width: 12px; height: 12px; color: white;" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>`;
    } else if (tipe === 'umkm') {
      innerSvg = `<svg style="width: 12px; height: 12px; color: white;" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>`;
    } else {
      innerSvg = `<svg style="width: 12px; height: 12px; color: white;" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>`;
    }

    return L.divIcon({
      html: `
        <div style="position: relative; display: flex; align-items: center; justify-content: center;">
          <span style="position: absolute; display: inline-flex; height: 32px; width: 32px; border-radius: 50%; background-color: ${colorHex}; opacity: 0.25; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
          <div style="position: relative; display: flex; height: 24px; width: 24px; align-items: center; justify-content: center; border-radius: 8px; background-color: ${colorHex}; border: 2px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.15);">
            ${innerSvg}
          </div>
        </div>
      `,
      className: 'gis-facility-pin',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });
  };

  const renderActiveLayers = () => {
    const L = (window as any).L;
    const group = layersGroupRef.current;
    const map = mapInstanceRef.current;
    if (!L || !group || !map) return;

    // Clear old elements from the layers group
    group.clearLayers();

    // 1. LAYER KEPENDUDUKAN
    if (activeLayer === 'kependudukan') {
      // Render simulated RT markers with real database synchronization
      const rtList = [
        { dsn: 'SELUNGGUH', rt: '01', rw: '01', lat: -7.757, lng: 111.368, color: '#a855f7' },
        { dsn: 'SELUNGGUH', rt: '02', rw: '01', lat: -7.758, lng: 111.370, color: '#a855f7' },
        { dsn: 'SEKADALAN', rt: '01', rw: '02', lat: -7.763, lng: 111.370, color: '#10b981' },
        { dsn: 'SEKADALAN', rt: '02', rw: '02', lat: -7.765, lng: 111.374, color: '#10b981' },
        { dsn: 'LEDOK', rt: '01', rw: '03', lat: -7.756, lng: 111.376, color: '#3b82f6' },
        { dsn: 'LEDOK', rt: '02', rw: '03', lat: -7.759, lng: 111.379, color: '#3b82f6' }
      ];

      rtList.forEach(rt => {
        // Query live DB stats loaded via Server Action
        let totalKk = 12;
        let totalJiwa = 45;
        if (dbData?.dusunStats) {
          const dStat = dbData.dusunStats[rt.dsn];
          if (dStat) {
            const rtRwKey = `RT ${rt.rt} / RW ${rt.rw}`;
            const rtObj = dStat.rtStats[rtRwKey];
            if (rtObj) {
              totalKk = rtObj.totalKk;
              totalJiwa = rtObj.totalJiwa;
            }
          }
        }

        const marker = L.marker([rt.lat, rt.lng], {
          icon: createPinIcon(rt.color)
        });

        // Set rich popup card
        marker.bindPopup(`
          <div style="font-family: sans-serif; padding: 6px; width: 180px;">
            <p style="margin: 0; font-size: 10px; font-weight: bold; color: #6b7280; text-transform: uppercase;">Dusun ${rt.dsn}</p>
            <h4 style="margin: 3px 0 6px 0; font-size: 13px; font-weight: 800; color: #1f2937;">RT ${rt.rt} / RW ${rt.rw}</h4>
            <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
              <span style="color: #4b5563; font-weight: 600;">Total KK:</span>
              <span style="font-weight: 800; color: #4f46e5;">${totalKk} KK</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 11px;">
              <span style="color: #4b5563; font-weight: 600;">Total Jiwa:</span>
              <span style="font-weight: 800; color: #10b981;">${totalJiwa} Jiwa</span>
            </div>
          </div>
        `);

        marker.on('click', () => {
          setSelectedEntity({
            tipe: 'rt',
            dusun: rt.dsn,
            rt: rt.rt,
            rw: rt.rw,
            totalKk,
            totalJiwa,
            color: rt.color
          });
        });

        marker.addTo(group);
      });
    }

    // 2. LAYER BATAS WILAYAH / DUSUN (GeoJSON Boundaries simulation)
    if (activeLayer === 'batas') {
      // 2a. Draw Outer Village Boundary
      const outerCoords = [
        [-7.755, 111.365],
        [-7.755, 111.382],
        [-7.762, 111.382],
        [-7.768, 111.378],
        [-7.768, 111.365]
      ];
      const villagePolygon = L.polygon(outerCoords, {
        color: '#4f46e5', // solid indigo outer border
        fillOpacity: 0.05,
        fillColor: '#6366f1',
        weight: 5,
        dashArray: 'none'
      });
      villagePolygon.bindTooltip('BATAS LUAR DESA KEDIREN', {
        permanent: false,
        sticky: true,
        className: 'village-label-tooltip'
      });
      villagePolygon.addTo(group);

      DUSUN_BOUNDARIES.forEach(dsn => {
        // Compute stats for boundary
        let totalKk = 15;
        let totalJiwa = 60;
        if (dbData?.dusunStats) {
          const dStat = dbData.dusunStats[dsn.name];
          if (dStat) {
            totalKk = dStat.totalKk;
            totalJiwa = dStat.totalJiwa;
          }
        }

        const polygon = L.polygon(dsn.coords, {
          color: dsn.color,
          fillColor: dsn.color,
          fillOpacity: 0.25,
          weight: 3,
          dashArray: '5, 8'
        });

        polygon.bindTooltip(`Dusun ${dsn.name}`, {
          permanent: true,
          direction: 'center',
          className: 'dusun-label-tooltip'
        });

        polygon.on('click', () => {
          setSelectedEntity({
            tipe: 'dusun',
            nama: dsn.name,
            totalKk,
            totalJiwa,
            luas: dsn.luas,
            color: dsn.color,
            deskripsi: dsn.deskripsi
          });
        });

        polygon.addTo(group);
      });
    }

    // 3. LAYER INFRASTRUKTUR & FASKES
    if (activeLayer === 'infrastruktur') {
      STATIC_INFRASTRUCTURE.forEach(inf => {
        const marker = L.marker([inf.lat, inf.lng], {
          icon: createFacilityIcon(inf.tipe, inf.color)
        });

        marker.bindPopup(`
          <div style="font-family: sans-serif; padding: 4px; width: 200px;">
            <p style="margin: 0; font-size: 10px; font-weight: bold; color: ${inf.color}; text-transform: uppercase;">${inf.tipe}</p>
            <h4 style="margin: 2px 0 6px 0; font-size: 12px; font-weight: 800; color: #111827;">${inf.nama}</h4>
            <p style="margin: 0; font-size: 10px; color: #4b5563; line-height: 1.4;">${inf.deskripsi}</p>
          </div>
        `);

        marker.on('click', () => {
          setSelectedEntity({
            tipe: 'infrastruktur',
            nama: inf.nama,
            kategori: inf.tipe,
            deskripsi: inf.deskripsi,
            lat: inf.lat,
            lng: inf.lng,
            color: inf.color
          });
        });

        marker.addTo(group);
      });
    }

    // 4. RENDER CUSTOM USER MARKERS (FROM LOCALSTORAGE OR TEMPORARY STATE)
    customMarkers.forEach(m => {
      const getMarkerColor = (t: string) => {
        if (t === 'rumah') return '#3b82f6';
        if (t === 'wisata') return '#10b981';
        if (t === 'faskes') return '#6366f1';
        if (t === 'sawah') return '#84cc16';
        if (t === 'bengkok') return '#eab308';
        if (t === 'bencana') return '#ef4444';
        if (t === 'umkm') return '#ec4899';
        return '#4f46e5';
      };
      const markerColor = getMarkerColor(m.tipe);
      
      const marker = L.marker([m.lat, m.lng], {
        icon: createFacilityIcon(m.tipe, markerColor)
      });

      marker.bindPopup(`
        <div style="font-family: sans-serif; padding: 4px; width: 180px;">
          <p style="margin: 0; font-size: 10px; font-weight: bold; color: ${markerColor}; text-transform: uppercase;">Marking Mandiri</p>
          <h4 style="margin: 2px 0 4px 0; font-size: 12px; font-weight: 800; color: #111827;">${m.nama}</h4>
          <p style="margin: 0; font-size: 10px; color: #4b5563;">Koordinat: ${m.lat.toFixed(5)}, ${m.lng.toFixed(5)}</p>
        </div>
      `);

      marker.on('click', () => {
        setSelectedEntity({
          id: m.id,
          tipe: 'custom',
          nama: m.nama,
          kategori: m.tipe,
          lat: m.lat,
          lng: m.lng,
          color: markerColor
        });
      });

      marker.addTo(group);
    });

    // 4b. RENDER SAVED CUSTOM BPN LAND POLYGONS
    customPolygons.forEach(poly => {
      const polygon = L.polygon(poly.coords, {
        color: '#f97316', // BPN Orange Cadastral style
        fillColor: '#ea580c',
        fillOpacity: 0.25,
        weight: 3
      });

      polygon.bindTooltip(`Persil: ${poly.nama}`, {
        permanent: false,
        sticky: true
      });

      polygon.on('click', () => {
        setSelectedEntity({
          id: poly.id,
          tipe: 'lahan_bpn',
          nama: poly.nama,
          pemilik: poly.pemilik,
          noSurat: poly.noSurat,
          noSppt: poly.noSppt,
          jenisLahan: poly.jenisLahan,
          luasManual: poly.luasManual,
          luasEst: poly.luasEst,
          coords: poly.coords,
          color: '#f97316'
        });
      });

      polygon.addTo(group);
    });

    // 4c. RENDER TEMPORARY POLYGON DRAWING PREVIEW
    if (isDrawingPolygon && drawingPoints.length > 0) {
      // Draw points as mini orange circles
      drawingPoints.forEach((pt, index) => {
        const marker = L.circleMarker([pt.lat, pt.lng], {
          radius: 5,
          color: '#ea580c',
          fillColor: '#ffffff',
          fillOpacity: 1,
          weight: 2
        }).addTo(group);
        marker.bindTooltip(`Sudut ${index + 1}`, { permanent: true, direction: 'top' });
      });

      // Draw polyline connecting them
      if (drawingPoints.length > 1) {
        L.polyline(drawingPoints, {
          color: '#f97316',
          weight: 3,
          dashArray: '5, 5'
        }).addTo(group);
      }

      // If at least 3 points, draw semi-transparent polygon preview
      if (drawingPoints.length >= 3) {
        L.polygon(drawingPoints, {
          color: '#f97316',
          fillColor: '#f97316',
          fillOpacity: 0.15,
          weight: 0
        }).addTo(group);
      }
    }

    // 5. RENDER TEMPORARY PENDING MARKER WHEN ADDING
    if (isAddingMarker && tempCoords) {
      const tempMarker = L.marker([tempCoords.lat, tempCoords.lng], {
        icon: createPinIcon('#ef4444')
      }).addTo(group);

      tempMarker.bindTooltip('Lokasi Baru Anda', { permanent: true }).openTooltip();
    }
  };

  const handleSaveCustomMarker = () => {
    if (!newMarkerName.trim() || !tempCoords) {
      Swal.fire({
        title: 'Formulir Belum Lengkap',
        text: 'Silakan pilih lokasi di peta terlebih dahulu dan isi nama marker!',
        icon: 'warning',
        customClass: {
          popup: 'rounded-3xl border border-slate-100 shadow-2xl p-6 bg-white max-w-sm w-full text-center',
          title: 'text-xs font-black text-slate-950 uppercase tracking-widest mb-2',
          htmlContainer: 'text-xs font-bold text-slate-500 m-0 p-0',
          confirmButton: 'bg-indigo-600 hover:bg-indigo-750 text-white font-extrabold py-2 px-5 rounded-xl text-xs transition focus:outline-none cursor-pointer mt-4'
        },
        buttonsStyling: false
      });
      return;
    }

    const newMarker = {
      id: `custom-${Date.now()}`,
      nama: newMarkerName,
      tipe: newMarkerType,
      lat: tempCoords.lat,
      lng: tempCoords.lng
    };

    setCustomMarkers([...customMarkers, newMarker]);
    setNewMarkerName('');
    setTempCoords(null);
    setIsAddingMarker(false);

    Swal.fire({
      icon: 'success',
      title: 'Marker Disimpan',
      text: 'Lokasi Anda telah berhasil disimpan di peta GIS lokal.',
      timer: 1800,
      showConfirmButton: false,
      customClass: {
        popup: 'rounded-3xl border border-slate-100 shadow-2xl p-6 bg-white max-w-sm w-full text-center',
        title: 'text-xs font-black text-slate-950 uppercase tracking-widest mb-2',
        htmlContainer: 'text-xs font-bold text-slate-500 m-0 p-0'
      }
    });
  };

  const handleSavePolygon = async () => {
    if (drawingPoints.length < 3) {
      Swal.fire({
        title: 'Batas Koordinat Kurang',
        text: 'Harap buat minimal 3 titik batas koordinat terlebih dahulu!',
        icon: 'warning',
        customClass: {
          popup: 'rounded-3xl border border-slate-100 shadow-2xl p-6 bg-white max-w-sm w-full text-center',
          title: 'text-xs font-black text-slate-950 uppercase tracking-widest mb-2',
          htmlContainer: 'text-xs font-bold text-slate-500 m-0 p-0',
          confirmButton: 'bg-orange-600 hover:bg-orange-700 text-white font-extrabold py-2 px-5 rounded-xl text-xs transition focus:outline-none cursor-pointer mt-4'
        },
        buttonsStyling: false
      });
      return;
    }

    const calculatedArea = calculatePolygonArea(drawingPoints);

    const { value: formValues } = await Swal.fire({
      html: `
        <div class="font-sans text-left flex flex-col gap-3.5">
          <!-- Premium Left-Aligned Header -->
          <div class="flex items-center gap-3 border-b border-slate-100 pb-3">
            <div class="p-2.5 bg-orange-50 rounded-2xl text-orange-600 shrink-0">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
              </svg>
            </div>
            <div>
              <h3 class="text-xs font-black text-slate-900 uppercase tracking-wider m-0">Registrasi Bidang Lahan</h3>
              <p class="text-[10px] text-slate-400 font-bold m-0 leading-none mt-0.5">Integrasi Geografis Standar BPN</p>
            </div>
          </div>

          <!-- Form Fields -->
          <div class="space-y-1.5">
            <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest">Nama Persil / Lahan</label>
            <input id="swal-lahan-nama" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all" placeholder="Contoh: Sawah Kidul Kali">
          </div>

          <div class="space-y-1.5">
            <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest">Nama Pemilik / Kuasa</label>
            <input id="swal-lahan-pemilik" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all" placeholder="Contoh: Pak Budi Setiawan">
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1.5">
              <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest">No. SHM / Letter C</label>
              <input id="swal-lahan-shm" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all" placeholder="SHM / Letter C">
            </div>
            <div class="space-y-1.5">
              <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest">No. SPPT PBB</label>
              <input id="swal-lahan-sppt" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all" placeholder="SPPT PBB">
            </div>
          </div>

          <div class="space-y-1.5">
            <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest">Jenis Lahan</label>
            <select id="swal-lahan-jenis" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all">
              <option value="Sawah Irigasi">Sawah Irigasi</option>
              <option value="Pekarangan / Pemukiman">Pekarangan / Pemukiman</option>
              <option value="Tegalan / Kebun">Tegalan / Kebun Kering</option>
              <option value="Tanah Kas Desa (Bengkok)">Tanah Kas Desa (Bengkok)</option>
            </select>
          </div>

          <div class="space-y-1.5">
            <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest">Luas Sertifikat (M²)</label>
            <input id="swal-lahan-luas" type="number" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all" value="${Math.round(calculatedArea)}">
            <div class="flex items-center gap-1.5 mt-1 bg-orange-50/50 border border-orange-100/50 px-2 py-1.5 rounded-lg text-orange-600">
              <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span class="text-[9px] font-bold leading-none">Est. Kalkulasi GPS Sistem: ${Math.round(calculatedArea)} m²</span>
            </div>
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Petakan Bidang',
      cancelButtonText: 'Batal',
      customClass: {
        popup: 'rounded-3xl border border-slate-100 shadow-2xl p-6 bg-white max-w-md w-full',
        htmlContainer: 'text-left m-0 p-0 overflow-visible',
        actions: 'flex items-center justify-end gap-2 mt-5 border-t border-slate-100 pt-4 w-full',
        confirmButton: 'bg-orange-600 hover:bg-orange-700 text-white font-extrabold py-2 px-4 rounded-xl text-xs transition shadow-md shadow-orange-100 focus:outline-none cursor-pointer',
        cancelButton: 'bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold py-2 px-4 rounded-xl text-xs transition focus:outline-none cursor-pointer'
      },
      buttonsStyling: false,
      preConfirm: () => {
        return {
          nama: (document.getElementById('swal-lahan-nama') as HTMLInputElement).value || 'Persil Lahan Baru',
          pemilik: (document.getElementById('swal-lahan-pemilik') as HTMLInputElement).value || 'Warga Desa',
          noSurat: (document.getElementById('swal-lahan-shm') as HTMLInputElement).value || '-',
          noSppt: (document.getElementById('swal-lahan-sppt') as HTMLInputElement).value || '-',
          jenisLahan: (document.getElementById('swal-lahan-jenis') as HTMLSelectElement).value,
          luasManual: Number((document.getElementById('swal-lahan-luas') as HTMLInputElement).value) || Math.round(calculatedArea)
        };
      }
    });

    if (formValues) {
      const newPoly = {
        id: `bpn-${Date.now()}`,
        coords: drawingPoints,
        nama: formValues.nama,
        pemilik: formValues.pemilik,
        noSurat: formValues.noSurat,
        noSppt: formValues.noSppt,
        jenisLahan: formValues.jenisLahan,
        luasManual: formValues.luasManual,
        luasEst: Math.round(calculatedArea)
      };

      setCustomPolygons([...customPolygons, newPoly]);
      setDrawingPoints([]);
      setIsDrawingPolygon(false);

      Swal.fire({
        icon: 'success',
        title: 'Bidang Lahan Dipetakan',
        text: `Persil lahan "${formValues.nama}" milik ${formValues.pemilik} berhasil dipetakan sesuai standar BPN.`,
        timer: 2000,
        showConfirmButton: false,
        customClass: {
          popup: 'rounded-3xl border border-slate-100 shadow-2xl p-6 bg-white max-w-sm w-full text-center',
          title: 'text-xs font-black text-slate-950 uppercase tracking-widest mb-2',
          htmlContainer: 'text-xs font-bold text-slate-500 m-0 p-0'
        }
      });
    }
  };

  const handleDeleteCustomMarker = (id: string) => {
    if (id.startsWith('bpn-')) {
      setCustomPolygons(customPolygons.filter(p => p.id !== id));
    } else {
      setCustomMarkers(customMarkers.filter(m => m.id !== id));
    }
    setSelectedEntity(null);
    Swal.fire({
      icon: 'success',
      title: 'Data Dihapus',
      timer: 1200,
      showConfirmButton: false,
      customClass: {
        popup: 'rounded-3xl border border-slate-100 shadow-2xl p-6 bg-white max-w-sm w-full text-center',
        title: 'text-xs font-black text-slate-950 uppercase tracking-widest mb-0'
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
             <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
               <MapIcon size={20} />
             </div>
             Sistem Informasi Geografis (GIS) {dbData?.profil?.namaDesa ? `Desa ${dbData.profil.namaDesa.toUpperCase()}` : 'Desa Kediren'}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {dbData?.profil?.kecamatan && dbData?.profil?.kabupaten
              ? `Pemetaan wilayah terpadu, batas dusun, faskes, dan statistik kependudukan real-time Kecamatan ${dbData.profil.kecamatan}, Kabupaten ${dbData.profil.kabupaten}.`
              : 'Pemetaan wilayah terpadu, batas dusun, faskes, dan statistik kependudukan real-time.'
            }
          </p>
        </div>
        <div className="flex items-center gap-2">
           <button 
             onClick={() => {
               if (mapInstanceRef.current) {
                 mapInstanceRef.current.setView([-7.7610, 111.3736], 15);
               }
             }}
             className="px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-50 hover:border-slate-300 transition"
           >
             <Maximize2 size={16} /> Reset Kamera
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Sidebar Controls */}
        <div className="lg:col-span-1 space-y-6">
          {/* Active Layer Switcher */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Pilih Layer Spasial</h3>
            <div className="space-y-2">
               <LayerButton 
                 active={activeLayer === 'kependudukan'} 
                 onClick={() => { setActiveLayer('kependudukan'); setSelectedEntity(null); }}
                 icon={<Users size={16} />}
                 label="Sebaran Penduduk (RT)"
                 color="bg-purple-50 text-purple-600"
               />
               <LayerButton 
                 active={activeLayer === 'batas'} 
                 onClick={() => { setActiveLayer('batas'); setSelectedEntity(null); }}
                 icon={<Layers size={16} />}
                 label="Batas Administrasi Dusun"
                 color="bg-emerald-50 text-emerald-600"
               />
               <LayerButton 
                 active={activeLayer === 'infrastruktur'} 
                 onClick={() => { setActiveLayer('infrastruktur'); setSelectedEntity(null); }}
                 icon={<Building size={16} />}
                 label="Infrastruktur & Faskes"
                 color="bg-amber-50 text-amber-600"
               />
            </div>
          </div>

          {/* Map Base Selector */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Tipe Peta</h3>
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => setMapType('street')}
                className={`py-2 px-1 text-center rounded-xl font-bold text-[10px] uppercase border transition ${
                  mapType === 'street' ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm' : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100'
                }`}
              >
                Peta Jalan
              </button>
              <button 
                onClick={() => setMapType('satellite')}
                className={`py-2 px-1 text-center rounded-xl font-bold text-[10px] uppercase border transition ${
                  mapType === 'satellite' ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm' : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100'
                }`}
              >
                Satelit
              </button>
              <button 
                onClick={() => setMapType('dark')}
                className={`py-2 px-1 text-center rounded-xl font-bold text-[10px] uppercase border transition ${
                  mapType === 'dark' ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm' : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100'
                }`}
              >
                Modus Gelap
              </button>
            </div>
          </div>

          {/* Dynamic GIS Inspector Card */}
          <AnimatePresence mode="wait">
            {selectedEntity ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span 
                      className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider text-white"
                      style={{ backgroundColor: selectedEntity.color }}
                    >
                      {selectedEntity.tipe}
                    </span>
                    <h4 className="font-black text-slate-900 text-sm mt-1.5 leading-snug">
                      {selectedEntity.tipe === 'rt' 
                        ? `RT ${selectedEntity.rt} / RW ${selectedEntity.rw}`
                        : selectedEntity.nama
                      }
                    </h4>
                    {selectedEntity.tipe === 'rt' && (
                      <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Dusun {selectedEntity.dusun}</p>
                    )}
                  </div>
                  {(selectedEntity.tipe === 'custom' || selectedEntity.tipe === 'lahan_bpn') && (
                    <button 
                      onClick={() => handleDeleteCustomMarker(selectedEntity.id)}
                      className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                      title="Hapus Data"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                <div className="border-t border-slate-100 pt-3.5 space-y-2.5">
                  {selectedEntity.tipe === 'dusun' && (
                    <>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500 font-bold">Luas Wilayah:</span>
                        <span className="text-slate-800 font-black">{selectedEntity.luas}</span>
                      </div>
                      <p className="text-[11px] font-medium leading-relaxed text-slate-600 pt-1">{selectedEntity.deskripsi}</p>
                    </>
                  )}

                  {(selectedEntity.tipe === 'rt' || selectedEntity.tipe === 'dusun') && (
                    <>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500 font-bold">Jumlah Kepala Keluarga:</span>
                        <span className="text-indigo-600 font-black">{selectedEntity.totalKk} KK</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500 font-bold">Total Warga (Jiwa):</span>
                        <span className="text-emerald-600 font-black">{selectedEntity.totalJiwa} Orang</span>
                      </div>
                    </>
                  )}

                  {selectedEntity.tipe === 'infrastruktur' && (
                    <>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500 font-bold">Kategori:</span>
                        <span className="text-slate-800 font-black capitalize">{selectedEntity.kategori}</span>
                      </div>
                      <p className="text-[11px] font-semibold leading-relaxed text-slate-500 pt-1">{selectedEntity.deskripsi}</p>
                    </>
                  )}

                  {selectedEntity.tipe === 'custom' && (
                    <div className="space-y-2.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500 font-bold">Kategori Pemetaan:</span>
                        <span className="text-indigo-600 font-black capitalize">
                          {selectedEntity.kategori === 'rumah' ? '🏠 Rumah Warga' : 
                           selectedEntity.kategori === 'wisata' ? '🌳 Potensi/Wisata' : 
                           selectedEntity.kategori === 'faskes' ? '🏛️ Fasilitas Umum' : 
                           selectedEntity.kategori === 'sawah' ? '🌾 Pertanian' : 
                           selectedEntity.kategori === 'bengkok' ? '👑 Tanah Bengkok' : 
                           selectedEntity.kategori === 'bencana' ? '⚠️ Rawan Bencana' : 
                           selectedEntity.kategori === 'umkm' ? '🛍️ Pos UMKM' : 
                           selectedEntity.kategori}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[11px] text-slate-500 font-bold">Koordinat Geografis:</p>
                        <p className="text-xs font-mono bg-slate-50 text-slate-700 p-1.5 rounded-lg border border-slate-100 font-bold">
                          Lat: {selectedEntity.lat.toFixed(6)}<br />
                          Lng: {selectedEntity.lng.toFixed(6)}
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedEntity.tipe === 'lahan_bpn' && (
                    <div className="space-y-2.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500 font-bold">Pemilik Lahan:</span>
                        <span className="text-slate-950 font-black">{selectedEntity.pemilik}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500 font-bold">Kategori Lahan:</span>
                        <span className="text-orange-600 font-black">{selectedEntity.jenisLahan}</span>
                      </div>
                      <div className="flex justify-between text-xs border-b border-slate-100 pb-2">
                        <span className="text-slate-500 font-bold">No. SHM / Girik:</span>
                        <span className="text-slate-800 font-extrabold">{selectedEntity.noSurat}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500 font-bold">No. SPPT PBB:</span>
                        <span className="text-slate-800 font-extrabold">{selectedEntity.noSppt}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500 font-bold">Luas Sertifikat:</span>
                        <span className="text-emerald-600 font-black">{selectedEntity.luasManual} m²</span>
                      </div>
                      <div className="flex justify-between text-xs border-t border-slate-100 pt-2">
                        <span className="text-slate-400 font-semibold text-[10px]">Est. Geodesik GPS:</span>
                        <span className="text-slate-500 font-bold text-[10px]">{selectedEntity.luasEst} m²</span>
                      </div>
                      <div className="space-y-1 pt-1.5">
                        <p className="text-[11px] text-slate-500 font-bold">Koordinat Sentral:</p>
                        <p className="text-xs font-mono bg-slate-50 text-slate-700 p-1.5 rounded-lg border border-slate-100 font-bold">
                          Lat: {selectedEntity.coords[0].lat.toFixed(6)}<br />
                          Lng: {selectedEntity.coords[0].lng.toFixed(6)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="bg-slate-50 border border-dashed border-slate-200 p-6 rounded-3xl text-center">
                <Info size={24} className="text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-500">Klik marker atau wilayah pada peta untuk menginspeksi rincian data geografis.</p>
              </div>
            )}
          </AnimatePresence>

          {/* Marker Builder Panel */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Marking Peta Mandiri</h3>
              <button 
                onClick={() => {
                  setIsAddingMarker(!isAddingMarker);
                  setTempCoords(null);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition ${
                  isAddingMarker ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-indigo-55 text-indigo-700 hover:bg-indigo-100'
                }`}
              >
                {isAddingMarker ? 'Batal' : <><Plus size={13} /> Tambah Marker</>}
              </button>
            </div>

            {isAddingMarker && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-3 pt-2"
              >
                <div className="bg-rose-50 border border-rose-100 p-2.5 rounded-2xl flex gap-2">
                  <MapPin size={18} className="text-rose-500 shrink-0 mt-0.5" />
                  <p className="text-[10px] font-bold text-rose-700 leading-normal">
                    {tempCoords 
                      ? `Koordinat disetujui: ${tempCoords.lat.toFixed(5)}, ${tempCoords.lng.toFixed(5)}`
                      : 'Langkah: Klik lokasi persil rumah atau area di peta untuk mengunci koordinat.'
                    }
                  </p>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nama Marker / Pemilik KK</label>
                  <input
                    type="text"
                    value={newMarkerName}
                    onChange={(e) => setNewMarkerName(e.target.value)}
                    placeholder="Contoh: Keluarga Budi RT 03"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Kategori Lokasi</label>
                  <select
                    value={newMarkerType}
                    onChange={(e) => setNewMarkerType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="rumah">🏠 Persil Rumah Warga</option>
                    <option value="wisata">🌳 Potensi Wisata / Ruang Terbuka</option>
                    <option value="faskes">🏛️ Fasilitas Umum / Kantor Baru</option>
                    <option value="sawah">🌾 Lahan Pertanian / Perkebunan</option>
                    <option value="bengkok">👑 Tanah Kas Desa (Bengkok)</option>
                    <option value="bencana">⚠️ Titik Potensi Bencana</option>
                    <option value="umkm">🛍️ Pos UMKM / Warung Warga</option>
                  </select>
                </div>

                <button
                  onClick={handleSaveCustomMarker}
                  className="w-full bg-indigo-600 hover:bg-indigo-750 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow-md shadow-indigo-100"
                >
                  <CheckCircle2 size={14} /> Simpan Koordinat
                </button>
              </motion.div>
            )}
          </div>

          {/* BPN Cadastral Polygon Builder Panel */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pola Bidang Lahan (BPN)</h3>
                <p className="text-[9px] text-slate-400 font-bold leading-none mt-0.5">Pemetaan Poligon & Luas Tanah</p>
              </div>
              <button 
                onClick={() => {
                  setIsDrawingPolygon(!isDrawingPolygon);
                  setDrawingPoints([]);
                  setIsAddingMarker(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition ${
                  isDrawingPolygon ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-100'
                }`}
              >
                {isDrawingPolygon ? 'Batal' : <><Plus size={13} /> Petakan Bidang</>}
              </button>
            </div>

            {isDrawingPolygon && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-3 pt-2"
              >
                <div className="bg-orange-50 border border-orange-100 p-2.5 rounded-2xl flex gap-2">
                  <MapIcon size={18} className="text-orange-500 shrink-0 mt-0.5" />
                  <div className="text-[10px] font-bold text-orange-700 leading-normal">
                    <p className="font-extrabold uppercase">Langkah Menggambar:</p>
                    <p className="font-medium mt-0.5">1. Klik berurutan pada peta satelit di sudut-sudut bidang sawah/tanah warga.</p>
                    <p className="font-medium">2. Sistem akan menyatukan garis dan menghitung luas area.</p>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-500">
                    <span>Jumlah Titik Sudut:</span>
                    <span className="text-slate-800 font-extrabold">{drawingPoints.length} Titik</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-slate-500">
                    <span>Est. Luas Bidang:</span>
                    <span className="text-orange-600 font-black">{Math.round(calculatePolygonArea(drawingPoints))} m²</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    disabled={drawingPoints.length === 0}
                    onClick={() => setDrawingPoints(prev => prev.slice(0, -1))}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 font-black py-2 rounded-xl text-xs flex items-center justify-center gap-1 transition"
                  >
                    Hapus Titik
                  </button>
                  <button
                    disabled={drawingPoints.length < 3}
                    onClick={handleSavePolygon}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-black py-2 rounded-xl text-xs flex items-center justify-center gap-1 transition shadow-md shadow-orange-100"
                  >
                    Selesai & Petakan
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Map Container */}
        <div className="lg:col-span-3 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex-1 bg-slate-100 rounded-2xl overflow-hidden relative min-h-[550px] shadow-inner border border-slate-200/50">
            
            {/* Real Interactive Leaflet Map Div */}
            <div 
              ref={mapContainerRef} 
              className="w-full h-full min-h-[550px] z-0" 
            />

            {/* Float Overlay Info */}
            <div className="absolute top-4 left-4 z-[400] bg-white/90 backdrop-blur-md px-4 py-3 rounded-2xl shadow-lg border border-white/50 w-64 pointer-events-auto">
              <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-2">Legenda Aktif</p>
              
              {activeLayer === 'kependudukan' && (
                <div className="space-y-2">
                   <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-purple-500 opacity-85 shadow-sm border border-purple-200"></div><span className="text-[10px] font-bold text-slate-700">Dusun Selungguh (Ungu)</span></div>
                   <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-emerald-500 opacity-85 shadow-sm border border-emerald-200"></div><span className="text-[10px] font-bold text-slate-700">Dusun Sekadalan (Hijau)</span></div>
                   <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-blue-500 opacity-85 shadow-sm border border-blue-200"></div><span className="text-[10px] font-bold text-slate-700">Dusun Ledok (Biru)</span></div>
                </div>
              )}

              {activeLayer === 'batas' && (
                <div className="space-y-2">
                   <div className="flex items-center gap-3"><div className="w-3 h-1.5 rounded-sm bg-indigo-600 opacity-95"></div><span className="text-[10px] font-bold text-slate-800 uppercase tracking-tight">Batas Luar Desa Kediren</span></div>
                   <div className="flex items-center gap-3"><div className="w-3 h-3 rounded bg-purple-200 border-2 border-dashed border-purple-500"></div><span className="text-[10px] font-bold text-slate-700">Batas Dusun Selungguh</span></div>
                   <div className="flex items-center gap-3"><div className="w-3 h-3 rounded bg-emerald-200 border-2 border-dashed border-emerald-500"></div><span className="text-[10px] font-bold text-slate-700">Batas Dusun Sekadalan</span></div>
                   <div className="flex items-center gap-3"><div className="w-3 h-3 rounded bg-blue-200 border-2 border-dashed border-blue-500"></div><span className="text-[10px] font-bold text-slate-700">Batas Dusun Ledok</span></div>
                </div>
              )}

              {activeLayer === 'infrastruktur' && (
                <div className="space-y-2">
                   <div className="flex items-center gap-3"><div className="w-3.5 h-3.5 bg-indigo-500 border border-white shadow rounded flex items-center justify-center text-[7px] text-white font-bold">K</div><span className="text-[10px] font-bold text-slate-700">Kantor Desa & Pelayanan</span></div>
                   <div className="flex items-center gap-3"><div className="w-3.5 h-3.5 bg-amber-500 border border-white shadow rounded flex items-center justify-center text-[7px] text-white font-bold">S</div><span className="text-[10px] font-bold text-slate-700">Fasilitas Pendidikan / Sekolah</span></div>
                   <div className="flex items-center gap-3"><div className="w-3.5 h-3.5 bg-red-500 border border-white shadow rounded flex items-center justify-center text-[7px] text-white font-bold">H</div><span className="text-[10px] font-bold text-slate-700">Puskesmas Pembantu / Polindes</span></div>
                </div>
              )}
            </div>
          </div>
          
          <div className="pt-4 mt-2 border-t border-slate-50 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <span>Sistem GIS Terpadu V1.2</span>
            <span>Koordinat Desa: -7.76100, 111.37360</span>
          </div>
        </div>

      </div>
    </div>
  );
}

function LayerButton({ active, onClick, icon, label, color }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold text-xs border ${
        active ? 'border-indigo-100 bg-indigo-50/50 text-indigo-700 shadow-inner' : 'border-slate-100 bg-white text-slate-600 hover:bg-slate-50'
      }`}
    >
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${active ? 'bg-white shadow-sm' : color}`}>
        {icon}
      </div>
      {label}
    </button>
  );
}
