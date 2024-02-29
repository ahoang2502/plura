"use client";

import React from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { useToast } from "../ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { createMedia, saveActivityLogsNotification } from "@/lib/queries";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { FileUpload } from "../global/FileUpload";

interface UploadMediaFormProps {
	subaccountId: string;
}

const formSchema = z.object({
	link: z.string().min(1, { message: "Media file is required" }),
	name: z.string().min(1, { message: "Name is required" }),
});

export const UploadMediaForm = ({ subaccountId }: UploadMediaFormProps) => {
	const router = useRouter();
	const { toast } = useToast();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			link: "",
			name: "",
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			const response = await createMedia(subaccountId, values);

			await saveActivityLogsNotification({
				agencyId: undefined,
				description: `Uploaded a media file \ ${response.name}`,
				subaccountId,
			});

			toast({
				title: "Success",
				description: "Media uploaded successfully!",
			});
			router.refresh();
		} catch (error) {
			toast({
				title: "Failed to upload",
				description: "Something went wrong, please try again!",
				variant: "destructive",
			});
		}
	};

	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle>Media Information</CardTitle>

				<CardDescription>
					Please fill in the details for your file
				</CardDescription>
			</CardHeader>

			<CardContent>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4 flex flex-col"
					>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem className="flex-1">
									<FormLabel className="text-xs font-semibold">
										File Name
									</FormLabel>
									<FormControl>
										<Input placeholder="Enter your file name" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="link"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-xs font-semibold">
										Media File
									</FormLabel>
									<FormControl>
										<FileUpload
											apiEndpoint="subaccountLogo"
											value={field.value}
											onChange={field.onChange}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button type="submit" className="self-end">
							Upload
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
};
