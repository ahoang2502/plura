"use client";

import {
	Agency,
	AgencySidebarOption,
	SubAccount,
	SubAccountSidebarOption,
} from "@prisma/client";
import clsx from "clsx";
import { ChevronsUpDown, Compass, Menu, PlusCircleIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { useModal } from "@/providers/modal-providers";
import Link from "next/link";
import { SubAccountDetails } from "../forms/SubAccountDetails";
import { CustomModal } from "../global/CustomModal";
import { AspectRatio } from "../ui/aspect-ratio";
import { Button } from "../ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "../ui/sheet";
import { Separator } from "../ui/separator";
import { icons } from "@/lib/constants";

interface MenuOptionsProps {
	defaultOpen?: boolean;
	subAccounts: SubAccount[];
	sidebarOpt: AgencySidebarOption[] | SubAccountSidebarOption[];
	sidebarLogo: string;
	details: any;
	user: any;
	id: string;
}

export const MenuOptions = ({
	defaultOpen,
	subAccounts,
	sidebarLogo,
	sidebarOpt,
	details,
	user,
	id,
}: MenuOptionsProps) => {
	const [isMounted, setIsMounted] = useState(false);

	const { setOpen } = useModal();

	const openState = useMemo(
		() => (defaultOpen ? { open: true } : {}),
		[defaultOpen]
	);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) return null;

	return (
		<Sheet modal={false} {...openState}>
			<SheetTrigger
				className="absolute left-4 top-4 z-[100] md:!hidden flex"
				asChild
			>
				<Button variant="outline" size="icon">
					<Menu className="" />
				</Button>
			</SheetTrigger>

			<SheetContent
				showX={!defaultOpen}
				side="left"
				className={clsx(
					"bg-background/80 backdrop-blur-xl fixed top-0 border-r-[1px] p-6",
					{
						"hidden md:inline-block z-0 w-[300px]": defaultOpen,
						"inline-block md:hidden z-[100] w-full": !defaultOpen,
					}
				)}
			>
				<div>
					<AspectRatio ratio={16 / 5}>
						<Image
							src={sidebarLogo}
							alt="sidebar logo"
							fill
							className="rounded-md object-contain"
						/>
					</AspectRatio>

					<Popover>
						<PopoverTrigger asChild>
							<Button
								className="w-full my-4 items-center flex justify-between py-8"
								variant="ghost"
							>
								<div className="flex items-center text-left gap-2">
									<Compass />
									<div className="flex flex-col ">
										{details.name}
										<span className="text-muted-foreground">
											{details.address}
										</span>
									</div>
								</div>

								<div className="">
									<ChevronsUpDown size={16} className="text-muted-foreground" />
								</div>
							</Button>
						</PopoverTrigger>

						{/* Search */}
						<PopoverContent className="w-80 h-80 mt-4 z-[100]">
							<Command className="rounded-lg ">
								<CommandInput placeholder="Search accounts..." />
								<CommandList className="pb-16 no-scrollbar">
									<CommandEmpty>No results found.</CommandEmpty>

									{(user?.role === "AGENCY_OWNER" ||
										user?.role === "AGENCY_ADMIN") &&
										user?.Agency && (
											<CommandGroup heading="Agency">
												<CommandItem className="!bg-transparent my-2 text-primary border-[1px] border-border p-2 rounded-md hover:!bg-muted cursor-pointer transition-all">
													{defaultOpen ? (
														<Link
															href={`/agency/${user?.Agency?.id}`}
															className="flex gap-4 w-full h-full"
														>
															<div className="relative w-60">
																<Image
																	src={user?.Agency?.agencyLogo}
																	alt="agency logo"
																	fill
																	className="rounded-md object-contain"
																/>
															</div>

															<div className="flex flex-col flex-1 ">
																{user?.Agency?.name}
																<span className="text-muted-foreground">
																	{user?.Agency?.address}
																</span>
															</div>
														</Link>
													) : (
														<SheetClose asChild>
															<Link
																href={`/agency/${user?.Agency?.id}`}
																className="flex gap-4 w-full h-full"
															>
																<div className="relative w-60">
																	<Image
																		src={user?.Agency?.agencyLogo}
																		alt="agency logo"
																		fill
																		className="rounded-md object-contain"
																	/>
																</div>

																<div className="flex flex-col flex-1 ">
																	{user?.Agency?.name}
																	<span className="text-muted-foreground">
																		{user?.Agency?.address}
																	</span>
																</div>
															</Link>
														</SheetClose>
													)}
												</CommandItem>
											</CommandGroup>
										)}

									<CommandGroup heading="Accounts">
										{!!subAccounts
											? subAccounts.map((subaccount) => (
													<CommandItem key={subaccount.id}>
														{defaultOpen ? (
															<Link
																href={`/subaccount/${subaccount.id}`}
																className="flex gap-4 w-full h-full"
															>
																<div className="relative w-60">
																	<Image
																		src={subaccount.subAccountLogo}
																		alt="subaccount logo"
																		fill
																		className="rounded-md object-contain"
																	/>
																</div>

																<div className="flex flex-col flex-1 ">
																	{subaccount.name}
																	<span className="text-muted-foreground">
																		{subaccount.address}
																	</span>
																</div>
															</Link>
														) : (
															<SheetClose asChild>
																<Link
																	href={`/subaccount/${subaccount.id}`}
																	className="flex gap-4 w-full h-full"
																>
																	<div className="relative w-60">
																		<Image
																			src={subaccount.subAccountLogo}
																			alt="agency logo"
																			fill
																			className="rounded-md object-contain"
																		/>
																	</div>

																	<div className="flex flex-col flex-1 ">
																		{subaccount.name}
																		<span className="text-muted-foreground">
																			{subaccount.address}
																		</span>
																	</div>
																</Link>
															</SheetClose>
														)}
													</CommandItem>
											  ))
											: "No accounts"}
									</CommandGroup>
								</CommandList>

								{/* Create Subaccount Modal */}
								{(user?.role === "AGENCY_OWNER" ||
									user?.role === "AGENCY_ADMIN") && (
									<SheetClose>
										<Button
											className="w-full flex gap-2"
											onClick={() => {
												setOpen(
													<CustomModal
														title="Create a SubAccount"
														subheading="You can swicth between your agency account and the subaccount from the sidebar"
													>
														<SubAccountDetails
															agencyDetails={user?.Agency as Agency}
															userId={user?.id as string}
															userName={user?.name}
														/>
													</CustomModal>
												);
											}}
										>
											<PlusCircleIcon size={15} />
											Create sub-account
										</Button>
									</SheetClose>
								)}
							</Command>
						</PopoverContent>
					</Popover>

					<p className="text-muted-foreground text-xs mb-2 ">MENU LINKS</p>

					<Separator className="mb-4" />
					<nav className="relative">
						<Command className="rounded-lg overflow-visible bg-transparent">
							<CommandInput placeholder="Search..." />

							<CommandList className="pb-16 overflow-visible py-4">
								<CommandEmpty>No results found.</CommandEmpty>

								<CommandGroup className="overflow-visible">
									{sidebarOpt.map((sidebarOptions) => {
										let val;

										const result = icons.find(
											(icon) => icon.value === sidebarOptions.icon
										);
										if (result) {
											val = <result.path />;
										}

										return (
											<CommandItem 
												key={sidebarOptions.id}
												className="md:w-[320px] w-full"
											>
												<Link
													href={sidebarOptions.link}
													className="flex items-center gap-2 hover:bg-transparent rounded-md transition-all md:w-full w-[320px]"
												>
													{val}
													<span>{sidebarOptions.name}</span>
												</Link>
											</CommandItem>
										);
									})}
								</CommandGroup>
							</CommandList>
						</Command>
					</nav>
				</div>
			</SheetContent>
		</Sheet>
	);
};
