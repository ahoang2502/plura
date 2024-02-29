"use client";

import { Media } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface MediaCardProps {
	file: Media;
}

export const MediaCard = ({}: MediaCardProps) => {
	const [loading, setLoading] = useState();
	const router = useRouter();

	return <div>MediaCard</div>;
};
