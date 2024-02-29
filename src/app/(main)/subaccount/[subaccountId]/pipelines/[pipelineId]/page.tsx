import React from "react";

import { getPipelineDetails } from "@/lib/queries";

interface PipelineIdPageProps {
  params:{
    subaccountId:string;
    pipelineId:string
  }
}

const PipelineIdPage = async ( {params}:PipelineIdPageProps) => {
  const pipelineDetails = await getPipelineDetails(params.pipelineId)
	return <div></div>;
};

export default PipelineIdPage;
