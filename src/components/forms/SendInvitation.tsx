"use client";

import React from "react";
import { z } from "zod";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
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
import { Input } from "../ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { saveActivityLogsNotification, sendInvitation } from "@/lib/queries";
import { useToast } from "../ui/use-toast";

interface SendInvitationProps {
	agencyId: string;
}

export const SendInvitation: React.FC<SendInvitationProps> = ({ agencyId }) => {
	const { toast } = useToast();
	const userDataSchema = z.object({
		email: z.string().email(),
		role: z.enum(["AGENCY_ADMIN", "SUBACCOUNT_USER", "SUBACCOUNT_GUEST"]),
	});

	const form = useForm<z.infer<typeof userDataSchema>>({
		resolver: zodResolver(userDataSchema),
		mode: "onChange",
		defaultValues: {
			email: "",
			role: "SUBACCOUNT_USER",
		},
	});

	const onSubmit = async (values: z.infer<typeof userDataSchema>) => {
		try {
			const res = await sendInvitation(values.role, values.email, agencyId);
			await saveActivityLogsNotification({
				agencyId: agencyId,
				description: `Invited ${res.email}`,
				subaccountId: undefined,
			});
			toast({
				title: "Success",
				description: "Created and sent invitation",
			});
		} catch (error) {
			console.log(error);
			toast({
				variant: "destructive",
				title: "Oppse!",
				description: "Could not send invitation",
			});
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Invitation</CardTitle>
				<CardDescription>
					An invitation will be sent to the user. Users who already have an
					invitation sent out to their email, will not receive another
					invitation.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex flex-col gap-6"
					>
						<FormField
							disabled={form.formState.isSubmitting}
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem className="flex-1">
									<FormLabel className="text-xs font-bold">Email</FormLabel>
									<FormControl>
										<Input placeholder="Email" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							disabled={form.formState.isSubmitting}
							control={form.control}
							name="role"
							render={({ field }) => (
								<FormItem className="flex-1">
									<FormLabel className="text-xs font-bold">User Role</FormLabel>
									<Select
										onValueChange={(value) => field.onChange(value)}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select user role..." />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="AGENCY_ADMIN">Agency Admin</SelectItem>
											<SelectItem value="SUBACCOUNT_USER">
												Sub Account User
											</SelectItem>
											<SelectItem value="SUBACCOUNT_GUEST">
												Sub Account Guest
											</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button
							disabled={form.formState.isSubmitting}
							type="submit"
							className="font-semibold"
						>
							{form.formState.isSubmitting ? (
								<Loader className="w-4 h-4 mr-1 animate-spin" />
							) : null}
							Send invitation
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
};
