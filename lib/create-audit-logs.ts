import { auth, currentUser } from "@clerk/nextjs";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { db } from "./db";

interface Props {
  entityType: ENTITY_TYPE;
  entityTitle: string;
  entityId: string;
  action: ACTION;
}

export const createAuditLog = async (props: Props) => {
  try {
    const { orgId } = auth();
    const user = await currentUser();

    if (!orgId || !user) {
      throw new Error("User not found");
    }

    const { action, entityId, entityTitle, entityType } = props;

    await db.auditLog.create({
      data: {
        action,
        entityId,
        entityTitle,
        entityType,
        orgId,
        userId: user.id,
        userImage: user.imageUrl,
        userName: `${user.firstName} ${user.lastName}`,
      },
    });
  } catch (error) {
    console.log("[CREATE AUDIT LOG ERROR]", error);
  }
};
