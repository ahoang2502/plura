import React from "react";
import { Plus } from "lucide-react";
import { currentUser } from "@clerk/nextjs";

import { db } from "@/lib/db";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { SendInvitation } from "@/components/forms/SendInvitation";

interface TeamPageProps {
	params: {
		agencyId: string;
	};
}

const TeamPage = async ({ params }: TeamPageProps) => {
	const authUser = await currentUser();
	if (!authUser) return null;

	const teamMembers = await db.user.findMany({
		where: {
			Agency: {
				id: params.agencyId,
			},
		},
		include: {
			Agency: {
				include: {
					SubAccount: true,
				},
			},
			Permissions: {
				include: {
					SubAccount: true,
				},
			},
		},
	});

	const agencyDetails = await db.agency.findUnique({
		where: {
			id: params.agencyId,
		},
		include: {
			SubAccount: true,
		},
	});
	if (!agencyDetails) return;

	return (
		<DataTable
			actionButtonText={
				<>
					<Plus size={15} />
					Add
				</>
			}
			modalChildren={<SendInvitation agencyId={agencyDetails.id} />}
			filterValue="name"
			columns={columns}
			data={teamMembers}
		/>
	);
};

export default TeamPage;
