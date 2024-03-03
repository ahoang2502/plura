"use client";

import React, { useEffect, useState } from "react";
import { Lane, Ticket } from "@prisma/client";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";

import {
	LaneDetail,
	PipelineDetailsWithLanesCardsTagsTickets,
	TicketAndTags,
} from "@/lib/types";
import { useModal } from "@/providers/modal-providers";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CustomModal } from "@/components/global/CustomModal";
import { CreateLaneForm } from "@/components/forms/CreateLaneForm";
import { Flag, Plus } from "lucide-react";
import { PipelineLane } from "./PipelineLane";

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
	const router = useRouter();
	const { setOpen } = useModal();
	const [allLanes, setAllLanes] = useState<LaneDetail[]>([]);

	const ticketsFromAllLanes: TicketAndTags[] = [];
	lanes.forEach((item) => {
		item.Tickets.forEach((i) => {
			ticketsFromAllLanes.push(i);
		});
	});
	const [allTickets, setAllTickets] = useState(ticketsFromAllLanes);

	useEffect(() => {
		setAllLanes(lanes);
	}, [lanes]);

	const handleAddLane = () => {
		setOpen(
			<CustomModal
				title="Create a lane"
				subheading="Lanes allow you to group tickets"
			>
				<CreateLaneForm pipelineId={pipelineId} />
			</CustomModal>
		);
	};

	return (
		<DragDropContext onDragEnd={() => {}}>
			<div className="bg-white/60 dark:bg-background/60 rounded-xl p-4 use-automation-zoom-in">
				<div className="flex items-center justify-between">
					<h1 className="text-2xl">{pipelineDetails?.name}</h1>

					<Button onClick={handleAddLane} className="flex items-center gap-2">
						<Plus size={15} />
						Create lane
					</Button>
				</div>

				<Droppable
					droppableId="lanes"
					type="lane"
					direction="horizontal"
					key="lanes"
				>
					{(provided) => (
						<div
							className="flex items-center gap-x-2 overflow-scroll no-scrollbar"
							{...provided.droppableProps}
							ref={provided.innerRef}
						>
							<div className="flex mt-4">
								{allLanes.map((lane, index) => (
									<PipelineLane
										key={index}
										allTickets={allTickets}
										setAllTickets={setAllTickets}
										subaccountId={subaccountId}
										pipelineId={pipelineId}
										tickets={lane.Tickets}
										laneDetails={lane}
										index={index}
									/>
								))}

								{provided.placeholder}
							</div>
						</div>
					)}
				</Droppable>

				{allLanes.length === 0 && (
					<div className="flex items-center justify-center w-full flex-col ">
						<div className="opacity-100">
							<Flag
								width="100%"
								height="100%"
								className="text-muted-foreground"
							/>
						</div>
					</div>
				)}
			</div>
		</DragDropContext>
	);
};
