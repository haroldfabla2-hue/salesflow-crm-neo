/**
 * ============================================================================
 * CALL INGESTION UTILITY FOR SALESFLOW CRM (ENTERPRISE GRADE)
 * Purpose: Modular, Provider-Agnostic Call Ingestion Pipeline
 * Integrates: Twilio Webhooks, Manual Mobile Audio Uploads, and n8n nodes.
 * ============================================================================
 */

/**
 * Normalizes call records from different input sources into a single schema.
 * @param {Object} rawPayload Input payload from the source
 * @param {string} sourceType 'twilio' | 'manual_mobile' | 'n8n_webhook'
 * @returns {Object} Normalized Call Record Object
 */
function normalizeCall(rawPayload, sourceType) {
    let normalized = {
        lead_id: null,
        agent_id: null,
        duration_seconds: 0,
        audio_recording_url: null,
        transcript_text: '',
        meta: {}
    };

    switch (sourceType) {
        case 'twilio':
            // Normalize standard Twilio Webhook parameters (e.g., CallSid, RecordingUrl, CallDuration)
            normalized.lead_id = rawPayload.lead_id || null; // Passed via custom SIP header or URL param
            normalized.agent_id = rawPayload.agent_id || null;
            normalized.duration_seconds = parseInt(rawPayload.CallDuration || rawPayload.Duration || '0', 10);
            normalized.audio_recording_url = rawPayload.RecordingUrl || null;
            normalized.transcript_text = rawPayload.TranscriptText || '';
            normalized.meta = {
                twilio_call_sid: rawPayload.CallSid,
                from: rawPayload.From,
                to: rawPayload.To,
                status: rawPayload.CallStatus
            };
            break;

        case 'manual_mobile':
            // Normalize manual file uploads from mobile phones (Android/iOS Call Recorder app sync)
            if (!rawPayload.lead_id || !rawPayload.agent_id) {
                throw new Error('[IngestError]: La carga manual desde móviles requiere lead_id y agent_id obligatoriamente.');
            }
            normalized.lead_id = rawPayload.lead_id;
            normalized.agent_id = rawPayload.agent_id;
            normalized.duration_seconds = parseInt(rawPayload.duration_seconds || '0', 10);
            normalized.audio_recording_url = rawPayload.audio_file_url || null; // URL of uploaded file on S3
            normalized.transcript_text = rawPayload.transcript_text || '';
            normalized.meta = {
                upload_filename: rawPayload.filename,
                uploaded_at: new Date().toISOString(),
                source_device: rawPayload.device_model || 'Mobile Device'
            };
            break;

        case 'n8n_webhook':
            // Universal webhook structure mapped from n8n nodes
            normalized.lead_id = rawPayload.lead_id;
            normalized.agent_id = rawPayload.agent_id;
            normalized.duration_seconds = parseInt(rawPayload.duration || '0', 10);
            normalized.audio_recording_url = rawPayload.recording_url || null;
            normalized.transcript_text = rawPayload.transcript || '';
            normalized.meta = rawPayload.custom_metadata || {};
            break;

        default:
            throw new Error(`[IngestError]: Tipo de origen de llamada no soportado: ${sourceType}`);
    }

    // Validate absolute minimum data integrity
    if (!normalized.lead_id) {
        throw new Error('[IngestError]: No se pudo normalizar la llamada. Se requiere vincular a un lead_id.');
    }
    if (!normalized.agent_id) {
        throw new Error('[IngestError]: No se pudo normalizar la llamada. Se requiere vincular a un agent_id.');
    }

    return normalized;
}

/**
 * Assesses whether a normalized call is eligible for QA audit.
 * Standard rules: must have recording URL and duration > 10 seconds.
 * @param {Object} normalizedCall 
 * @returns {Object} { eligible: boolean, reason: string }
 */
function evaluateQAEligibility(normalizedCall) {
    if (!normalizedCall.audio_recording_url) {
        return { eligible: false, reason: 'Falta la grabación de audio de la interacción.' };
    }
    if (normalizedCall.duration_seconds <= 10) {
        return { eligible: false, reason: 'La llamada es demasiado corta para ser auditada (menor o igual a 10 segundos).' };
    }
    return { eligible: true, reason: 'Llamada elegible para proceso de auditoría y rúbrica.' };
}

module.exports = {
    normalizeCall,
    evaluateQAEligibility
};
