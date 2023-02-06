-- DropForeignKey
ALTER TABLE "MemberData" DROP CONSTRAINT "MemberData_memberID_fkey";

-- AddForeignKey
ALTER TABLE "MemberData" ADD CONSTRAINT "MemberData_memberID_fkey" FOREIGN KEY ("memberID") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;
