import React from "react";

import Unauthorized from "@/components/unauthorized";
import { getAuthUserDetails, verifyAndAcceptInvitation } from "@/lib/queries";
import UnauthorizedPage from "../agency/unauthorized/page";
import { redirect } from "next/navigation";

interface SubAccountMainPageProps {
	searchParams: { state: string; code: string };
}

const SubAccountMainPage = async ({
	searchParams,
}: SubAccountMainPageProps) => {
	const agencyId = await verifyAndAcceptInvitation();
	if (!agencyId) return <Unauthorized />;

	const user = await getAuthUserDetails();
	if (!user) return;

	const getFirstSubaccountWithAccess = user.Permissions.find(
		(permission) => permission.access === true
	);

	if (searchParams.state) {
		const statePath = searchParams.state.split("___")[0];
		const stateSubaccountId = searchParams.state.split("___")[1];

		if (!stateSubaccountId) return <UnauthorizedPage />;

		return redirect(
			`/subaccount/${stateSubaccountId}/${statePath}?code=${searchParams.code}`
		);
	}

	if (getFirstSubaccountWithAccess) {
		return redirect(`/subaccount/${getFirstSubaccountWithAccess.subAccountId}`);
	}

	return <Unauthorized />;
};

export default SubAccountMainPage;
