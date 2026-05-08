-- AddForeignKey
ALTER TABLE "OrganizationJoinRequest"
ADD CONSTRAINT "OrganizationJoinRequest_reviewedById_fkey"
FOREIGN KEY ("reviewedById") REFERENCES "User"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitation"
ADD CONSTRAINT "Invitation_invitedById_fkey"
FOREIGN KEY ("invitedById") REFERENCES "User"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DynamicQRSession"
ADD CONSTRAINT "DynamicQRSession_organizationId_fkey"
FOREIGN KEY ("organizationId") REFERENCES "Organization"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
