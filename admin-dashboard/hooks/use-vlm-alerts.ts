'use client';

import * as React from 'react';
import { toast } from 'sonner';

export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low';
export type AlertStatus = 'active' | 'acknowledged' | 'resolved';

export interface VLMAlert {
  id: string;
  alert_id?: string;
  title: string;
  site: string;
  timestamp: string;
  severity: AlertSeverity;
  status: AlertStatus;
  hazard_type?: string;
  hazards_detail?: string;
  decision?: string;
  sop_reference?: string;
  audio_alert_text?: string;
  raw_model_response?: string;
  worker_in_danger?: boolean;
  processing_time_ms?: number;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export function useVLMAlerts() {
  const [alerts, setAlerts] = React.useState<VLMAlert[]>([]);
  const [dbIncidents, setDbIncidents] = React.useState<any[]>([]);
  const [isConnected, setIsConnected] = React.useState<boolean>(false);
  const [isScanning, setIsScanning] = React.useState<boolean>(false);
  const [vlmStatus, setVlmStatus] = React.useState<string>('Connecting to VLM Backend...');

  // Normalize alert object from VLM/DB backend format into standard VLMAlert
  const normalizeAlert = React.useCallback((item: any): VLMAlert => {
    const rawSev = (item.severity_level || item.severity || 'INFO').toString().toUpperCase();
    let mappedSev: AlertSeverity = 'medium';
    if (rawSev === 'CRITICAL') mappedSev = 'critical';
    else if (rawSev === 'WARNING' || rawSev === 'HIGH') mappedSev = 'high';
    else if (rawSev === 'LOW' || rawSev === 'INFO') mappedSev = 'medium';
    else mappedSev = 'low';

    let detailsText = '';
    if (typeof item.hazards_detail === 'string') {
      detailsText = item.hazards_detail;
    } else if (Array.isArray(item.hazards_detail) && item.hazards_detail.length > 0) {
      detailsText = item.hazards_detail.map((h: any) => h.description || h.type).join('; ');
    } else if (item.description) {
      detailsText = item.description;
    } else if (item.audio_alert_text) {
      detailsText = item.audio_alert_text;
    } else {
      detailsText = 'Hazard detected by VLM scene scan.';
    }

    const titleText = item.hazard_type
      ? `VLM Alert: ${item.hazard_type}`
      : item.title || (detailsText.length > 45 ? detailsText.substring(0, 45) + '...' : detailsText);

    return {
      id: item.alert_id || item.id || `vlm-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      alert_id: item.alert_id || item.id,
      title: titleText,
      site: item.site || item.location || 'Site A — Camera Stream',
      timestamp: item.recorded_at ? new Date(item.recorded_at).toLocaleTimeString() : (item.timestamp || 'Just now'),
      severity: mappedSev,
      status: item.status || 'active',
      hazard_type: item.hazard_type || 'General Hazard',
      hazards_detail: detailsText,
      decision: item.decision || 'WARN_WORKER',
      sop_reference: item.sop_reference || '',
      audio_alert_text: item.audio_alert_text || '',
      raw_model_response: item.raw_model_response || '',
      worker_in_danger: item.worker_in_danger || false,
      processing_time_ms: item.processing_time_ms || 0,
    };
  }, []);

  // Fetch recent alerts and database incidents on mount
  const fetchInitialData = React.useCallback(async () => {
    try {
      // 1. Fetch recent alert history
      const alertsRes = await fetch(`${BACKEND_URL}/api/alerts?limit=20`);
      if (alertsRes.ok) {
        const data = await alertsRes.json();
        if (data.alerts && Array.isArray(data.alerts)) {
          const formatted = data.alerts.map(normalizeAlert);
          setAlerts(formatted);
        }
      }

      // 2. Fetch database incidents from audit DB
      const auditRes = await fetch(`${BACKEND_URL}/api/audit/incidents?limit=20`);
      if (auditRes.ok) {
        const auditData = await auditRes.json();
        if (auditData.incidents && Array.isArray(auditData.incidents)) {
          setDbIncidents(auditData.incidents);
        }
      }

      setVlmStatus('VLM Backend & Database Connected');
      setIsConnected(true);
    } catch (err) {
      console.warn('VLM Backend offline or unreachable:', err);
      setVlmStatus('VLM Backend Offline (Run FastAPI backend on port 8000)');
      setIsConnected(false);
    }
  }, [normalizeAlert]);

  // Connect to SSE real-time stream
  React.useEffect(() => {
    fetchInitialData();

    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource(`${BACKEND_URL}/api/alerts/stream`);

      eventSource.onopen = () => {
        setIsConnected(true);
        setVlmStatus('Live SSE Emergency Stream Connected');
      };

      eventSource.onmessage = (event) => {
        try {
          const alertData = JSON.parse(event.data);
          const newAlert = normalizeAlert(alertData);

          setAlerts((prev) => {
            if (prev.some((a) => a.id === newAlert.id)) return prev;
            return [newAlert, ...prev];
          });

          // Show immediate Toast notification for emergency alerts
          if (newAlert.severity === 'critical' || newAlert.severity === 'high') {
            toast.error(`EMERGENCY DETECTED BY VLM: ${newAlert.title}`, {
              description: `${newAlert.site} — ${newAlert.hazards_detail}`,
              duration: 8000,
            });
          } else {
            toast.warning(`VLM Safety Alert: ${newAlert.title}`, {
              description: `${newAlert.site} — ${newAlert.hazards_detail}`,
            });
          }
        } catch (e) {
          console.error('Failed to parse SSE alert event:', e);
        }
      };

      eventSource.onerror = () => {
        setIsConnected(false);
        setVlmStatus('Reconnecting VLM Alert Stream...');
      };
    } catch (err) {
      console.warn('Failed to establish SSE stream:', err);
    }

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [fetchInitialData, normalizeAlert]);

  // Trigger manual VLM frame detection scan
  const triggerVLMScan = React.useCallback(async (imageBase64?: string, workerQuery?: string) => {
    setIsScanning(true);
    try {
      const payload: any = {};
      if (imageBase64) payload.image_base64 = imageBase64;
      if (workerQuery) payload.worker_query = workerQuery;

      const res = await fetch(`${BACKEND_URL}/api/detect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}: ${res.statusText}`);
      }

      const result = await res.json();
      const newAlert = normalizeAlert(result);

      if (result.hazard_detected || newAlert.severity === 'critical' || newAlert.severity === 'high') {
        toast.error(`EMERGENCY DETECTED: ${newAlert.title}`, {
          description: `${newAlert.hazards_detail}`,
          duration: 7000,
        });
      } else {
        toast.success(`VLM Scan Completed: ${result.severity_level || 'SAFE'}`, {
          description: result.hazards_detail || 'No immediate emergency detected.',
        });
      }

      await fetchInitialData();
      return result;
    } catch (err: any) {
      toast.error('VLM Scan Error', { description: err.message || 'Failed to connect to VLM engine' });
      throw err;
    } finally {
      setIsScanning(false);
    }
  }, [fetchInitialData, normalizeAlert]);

  const resolveAlert = React.useCallback((id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    toast.success('Emergency Alert Resolved', {
      description: `Alert ID ${id} marked as resolved in dashboard.`,
    });
  }, []);

  return {
    alerts,
    dbIncidents,
    isConnected,
    isScanning,
    vlmStatus,
    triggerVLMScan,
    resolveAlert,
    refetch: fetchInitialData,
  };
}
