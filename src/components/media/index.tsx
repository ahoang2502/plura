import React from "react";
import { FolderSearch } from "lucide-react";

import { GetMediaFiles } from "@/lib/types";
import { MediaUploadButton } from "./MediaUploadButton";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "../ui/command";
import { MediaCard } from "./MediaCard";

interface MediaComponentProps {
	data: GetMediaFiles;
	subaccountId: string;
}

export const MediaComponent = ({ data, subaccountId }: MediaComponentProps) => {
	return (
		<div className="flex flex-col gap-4 h-full w-full ">
			<div className="flex justify-between items-center">
				<h1 className="text-4xl ">Media Bucket</h1>

				<MediaUploadButton subaccountId={subaccountId} />
			</div>

			<Command className="bg-transparent ">
				<CommandInput placeholder="Search for file name..." />

				<CommandList className="pb-40 max-h-full">
					<CommandEmpty>No media files.</CommandEmpty>

					<CommandGroup heading="Media files">
						<div className="flex flex-wrap gap-4 pt-4">
							{data?.Media.map((file) => (
								<CommandItem
									key={file.id}
									className="p-0 max-w-[300px] w-full rounded-lg !bg-transparent !font-medium !text-black dark:!text-white"
								>
									<MediaCard file={file} />
								</CommandItem>
							))}

							{!data?.Media.length && (
								<div className="flex items-center justify-center w-full flex-col">
									<FolderSearch
										size={200}
										className="dark:text-muted text-slate-300"
									/>
									<p className="text-muted-foreground ">
										Empty! no files to show.
									</p>
								</div>
							)}
						</div>
					</CommandGroup>
				</CommandList>
			</Command>
		</div>
	);
};
