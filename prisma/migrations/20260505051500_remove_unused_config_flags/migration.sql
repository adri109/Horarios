-- Eliminar flags de configuración que no se usaban en ninguna lógica de negocio
-- (eran decorativas en el formulario de registro y panel de configuración).
ALTER TABLE "Config" DROP COLUMN IF EXISTS "requireConfirmation";
ALTER TABLE "Config" DROP COLUMN IF EXISTS "workersCanCreateServices";
ALTER TABLE "Config" DROP COLUMN IF EXISTS "canAcceptAppointments";
