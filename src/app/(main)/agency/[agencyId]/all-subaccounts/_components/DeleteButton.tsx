"use client";

import { useRouter } from "next/navigation";
import React from "react";

import {
	deleteSubaccount,
	getSubaccountDetails,
	saveActivityLogsNotification,
} from "@/lib/queries";

interface DeleteButtonProps {
	subaccountId: string;
}

export const DeleteButton = ({ subaccountId }: DeleteButtonProps) => {
	const router = useRouter();

	return (
		<div
			onClick={async () => {
				const response = await getSubaccountDetails(subaccountId);

				await saveActivityLogsNotification({
					agencyId: undefined,
					description: `Deleted a subaccount | ${response?.name}`,
					subaccountId,
				});
				await deleteSubaccount(subaccountId);

				router.refresh();
			}}
		>
			Delete
		</div>
	);
};
