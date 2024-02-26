"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Agency } from "@prisma/client";
import { NumberInput } from "@tremor/react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { v4 } from "uuid";
import * as z from "zod";

import {
	deleteAgency,
	initUser,
	saveActivityLogsNotification,
	updateAgencyDetails,
	upsertAgency,
} from "@/lib/queries";
import { FileUpload } from "../global/FileUpload";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
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
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { useToast } from "../ui/use-toast";

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

	const onSubmit = async (values: z.infer<typeof FormSchema>) => {
		try {
			let newUserData;
			let customerId;

			if (!data?.id) {
				const bodyData = {
					email: values.companyEmail,
					name: values.name,
					shipping: {
						address: {
							city: values.city,
							country: values.country,
							line1: values.address,
							postal_code: values.zipCode,
							state: values.zipCode,
						},
						name: values.name,
					},
					address: {
						city: values.city,
						country: values.country,
						line1: values.address,
						postal_code: values.zipCode,
						state: values.zipCode,
					},
				};
			}

			// WIP: custId
			newUserData = await initUser({ role: "AGENCY_OWNER" });

			if (!data?.id) {
				await upsertAgency({
					id: data?.id ? data.id : v4(),

					address: values.address,
					agencyLogo: values.agencyLogo,
					city: values.city,
					companyPhone: values.companyPhone,
					country: values.country,
					name: values.name,
					state: values.state,
					whiteLabel: values.whiteLabel,
					zipCode: values.zipCode,
					createdAt: new Date(),
					updatedAt: new Date(),
					companyEmail: values.companyEmail,
					connectAccountId: "",
					goal: 5,
				});

				toast({
					title: "Agency created successfully!",
				});

				return router.refresh();
			}
		} catch (error) {
			console.log("AGENCY_FORM_SUBMIT", error);

			toast({
				title: "Oops!",
				description: "Could not create your agency, please try again.",
				variant: "destructive",
			});
		}
	};

	const handleDeleteAgency = async () => {
		if (!data?.id) return;

		setDeletingAgency(true);
		// WIP: discontinue the subscription

		try {
			await deleteAgency(data.id);

			toast({
				title: "Agency deleted successfully!",
				description: "Your agency and all subaccounts have been deleted",
			});

			router.refresh();
		} catch (error) {
			console.log("[DELETE_AGENCY]", error);

			toast({
				title: "Oops!",
				description: "Could not delete your agency, please try again.",
				variant: "destructive",
			});
		}

		setDeletingAgency(false);
	};

	return (
		<AlertDialog>
			<Card className="w-full">
				<CardHeader className="space-y-2">
					<CardTitle>Agency Information</CardTitle>
					<CardDescription>
						Let&apos;s create an agency for you business. You can edit agency
						settings later from the agency settings tab.
					</CardDescription>
				</CardHeader>

				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
							<FormField
								disabled={isLoading}
								control={form.control}
								name="agencyLogo"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-xs font-bold">
											Agency Logo
										</FormLabel>

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
								{/* Name */}
								<FormField
									disabled={isLoading}
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem className="flex-1">
											<FormLabel className="text-xs font-bold">
												Agency Name
											</FormLabel>

											<FormControl>
												<Input placeholder="Your agency name" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								{/* Company Email */}
								<FormField
									disabled={isLoading}
									control={form.control}
									name="companyEmail"
									render={({ field }) => (
										<FormItem className="flex-1">
											<FormLabel className="text-xs font-bold">
												Agency Email
											</FormLabel>

											<FormControl>
												<Input placeholder="Email" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<div className="flex md:flex-row gap-4">
								{/* Phone */}
								<FormField
									disabled={isLoading}
									control={form.control}
									name="companyPhone"
									render={({ field }) => (
										<FormItem className="flex-1">
											<FormLabel className="text-xs font-bold">
												Agency Phone Number
											</FormLabel>

											<FormControl>
												<Input placeholder="Phone number" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							{/* White Label */}
							<FormField
								disabled={isLoading}
								control={form.control}
								name="whiteLabel"
								render={({ field }) => {
									return (
										<FormItem className="flex flex-row items-center justify-between rounded-lg border gap-4 p-4">
											<div>
												<FormLabel className="text-xs font-bold">
													Whitelabel Agency
												</FormLabel>
												<FormDescription>
													Turning on whilelabel mode will show your agency logo
													to all sub accounts by default. You can overwrite this
													functionality through sub account settings.
												</FormDescription>
											</div>

											<FormControl>
												<Switch
													checked={field.value}
													onCheckedChange={field.onChange}
												/>
											</FormControl>
										</FormItem>
									);
								}}
							/>

							{/* Address */}
							<FormField
								disabled={isLoading}
								control={form.control}
								name="address"
								render={({ field }) => (
									<FormItem className="flex-1">
										<FormLabel className="text-xs font-bold">Address</FormLabel>
										<FormControl>
											<Input placeholder="123 st..." {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="flex md:flex-row gap-4">
								{/* City */}
								<FormField
									disabled={isLoading}
									control={form.control}
									name="city"
									render={({ field }) => (
										<FormItem className="flex-1">
											<FormLabel className="text-xs font-bold">City</FormLabel>
											<FormControl>
												<Input placeholder="City" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								{/* State */}
								<FormField
									disabled={isLoading}
									control={form.control}
									name="state"
									render={({ field }) => (
										<FormItem className="flex-1">
											<FormLabel className="text-xs font-bold">State</FormLabel>
											<FormControl>
												<Input placeholder="State" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								{/* Zip Code */}
								<FormField
									disabled={isLoading}
									control={form.control}
									name="zipCode"
									render={({ field }) => (
										<FormItem className="flex-1">
											<FormLabel className="text-xs font-bold">
												Zipcode
											</FormLabel>
											<FormControl>
												<Input placeholder="Zip code" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							{/* Country */}
							<FormField
								disabled={isLoading}
								control={form.control}
								name="country"
								render={({ field }) => (
									<FormItem className="flex-1">
										<FormLabel className="text-xs font-bold">Country</FormLabel>
										<FormControl>
											<Input placeholder="Country" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Sub-account Goal */}
							{data?.id && (
								<div className="flex flex-col gap-3">
									<FormLabel className="mt-1 font-bold text-xs">
										Create A Goal
									</FormLabel>
									<FormDescription>
										✨ Create a goal for your agency. As your business grows
										your goals grow too so dont forget to set the bar higher!
									</FormDescription>

									<NumberInput
										defaultValue={data?.goal}
										onValueChange={async (value) => {
											if (!data?.id) return;

											await updateAgencyDetails(data.id, { goal: value });
											await saveActivityLogsNotification({
												agencyId: data.id,
												description: `Updated the agency goal to | ${value} Sub Accounts`,
												subaccountId: undefined,
											});

											router.refresh();
										}}
										min={1}
										className="bg-background !border !border-input rounded-md"
										placeholder="Sub Account Goal"
									/>
								</div>
							)}

							<Button type="submit" disabled={isLoading}>
								{isLoading ? (
									<Loader2 className="h-4 w-4 animate-spin mr-1" />
								) : null}
								Save Agency Information
							</Button>
						</form>
					</Form>

					{data?.id && (
						<div className="flex flex-row items-center justify-between rounded-lg border border-destructive gap-4 p-4 mt-4">
							<div className="">
								<div className="truncate">Danger Zone</div>
							</div>

							<div className="text-muted-foreground text-sm">
								Deleting your agency cannot be undone. This will also delete all
								sub accounts and all data related to your sub accounts. Sub
								accounts will no longer have access to funnels, contacts etc.
							</div>

							<AlertDialogTrigger
								disabled={isLoading || deletingAgency}
								className="text-red-600 font-medium p-2 text-center mt-2 rounded-md dark:border-[0.5px] dark:border-slate-500 dark:bg-slate-900 dark:hover:bg-red-600 dark:hover:text-white dark:hover:border-red-600 whitespace-nowrap transition-all"
							>
								{deletingAgency ? "Deleting..." : "Delete Agency"}
							</AlertDialogTrigger>
						</div>
					)}

					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle className="text-left">
								Are you absolutely sure?
							</AlertDialogTitle>
							<AlertDialogDescription className="text-left">
								This action cannot be undone. This will permanently delete the
								Agency account and all related sub accounts.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter className="flex items-center">
							<AlertDialogCancel className="mb-2">Cancel</AlertDialogCancel>
							<AlertDialogAction
								disabled={deletingAgency}
								className="bg-destructive hover:bg-destructive"
								onClick={handleDeleteAgency}
							>
								Delete
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</CardContent>
			</Card>
		</AlertDialog>
	);
};
