"use client";

import { Lane } from "@prisma/client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { useModal } from "@/providers/modal-providers";
import { LaneFormSchema } from "@/lib/types";
import {
	getPipelineDetails,
	saveActivityLogsNotification,
	upsertLane,
} from "@/lib/queries";
import { toast } from "../ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface CreateLaneFormProps {
	pipelineId: string;
	defaultData?: Lane;
}

export const CreateLaneForm = ({
	pipelineId,
	defaultData,
}: CreateLaneFormProps) => {
	const { setClose } = useModal();
	const router = useRouter();

	const form = useForm<z.infer<typeof LaneFormSchema>>({
		mode: "onChange",
		resolver: zodResolver(LaneFormSchema),
		defaultValues: {
			name: defaultData?.name || "",
		},
	});

	useEffect(() => {
		if (defaultData) {
			form.reset({
				name: defaultData.name || "",
			});
		}
	}, [defaultData]);

	const isLoading = form.formState.isLoading;

	const onSubmit = async (values: z.infer<typeof LaneFormSchema>) => {
		if (!pipelineId) return;
		try {
			const response = await upsertLane({
				...values,
				id: defaultData?.id,
				pipelineId: pipelineId,
				order: defaultData?.order,
			});

			const d = await getPipelineDetails(pipelineId);
			if (!d) return;

			await saveActivityLogsNotification({
				agencyId: undefined,
				description: `Updated a lane | ${response?.name}`,
				subaccountId: d.subAccountId,
			});

			toast({
				title: "Success",
				description: "Saved pipeline details",
			});

			router.refresh();
		} catch (error) {
			toast({
				variant: "destructive",
				title: "Oppse!",
				description: "Could not save pipeline details",
			});
		}
		setClose();
	};
	return (
		<Card className="w-full ">
			<CardHeader>
				<CardTitle>Lane Details</CardTitle>
			</CardHeader>

			<CardContent>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex flex-col gap-4"
					>
						<FormField
							disabled={isLoading}
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-xs font-semibold">
										Lane Name
									</FormLabel>

									<FormControl>
										<Input placeholder="Enter lane name here..." {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button className="w-20 mt-4" disabled={isLoading} type="submit">
							{form.formState.isSubmitting ? (
								<Loader2 className="w-4 h-4 mr-1 animate-spin" />
							) : null}
							Save
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
};
