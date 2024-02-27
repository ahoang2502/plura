"use client";

import { Agency, AgencySidebarOption, SubAccount, User } from "@prisma/client";
import { PlusCircleIcon } from "lucide-react";
import React from "react";
import { twMerge } from "tailwind-merge";

import { Button } from "@/components/ui/button";
import { CustomModal } from "@/components/global/CustomModal";
import { SubAccountDetails } from "@/components/forms/SubAccountDetails";
import { useModal } from "@/providers/modal-providers";

type Props = {
	user: User & {
		Agency:
			| (
					| Agency
					| (null & {
							SubAccount: SubAccount[];
							SideBarOption: AgencySidebarOption[];
					  })
			  )
			| null;
	};
	id: string;
	className: string;
};

export const CreateSubaccountButton = ({ className, id, user }: Props) => {
	const { setOpen } = useModal();

	const agencyDetails = user.Agency;

	if (!agencyDetails) return;

	return (
		<Button
			className={twMerge("w-full flex gap-2", className)}
			onClick={() => {
				setOpen(
					<CustomModal
						title="Create a sub-account"
						subheading="Details can be changed later in settings"
					>
						<SubAccountDetails
							agencyDetails={agencyDetails}
							userId={user.id}
							userName={user.name}
						/>
					</CustomModal>
				);
			}}
		>
			<PlusCircleIcon size={15} />
			Create sub-account
		</Button>
	);
};
