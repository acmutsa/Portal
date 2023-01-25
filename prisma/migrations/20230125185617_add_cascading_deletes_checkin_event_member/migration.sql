-- DropForeignKey
ALTER TABLE "Checkin" DROP CONSTRAINT "Checkin_eventID_fkey";

-- DropForeignKey
ALTER TABLE "Checkin" DROP CONSTRAINT "Checkin_memberID_fkey";

-- AddForeignKey
ALTER TABLE "Checkin" ADD CONSTRAINT "Checkin_eventID_fkey" FOREIGN KEY ("eventID") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Checkin" ADD CONSTRAINT "Checkin_memberID_fkey" FOREIGN KEY ("memberID") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;
