"use client";

import { Agency } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useToast } from "../ui/use-toast";
import { AlertDialog } from "../ui/alert-dialog";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { FileUpload } from "../global/FileUpload";
import { Input } from "../ui/input";

interface AgencyDetailsProps {
	data?: Partial<Agency>;
}

const FormSchema = z.object({
	name: z
		.string()
		.min(2, { message: "Agency name must be at least 2 characters" }),
	companyEmail: z.string().min(1),
	companyPhone: z.string().min(1),
	whiteLabel: z.boolean(),
	address: z.string().min(1),
	city: z.string().min(1),
	zipCode: z.string().min(1),
	state: z.string().min(1),
	country: z.string().min(1),
	agencyLogo: z.string().min(1),
});

export const AgencyDetails = ({ data }: AgencyDetailsProps) => {
	const [deletingAgency, setDeletingAgency] = useState(false);
	const router = useRouter();
	const { toast } = useToast();

	const form = useForm<z.infer<typeof FormSchema>>({
		mode: "onChange",
		resolver: zodResolver(FormSchema),
		defaultValues: {
			name: data?.name,
			companyEmail: data?.companyEmail,
			companyPhone: data?.companyPhone,
			whiteLabel: data?.whiteLabel || false,
			address: data?.address,
			city: data?.city,
			zipCode: data?.zipCode,
			state: data?.state,
			country: data?.country,
			agencyLogo: data?.agencyLogo,
		},
	});

	const isLoading = form.formState.isSubmitting;

	useEffect(() => {
		if (data) {
			form.reset(data);
		}
	}, [data]);

	const onSubmit = async () => {};

	return (
		<AlertDialog>
			<Card className="w-full">
				<CardHeader>
					<CardTitle>Agency Information</CardTitle>
					<CardDescription>
						Lets create an agency for you business. You can edit agency settings
						later from the agency settings tab.
					</CardDescription>
				</CardHeader>

				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 ">
							<FormField
								disabled={isLoading}
								control={form.control}
								name="agencyLogo"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Agency Logo</FormLabel>

										<FormControl>
											<FileUpload
												apiEndpoint="agencyLogo"
												onChange={field.onChange}
												value={field.value}
											/>
										</FormControl>

										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="flex md:flex-row gap-4">
								<FormField
									disabled={isLoading}
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Agency Name</FormLabel>

											<FormControl>
												<Input placeholder="Your agency name" {...field} />
											</FormControl>
										</FormItem>
									)}
								/>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</AlertDialog>
	);
};
