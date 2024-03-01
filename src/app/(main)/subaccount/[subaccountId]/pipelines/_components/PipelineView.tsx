"use client";

import React from "react";
import { Lane, Ticket } from "@prisma/client";

import {
	LaneDetail,
	PipelineDetailsWithLanesCardsTagsTickets,
} from "@/lib/types";

interface PipelineViewProps {
	lanes: LaneDetail[];
	pipelineId: string;
	subaccountId: string;
	pipelineDetails: PipelineDetailsWithLanesCardsTagsTickets;
	updateLanesOrder: (lanes: Lane[]) => Promise<void>;
	updateTicketsOrder: (tickets: Ticket[]) => Promise<void>;
}

export const PipelineView = ({
	lanes,
	pipelineDetails,
	pipelineId,
	subaccountId,
	updateLanesOrder,
	updateTicketsOrder,
}: PipelineViewProps) => {
    
	return <div></div>;
};
