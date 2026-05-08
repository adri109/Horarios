-- Performance: listados por salón (via serviceId), rangos de fechas y agregados por estado
CREATE INDEX IF NOT EXISTS "Appointment_startTime_idx" ON "Appointment"("startTime");
CREATE INDEX IF NOT EXISTS "Appointment_serviceId_startTime_idx" ON "Appointment"("serviceId", "startTime");
CREATE INDEX IF NOT EXISTS "Appointment_status_startTime_idx" ON "Appointment"("status", "startTime");
