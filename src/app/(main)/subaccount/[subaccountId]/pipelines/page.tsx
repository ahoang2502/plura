import React from "react";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";

interface PipelinesPageProps {
	params: {
		subaccountId: string;
	};
}

const PipelinesPage = async ({ params }: PipelinesPageProps) => {
	const pipelineExists = await db.pipeline.findFirst({
		where: {
			subAccountId: params.subaccountId,
		},
	});

	if (pipelineExists)
		return redirect(
			`/subaccount/${params.subaccountId}/pipelines/${pipelineExists.id}`
		);

	try {
		const response = await db.pipeline.create({
			data: { name: "First Pipeline", subAccountId: params.subaccountId },
		});

		return redirect(
			`/subaccount/${params.subaccountId}/pipelines/${response.id}`
		);
	} catch (error) {
		console.log("🔴 [PIPELINE_CREATE]", error);
	}

	return <div></div>;
};

export default PipelinesPage;
