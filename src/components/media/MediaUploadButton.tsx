"use client";

import React from "react";

import { useModal } from "@/providers/modal-providers";
import { Button } from "../ui/button";
import { CustomModal } from "../global/CustomModal";
import { UploadMediaForm } from "../forms/UploadMediaForm";

interface MediaUploadButtonProps {
	subaccountId: string;
}

export const MediaUploadButton = ({ subaccountId }: MediaUploadButtonProps) => {
	const { isOpen, setOpen, setClose } = useModal();

	return (
		<Button
			onClick={() => {
				setOpen(
					<CustomModal
						title="Upload Media"
						subheading="Upload a file to your media bucket"
					>
						<UploadMediaForm subaccountId={subaccountId} />
					</CustomModal>
				);
			}}
		>
			Upload
		</Button>
	);
};
